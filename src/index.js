const youtube = require('youtube-api');
const fs = require('fs');

function playlistInfoRecursive(playlistId, callStackSize, pageToken, currentItems, customRequestAmount, callback) {
  youtube.playlistItems.list({
    part: 'snippet',
    pageToken: pageToken,
    maxResults: (customRequestAmount > 50 || !customRequestAmount ? 50 : customRequestAmount),
    playlistId: playlistId,
  }, function(err, data) {
    if (err) return callback(err);
    for (const x in data.items) {
      const info = data.items[x];
      info.snippet.channelURL = (info.snippet.channelId ? "https://www.youtube.com/channel/" + info.snippet.channelId : null);
      info.snippet.playlistURL = (info.snippet.playlistId ? "https://www.youtube.com/playlist?list=" + info.snippet.playlistId : null);
      if (info.snippet.resourceId) info.snippet.resourceId.videoURL = (info.snippet.resourceId.videoId ? "https://www.youtube.com/watch?v=" + info.snippet.resourceId.videoId : null)
      currentItems.push(info.snippet);
    }
    if (data.nextPageToken && (customRequestAmount > 50 || !customRequestAmount)) {
      playlistInfoRecursive(playlistId, callStackSize + 1, data.nextPageToken, currentItems, (customRequestAmount > 50 ? customRequestAmount - 50 : customRequestAmount), callback);
    } else {
      callback(null, currentItems);
    }
  });
}

module.exports = function playlistInfo(apiKey, playlistId, {maxResults}) {
  return new Promise((resolve, reject) => {
    if (!apiKey) return reject(new Error('No API Key Provided'));
    if (!playlistId) return reject(new Error('No Playlist ID Provided'));
    youtube.authenticate({
      type: 'key',
      key: apiKey
    });
    playlistInfoRecursive(playlistId, 0, null, [], maxResults, (err, list) => {
      if (err) return reject(err);
      return resolve(list);
    });
  });
};