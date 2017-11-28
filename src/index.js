const youtube = require('youtube-api');
const fs = require('fs');

function playlistInfoRecursive(playlistId, callStackSize, pageToken, currentItems, callback) {
  youtube.playlistItems.list({
    part: 'snippet',
    pageToken: pageToken,
    maxResults: 50,
    playlistId: playlistId,
  }, function(err, data) {
    if (err) return callback(err);
    for (const x in data.items) {
      currentItems.push(data.items[x].snippet);
    }
    if (data.nextPageToken) {
      playlistInfoRecursive(playlistId, callStackSize + 1, data.nextPageToken, currentItems, callback);
    } else {
      callback(null, currentItems);
    }
  });
}

module.exports = function playlistInfo(apiKey, playlistId) {
  return new Promise((resolve, reject) => {
    if (!apiKey) return reject(new Error('No API Key Provided'));
    if (!playlistId) return reject(new Error('No Playlist ID Provided'));
    youtube.authenticate({
      type: 'key',
      key: apiKey
    });
    playlistInfoRecursive(playlistId, 0, null, [], (err, list) => {
      if (err) return reject(err);
      return resolve(list);
    });
  });
};