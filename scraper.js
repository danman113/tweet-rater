const twit = require('twit')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./tweets.db')
const create = fs.readFileSync( `${__dirname}/create.sql`, { encoding: 'utf8' })

db.serialize(() => {
  const statements = create.split(';').filter(s => Boolean(s.trim()))
  for (let stmnt of statements) {
    db.run(`${stmnt};`)
  }
})

let acc = new twit({
  consumer_key: process.env.pwnlib_consumer_key,
  consumer_secret: process.env.pwnlib_consumer_secret,
  access_token: process.env.pwnlib_access_token,
  access_token_secret: process.env.pwnlib_access_token_secret,
  timeout_ms: 60 * 1000
})

// acc.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
//   console.log(data)
// })

// var stream = acc.stream('statuses/filter', { track: 'mango' })

// stream.on('tweet', function (tweet) {
//   console.log(tweet.text)
// })

// acc.get('search/tweets', {
//   q: '#nodejs, #Nodejs',
//   result_type: 'recent',
//   lang: 'en'
// }, (err, data) => {
//   data.statuses.forEach(tweet => {
//     console.log(tweet.text)
//   })
// })

const removeLinksRegex = /(?:https?|ftp):\/\/[\n\S]+/gi
const removeLinks = url => url.replace(removeLinksRegex, '')
const removeAtsRegex = /(RT )?(\@\S+\s?)+/gi
const removeAts = str => str.replace(removeAtsRegex, '')
const getText = tweet => {
  const extendedTweet = tweet.extended_tweet || (tweet.retweeted_status && tweet.retweeted_status.extended_tweet)
  if (extendedTweet) {
    const [l, r] = extendedTweet.display_text_range
    // console.log('extended')
    // console.log(extendedTweet.full_text.substr(l, r))
    return extendedTweet.full_text.substr(l, r)
  } else {
    // console.log('normal')
    // console.log(tweet.text)
    return tweet.text
  }
}

const insertTweet = tweet => {
  const text = removeAts(removeLinks(getText(tweet)))
  console.log(text)
  db.run('INSERT INTO tweets (text, username, tweet_id) VALUES ($text, $username, $tweet_id)', {
    $text: text,
    $username: tweet.user.screen_name,
    $tweet_id: tweet.id_str
  })
}

var stream = acc.stream('statuses/sample', {language: 'en', tweet_mode: 'extended'})

stream.on('tweet', tweet => {
  insertTweet(tweet)
})