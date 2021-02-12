CREATE TABLE IF NOT EXISTS tweets (
  id INTEGER PRIMARY KEY,
  text TEXT NOT NULL,
  username TEXT NOT NULL,
  tweet_id TEXT NOT NULL UNIQUE,
  sentiment INTEGER default 0,
  sentiment_spam INTEGER default 0,
  sentiment_anger INTEGER default 0,
  sentiment_political INTEGER default 0,
  sentiment_humor INTEGER default 0,
  sentiment_sexual INTEGER default 0,
  dateAdded INTEGER default (datetime(current_timestamp))
);

CREATE TABLE IF NOT EXISTS ratings (
  id INTEGER PRIMARY KEY,
  tweet_id TEXT NOT NULL,
  user_id TEXT NOT NULL,  --- IP Address
  spam INTEGER default 0,
  anger INTEGER default 0,
  political INTEGER default 0,
  humor INTEGER default 0,
  sexual INTEGER default 0,
  sarcasm INTEGER default 0,
  dateAdded INTEGER default (datetime(current_timestamp)),
  FOREIGN KEY(tweet_id) REFERENCES tweets(tweet_id)
);
