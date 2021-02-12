const fetch = require('node-fetch')
const brain = require('brain.js')
const fs = require('fs')
const main = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/ratings')
    const { ratings } = await res.json()
    const train = ratings.map(({ text, ...rest }) => ({input: text, output: Object.values(rest)})).filter(elem => elem.output.reduce((a,b) => a + b, 0) > 6)
    console.log(train.map(a => a.output))

    let trainingData
    try {
      trainingData = JSON.parse(fs.readFileSync('trainingData.json', 'utf8'))
    } catch (e) {}

    let net = new brain.recurrent.LSTM()
    trainingData && net.fromJSON(trainingData)
    net.train(train, {
      iterations: 1000,
      errorThresh: 0.025,
      log: console.log
    })
      fs.writeFileSync('trainingData.json', JSON.stringify(net.toJSON()), 'utf8')

      console.log('Outputs')
      // console.log(Array.from(net.run('Trump keeps looking left. He’s having a hard')))
    // console.log(Array.from(net.run('She’s a liar! And 100% liar not 1/1024 liar!')))
    // console.log(Array.from(net.run('Hello this is text')))
    // console.log(Array.from(net.run('woah wtf!!!')))
    // console.log(Array.from(net.run('When our President @realDonaldTrump said we need to get rid of Human')))
    var stdin = process.openStdin();
    stdin.addListener('data', d => {
      const text = d.toString().trim()
      const labels = ["spam", "anger", "political", "humor", "sexual", "sarcasm"]
      const data = Array.from(net.run(text))
      data.forEach((d, i) => {
        console.log(labels[i] + ': ' + d)
      })
    })
  } catch (e) {
    console.log(e)
  }
}
try {
  main()
} catch (e) {
  console.log(e)
}

// const net = new brain.recurrent.LSTM()

// console.log(trainingData)

// net.train(trainingData, {
//   iterations: 250,
//   errorThresh: 0.011,
//   log: console.log
// })

// console.log(net.run('I am unhappy!'));
// console.log(net.run('I am happy!'));
// console.log(net.run('fuck trump!'));
