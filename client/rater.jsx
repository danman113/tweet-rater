import React from 'react'

const MAX_RATING = 5
const Field = ({ label = '', rating = 0, updateState }) => (
  <div className='field is-horizontal'>
    <div className='field-label'>
      <label className='label is-capitalized'>{label}: </label>
    </div>
    <div className='field-body'>
      <div className='control'>
        <div className='buttons has-addons'>
          {Array.from({ length: MAX_RATING }).map((elem, i) => (
            <div
              key={i}
              onClick={updateState(i + 1)}
              className={`button ${(i + 1) === rating ? 'is-info is-selected' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const defaultState = {
  spam: 0,
  sexual: 0,
  humor: 0,
  sarcasm: 0,
  anger: 0,
  political: 0
}

export default class Rater extends React.Component {
  state = defaultState

  reset () {
    this.setState(defaultState)
  }

  updateState = label => value => e => {
    this.setState({
      [label]: value
    })
  }

  submit = async () => {
    const { fetchTweet, tweetId } = this.props
    const res = await fetch('/api/tweet', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrer: 'client',
      body: JSON.stringify({ ...this.state, tweet_id: tweetId })
    })
    if (res.ok) {
      this.reset()
      fetchTweet()
    } else {
      alert('Error sending to server. Please try again.')
    }
  }

  onKeyUp = ({ key = '0' }) => {
    const keys = Object.keys(this.state)
    const isDone = keys.every(elem => this.state[elem] > 0)
    const keyCode = +key
    if (isDone) {
      this.submit()
      return null
    }

    if (keyCode > 0 && keyCode < 6) {
      for (let label in this.state) {
        if (this.state[label] <= 0) {
          this.setState({
            [label]: keyCode
          })
          return null
        }
      }
    } else {
      if (key === 'Enter') {
        this.submit()
      }
    }
  }

  componentDidMount () {
    document.addEventListener('keyup', this.onKeyUp)
  }

  componentWillUnmount () {
    document.removeEventListener('keyup', this.onKeyUp)
  }

  render () {
    const keys = Object.keys(this.state)
    const isDone = keys.every(elem => this.state[elem] > 0)
    return (
      <div className='columns'>
        <div className='column'>
          <h2>Rate This Tweet</h2>
          {
            keys.map((elem, i) => (
              <Field label={elem} rating={this.state[elem]} updateState={this.updateState(elem)} />
            ))
          }
          { isDone && <div className='button is-primary' onClick={this.submit}>Submit</div> }
        </div>
      </div>
    )
  }
}
