var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./database.sqlite')
const fs = require('fs')
const validator = require('validator');


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

          db.run('CREATE TABLE IF NOT EXISTS songLocations (song_location_id INTEGER PRIMARY KEY, location TEXT, song_id INTEGER, FOREIGN KEY (song_id) REFERENCES songs (song_id) ON DELETE CASCADE ON UPDATE NO ACTION)')

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
        console.log("Completed load of Music Data");
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

const postArtist = async function postArtist(req, res, next) {
  try {
    getValidateArtist(req.body.name);
    let responseBody = req.body;
    await db.run('INSERT INTO artists (artist_id, name) VALUES (?, ?)', [req.body.artist_id, req.body.name]);
    responseBody.status = "success";
    res.json(responseBody);
  } catch (err) {
    next(err);
  }
}

const putArtist = async function putArtist(req, res, next) {
  try {
    getValidateArtist(req.body.name);
    let responseBody = req.body;
    await db.run('UPDATE artists set name = ? WHERE artist_id = ?', [req.body.name, req.params.artist_id]);
    responseBody.status = "success";
    res.json(responseBody);
  } catch (err) {
    next(err);
  }
}

const deleteArtist = async function deleteArtist(req, res, next) {
  try {
    let responseBody = req.body;
    await db.run('DELETE FROM artists WHERE artist_id = ?', [req.params.artist_id]);
    responseBody.status = "success";
    res.json(responseBody);
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

const getSongLocations = async function getSongLocations(req, res, next) {
  try {
    let songLocations = [];
    db.all("SELECT * FROM songLocations", function(err, rows) {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        songLocations.push(row);
      });
      res.json(songLocations);
    });
  } catch (err) {
    next(err);
  }
}

const deleteSongLocations = async function deleteSongLocations(req, res, next) {
  try {
    db.run("DELETE FROM songLocations", [], function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) deleted ${this.changes}`);
      res.json({result: "success"});
    });
  } catch (err) {
    next(err);
  }
}

const postSongLocation = async function putSongLocation(req, res, next) {
  try {
    getValidateLocation(req.body.location);
    let responseBody = req.body;
    await db.run('INSERT INTO songLocations (location, song_id) VALUES (?, ?)', [req.body.location, req.body.song_id]);
    responseBody.status = "success";
    res.json(responseBody);
  } catch (err) {
    next(err);
  }
}

const putSongLocation = async function putSongLocation(req, res, next) {
  try {
    getValidateLocation(req.body.location);
    let responseBody = req.body;
    const song_location_id = req.params.song_location_id;
    await db.run('INSERT OR REPLACE INTO songLocations (song_location_id, location, song_id) VALUES (?, ?, ?)', [song_location_id, req.body.location, req.body.song_id]);
    responseBody.status = "success";
    res.json(responseBody);
  } catch (err) {
    next(err);
  }
}

const getSongLocation = async function getSongLocation(req, res, next) {
  try {
    const song_location_id = req.params.song_location_id;
    let songLocations = [];
    db.get("SELECT * FROM songLocations WHERE song_location_id = ? ", [song_location_id], (err, row) => {
      res.json(row);
    });
  } catch (err) {
    next(err);
  }
}

const deleteSongLocation = async function deleteSongLocation(req, res, next) {
  try {
    const song_location_id = req.params.song_location_id;
    let songLocations = [];
    db.run("DELETE FROM songLocations WHERE song_location_id = ? ", [song_location_id], function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) deleted ${this.changes}`);
      res.json({result: "success"});
    });
  } catch (err) {
    next(err);
  }
}

const getValidateLocation = function getValidateLocation(location) {
  if(validator.isLatLong(location)) {
    return location;
  } else {
    throw new Error("Invalid Location");
  }
}

const getValidateArtist = function getValidateArtist(name) {
  if (validator.isEmpty(name)){
    throw new Error("Invalid Name");
  }
}

module.exports = {
  getArtist,
  postArtist,
  putArtist,
  deleteArtist,
  getAlbum,
  getSong,
  getSongLocations,
  deleteSongLocations,
  postSongLocation,
  putSongLocation,
  getSongLocation,
  deleteSongLocation,
  getValidateLocation
}
