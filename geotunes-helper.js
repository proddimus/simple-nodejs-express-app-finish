var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./database.sqlite')
const fs = require('fs')


const initDB = async function initDB() {
  musicData = {};
  try {
      await fs.readFile(`./music.json`, async function(err, fileContents) {
        if (err) {
          return console.log('Issue encountered processing file, script aborted.' + err);
          throw err;
        }
        const musicData = JSON.parse(fileContents);
        db.serialize(function() {
          db.run('CREATE TABLE IF NOT EXISTS artists (artist_id INTEGER PRIMARY KEY, name TEXT)')
          db.run('delete from artists')

          db.run('CREATE TABLE IF NOT EXISTS albums (album_id INTEGER PRIMARY KEY, title TEXT, description TEXT, artist_id INTEGER, FOREIGN KEY (artist_id) REFERENCES artists (artist_id) ON DELETE CASCADE ON UPDATE NO ACTION)')
          db.run('delete from albums')

          db.run('CREATE TABLE IF NOT EXISTS songs (song_id INTEGER PRIMARY KEY, title TEXT, length TEXT, album_id INTEGER, FOREIGN KEY (album_id) REFERENCES albums (album_id) ON DELETE CASCADE ON UPDATE NO ACTION)')
          db.run('delete from songs')

          var insertArtistStmt = db.prepare('INSERT INTO artists (artist_id, name) VALUES (?, ?)')
          var insertAlbumStmt = db.prepare('INSERT INTO albums (album_id, title, description, artist_id) VALUES (?, ?, ?, ?)')
          var insertSongStmt = db.prepare('INSERT INTO songs (title, length, album_id) VALUES (?, ?, ?)')

          for (var artist in musicData) {
            const thisArtist = musicData[artist];
            insertArtistStmt.run(thisArtist.artist_id, thisArtist.name);
            for (var album in thisArtist.albums) {
              const thisAlbum = thisArtist.albums[album];
              insertAlbumStmt.run(thisAlbum.album_id, thisAlbum.title, thisAlbum.description, thisArtist.artist_id);
              for (var song in thisAlbum.songs) {
                const thisSong = thisAlbum.songs[song];
                insertSongStmt.run(thisSong.title, thisSong.length, thisAlbum.album_id);
              }
            }
          }
        })
      });
  } catch (err) {
    console.log('Issue encountered processing file, script aborted.' + err);
    throw err;
  }
}

initDB();

const getArtist = async function getArtist(req, res, next) {
  try {
    let artists = [];
    db.all("SELECT * FROM artists", function(err, rows) {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        artists.push(row);
      });
      res.json(artists);
    });
  } catch (err) {
    next(err);
  }
}

const getAlbum = async function getAlbum(req, res, next) {
  try {
    let albums = [];
    db.all("SELECT * FROM albums", function(err, rows) {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        albums.push(row);
      });
      res.json(albums);
    });
  } catch (err) {
    next(err);
  }
}

const getSong = async function getSong(req, res, next) {
  try {
    let songs = [];
    db.all("SELECT * FROM songs", function(err, rows) {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        songs.push(row);
      });
      res.json(songs);
    });
  } catch (err) {
    next(err);
  }
}



module.exports = {
  getArtist,
  getAlbum,
  getSong
}
