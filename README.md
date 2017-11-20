# Youtube Playlist Info

Youtube Playlist Info is a library that fetches all the information for the songs within a playlist then returns them as one big array. This abstracts away the annoying paging of requests that have to be done when handling the API manually.

The library does not currently emit progress events, however pull requests are welcome.

### Installation
```sh
npm install --save youtube-playlist-info
```

### Usage
```js
const ypi = require('youtube-playlist-info');
ypt("YouTube API Key", "Playlist ID").then(items => {
  console.log(items);
}).catch(console.error);
```

### Testing

```sh
set API_KEY=YouTube API Key
node test.js
```

This should just spit out a bunch of items in the playlist followed by the length of the playlist.
