const express = require('express')
const helper = require('./geotunes-helper')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.json({message: 'Hello World!'}));

app.get('/artist', async (req, res, next) => {
  helper.getArtist(req, res, next);
});

app.post('/artist', async (req, res, next) => {
  helper.postArtist(req, res, next);
});

app.put('/artist/:artist_id', async (req, res, next) => {
  helper.putArtist(req, res, next);
});

app.delete('/artist/:artist_id', async (req, res, next) => {
  helper.deleteArtist(req, res, next);
});

app.get('/album', async (req, res, next) => {
  helper.getAlbum(req, res, next);
});

app.get('/albumByArtist/:artist_id', async (req, res, next) => {
  helper.getAlbumsByArtist(req,res,next);
});

app.get('/song', async (req, res, next) => {
  helper.getSong(req, res, next);
});

app.get('/songLocation', async (req, res, next) => {
  helper.getSongLocations(req, res, next);
})

app.delete('/songLocation', async (req, res, next) => {
  helper.deleteSongLocations(req, res, next);
})

app.post('/songLocation', (req, res, next) => {
  helper.postSongLocation(req, res, next);
})

app.put('/songLocation/:song_location_id', (req, res, next) => {
  helper.putSongLocation(req, res, next);
})

app.get('/songLocation/:song_location_id', async (req, res, next) => {
  helper.getSongLocation(req, res, next);
})

app.delete('/songLocation/:song_location_id', async (req, res, next) => {
  helper.deleteSongLocation(req, res, next);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
