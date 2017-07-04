var request = require('request');

//fill in your access token here instead of process.argv[2];

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
  request(getRequestOptions(repoOwner, repoName), function (error, response, body) {
    try {
      const data = JSON.parse(body);
      callback(data);
    } catch (err) {
      console.log('Failed to parse content body');
    }
  });
}


// Calls the function with the inputs of the username, repo, and callback function that filters out only avatar URLs

getRepoContributors("jquery", "jquery", function (data) {
  data.forEach(function(data) {
    console.log(data.avatar_url);
  });
});

