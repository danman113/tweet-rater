import React from 'react'
import ReactDOM from 'react-dom'
import { Tweet } from 'react-twitter-widgets'
import Rater from './rater'
import 'whatwg-fetch'

class App extends React.Component {
  state = { tweet: '' }
  componentDidMount () {
    this.fetchTweet()
  }
  fetchTweet = async () => {
    const res = await fetch('/api/tweet')
    const { tweet } = await res.json()
    this.setState({
      tweet
    })
  }
  render () {
    const { tweet } = this.state
    return (
      <div>
        <div className="container">
          <div className="columns">
            <div className="column">
              <h1 className="title has-text-centered">Tweet Rater</h1>
            </div>
          </div>
          <div className="columns is-centered">
            <div className="column is-half">
              {tweet && <Tweet tweetId={tweet} />}
            </div>
          </div>
          <Rater fetchTweet={this.fetchTweet} tweetId={tweet} />
        </div>
        <footer className="footer">
          <div className="content has-text-centered">
            <p>
              Tweet Rater is not responsible for the tweets you're about to see. Possibly not safe for work.
            </p>
          </div>
        </footer>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('main'))
