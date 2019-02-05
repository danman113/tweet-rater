const express = require('express')
const path = require('path')
const app = express()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./tweets.db')

app.get('/api/tweet', (req, res) => {
  db.get('SELECT tweet_id FROM tweets ORDER BY RANDOM() LIMIT 1;', (err, { tweet_id = '20' }) => {
    res.json({ tweet: tweet_id })
  })
})
app.post('/api/tweet', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip)
})

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})


app.use('/dist', express.static(__dirname + '/dist'))

app.listen(process.env.PORT || 3001, () => console.log('App started'))
