const express = require('express')
const app = express()
const port = 3000

var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./database.sqlite')

db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS lorem (info TEXT)')
  db.run('delete from lorem')
  var stmt = db.prepare('INSERT INTO lorem VALUES (?)')

  for (var i = 0; i < 10; i++) {
    stmt.run('Ipsum ' + i)
  }

  stmt.finalize()

  db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
    console.log(row.id + ': ' + row.info)
  })
})

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/lorem', async (req, res, next) => {
  try {
    let lorem = [];
    await db.all('SELECT * FROM lorem LIMIT 10', [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        lorem.push(row.info);
        console.log(row.info);
      });
      res.format({
        'text/plain': function() {
          res.send(`Lorem : ${JSON.stringify(lorem)}`);
        },

        'text/html': function() {
          res.send(`<p>Lorem : ${JSON.stringify(lorem)}</p>`);
        },

        'application/json': function() {
          res.send(lorem);
        },

        'default': function() {
          // log the request and respond with 406
          res.status(406).send('Not Acceptable');
        }
      });
    });
  } catch (err) {
    next(err);
  }
});

let server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function cleanup () {
  shutting_down = true;
  server.close( function () {
    console.log( "Closed out remaining connections.");
    // Close db connections, other chores, etc.
    db.close();
    process.exit();
  });

  setTimeout( function () {
   console.error("Could not close connections in time, forcing shut down");
   process.exit(1);
  }, 30*1000);

}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
