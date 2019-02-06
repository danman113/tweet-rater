const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./tweets.db')

app.use(bodyParser.json())
app.use('/api', cors())

app.get('/api/tweet', (req, res) => {
  db.get('SELECT tweet_id FROM tweets ORDER BY RANDOM() LIMIT 1;', (err, { tweet_id = '20' }) => {
    res.json({ tweet: tweet_id })
  })
})

app.get('/api/ratings', (req, res) => {
  db.all(`
    SELECT
      text,
      spam,
      anger,
      political,
      humor,
      sexual,
      sarcasm
    FROM
      ratings
    LEFT JOIN tweets ON tweets.tweet_id = ratings.tweet_id;
  `, (err, ratings) => {
    console.log(ratings)
    res.json({ ratings })
  })
})

app.post('/api/tweet', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const {
    spam = 0,
    anger = 0,
    sexual = 0,
    humor = 0,
    sarcasm = 0,
    political = 0,
    tweet_id
  } = req.body
  if (!tweet_id) {
    res.status(400)
    res.json({
      err: 'Invalid Tweet'
    })
  }

  const data = {
    $tweet_id: tweet_id,
    $user_id: ip,
    $spam: spam,
    $anger: anger,
    $political: political,
    $humor: humor,
    $sexual: sexual,
    $sarcasm: sarcasm,
  }

  console.log(data)

  try {
    db.run(`
        INSERT INTO ratings (
          tweet_id,
          user_id,
          spam,
          anger,
          political,
          humor,
          sexual,
          sarcasm
        )
        VALUES (
          $tweet_id,
          $user_id,
          $spam,
          $anger,
          $political,
          $humor,
          $sexual,
          $sarcasm
        )`, data)
  } catch (e) {
    res.status(500)
  }
  res.json({})
})

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})


app.use('/dist', express.static(__dirname + '/dist'))

app.listen(process.env.PORT || 3001, () => console.log('App started'))
