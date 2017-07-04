var request = require('request');
var userToken = "00836d766c9649831a6eb932ddd083086a521e1d"

console.log('Welcome to the GitHub Avatar Downloader!');


function getRequestOptions(repoOwner, repoName) {
  return {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/" + "contributors",
    headers: {
      'User-Agent': 'kittenfingers'
    },
    qs: {
      access_token: userToken
    }
  };
}

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

function filterContributors () {

}


getRepoContributors("jquery", "jquery", function (data) {
  data.forEach(function(data) {
    console.log(data.avatar_url);
  });
});

