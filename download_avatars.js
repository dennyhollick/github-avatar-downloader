//For a user to initialize, please download your own access token below and use first two command line arguments
//to specify the owner and repository you wish to download from.
//command line eg. node download_avatar.js <repoOwner> <repoName>

//These are required variables and the process.argv that will be the input for the user to download the repository photos

var request = require('request');
var fs = require('fs');
var repoOwner = process.argv[2];
var repoName = process.argv[3];



//fill in your github personal access token here instead of process.argv[2];, create one here: https://github.com/settings/tokens
//alternatively, keep process.argv[4] and pass your token as an additional arugment on the command line.
//eg. node download_avatar.js <repoOwner> <repoName> <token>

var accessToken = process.argv[4];

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

// Gets the API data and parses it

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

// downloads all of the image URLs after they have been fetched and copies them to the specified filepath.

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


//does a check to make sure the command line arguments are valid for a lookup.

if (repoOwner === undefined || repoName === undefined) {
  console.log("Command line arguments are incorrect. Submit in the format: $node download_avatar.js <repoOwner> <repoName> \n eg. $node download_avatar.js jquery jquery");
}

else if (accessToken === undefined) {
  console.log("You are missing a personal access token. Either add it to download_avatars.js, or add it as the third command line argument. \n eg. $node download_avatar.js <repoOwner> <repoName> <token>");
}

// Calls the function with the inputs of the repo owner, repo, and callback function that brings in parsed URL data to fetch.

else {

getRepoContributors(repoOwner, repoName, function (data) {
  data.forEach(function(data) {
    downloadImageByURL(data.avatar_url, "avatars/" + data.login + ".jpg");
  });
});

}