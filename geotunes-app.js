const express = require('express')
const helper = require('./geotunes-helper')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/artist', async (req, res, next) => {
  helper.getArtist(req, res, next);
});

app.get('/album', async (req, res, next) => {
  helper.getAlbum(req, res, next);
});

app.get('/song', async (req, res, next) => {
  helper.getSong(req, res, next);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
