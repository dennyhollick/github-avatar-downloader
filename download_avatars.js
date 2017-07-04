var request = require('request');
var fs = require('fs');

//fill in your github personal access token here instead of process.argv[2];, create one here: https://github.com/settings/tokens

var accessToken = process.argv[2];

console.log('Welcome to the GitHub Avatar Downloader!');


// Forms the URL and header to request API data

function getRequestOptions(repoOwner, repoName) {
  return {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/" + "contributors",
    headers: {
      'User-Agent': 'kittenfingers'
    },
    qs: {
      access_token: accessToken
    }
  };
}

// Gets the API data

function getRepoContributors(repoOwner, repoName, callback) {
  console.log("Looking for and downloading images from " + repoName + " to /avatar... Please wait.");
  request(getRequestOptions(repoOwner, repoName), function (error, response, body) {
    try {
      const data = JSON.parse(body);
      callback(data);
    } catch (err) {
      console.log('Failed to parse content body');
    }
  });
}

// downloads all of the image URLs after they have been fetched to specified filepath.

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
    throw err;
  })
    .on('response', function (response){
      response.pipe(fs.createWriteStream(filePath));
    })
    .on('end', function (){
      console.log("Downloading: " + url + "   ========>   " + filePath);
    });
  }


// Calls the function with the inputs of the username, repo, and callback function that filters out only avatar URLs

getRepoContributors("jquery", "jquery", function (data) {
  data.forEach(function(data) {
    downloadImageByURL(data.avatar_url, "avatars/" + data.login + ".jpg");
  });
});

