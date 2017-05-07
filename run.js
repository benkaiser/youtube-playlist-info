var youtube = require('youtube-api');
var fs = require('fs');

function playlistInfoRecursive(playlistId, callStackSize, pageToken, currentItems, maxResults, callback) {
  youtube.playlistItems.list({
    part: 'snippet',
    pageToken: pageToken,
    maxResults: maxResults,
    playlistId: playlistId,
  }, function(err, data) {
    if (err) callback({error: err}); return;
    for (var x in data.items) {
      currentItems.push(data.items[x].snippet);
    }
    if (data.nextPageToken) {
      playlistInfoRecursive(playlistId, callStackSize + 1, data.nextPageToken, currentItems, callback);
    } else {
      callback(currentItems);
    }
  });
}

exports.playlistInfo = function(apiKey, playlistId, maxResults, callback) {
  if (typeof maxResults === 'function') {
    callback = maxResults;
    maxResults = 50;
  } else if (typeof maxResults !== 'number' && maxResults) {
    return throw new Error("Invalid Type of Max Results");
  } else if (!maxResults) {
    maxResults = 50;
  }
  youtube.authenticate({
    type: 'key',
    key: apiKey,
  });
  playlistInfoRecursive(playlistId, 0, null, [], maxResults, callback);
};

// pullPlayList("playlist id here", "name of mp3 here");
