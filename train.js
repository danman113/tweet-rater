const fetch = require('node-fetch')
const brain = require('brain.js')
const fs = require('fs')
const main = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/ratings')
    const { ratings } = await res.json()
    const train = ratings.map(({ text, ...rest }) => ({input: text, output: [rest.political, rest.spam]}))
    console.log(train[1])

    let trainingData
    try {
      trainingData = JSON.parse(fs.readFileSync('trainingData.json', 'utf8'))
    } catch (e) {}

    let net = new brain.recurrent.LSTM()
    trainingData && net.fromJSON(trainingData)
    net.train(train, {
        iterations: 2500,
        errorThresh: 0.011,
        log: console.log
      })
      fs.writeFileSync('trainingData.json', JSON.stringify(net.toJSON()), 'utf8')

      console.log('Outputs')
      console.log(net.run('Trump keeps looking left. He’s having a hard'))
      console.log(net.run('She’s a liar! And 100% liar not 1/1024 liar!'))
      console.log(net.run('Hello this is text'))
      console.log(net.run('woah wtf!!!'))
    } catch (e) {
      console.log(e)
    }
}
try {
  main()
} catch (e) {
  console.log(e)
}

// const trainingData = [
//   {
//     "input": "On Sale 32 Years Ago Today...\nJusti",
//     "output": 1
//   },
//   {
//     "input": "LOUDER PLEASE",
//     "output": 1
//   },
//   {
//     "input": "Trump keeps looking left. He’s having a hard",
//     "output": 5
//   },
//   {
//     "input": "It's official -- will be at the 2019 #GRAMMYs:  💜 ",
//     "output": 1
//   },
//   {
//     "input": "Must be real nice!",
//     "output": 1
//   },
//   {
//     "input": "Putting my hair in a ponytail ",
//     "output": 1
//   },
//   {
//     "input": "did you get tired of me?",
//     "output": 1
//   },
//   {
//     "input": "You’re so precious",
//     "output": 1
//   },
//   {
//     "input": "Real justice warriors &gt; social justice warriors. ",
//     "output": 5
//   },
//   {
//     "input": "people always remember what you did to ",
//     "output": 1
//   },
//   {
//     "input": "Instead of saying “I’m broke” just say “I don’t have AirPods”",
//     "output": 1
//   },
//   {
//     "input": "Svech wanted more.\n\nThe #Canes have four! #TakeWarning ",
//     "output": 1
//   },
//   {
//     "input": "Wow that's great! And the tractor is so helpful! I like this game!",
//     "output": 1
//   },
//   {
//     "input": "smh i fucked wi liam neeson to smh",
//     "output": 1
//   },
//   {
//     "input": "I think it’s a reference to “pigs at the trough” #badparrot",
//     "output": 1
//   },
//   {
//     "input": "Elizabeth Warren, over and out ",
//     "output": 5
//   },
//   {
//     "input": "porn magazines xxx hardcore sex pictu ",
//     "output": 1
//   },
//   {
//     "input": "\"It's not what happens to you, but how ",
//     "output": 1
//   },
//   {
//     "input": "good meme",
//     "output": 1
//   },
//   {
//     "input": "Amen. No, wait. \n\n*Agree. We meant \"agree.\" ",
//     "output": 5
//   },
//   {
//     "input": "A look at Venezuela where Maduro hit squads",
//     "output": 5
//   },
//   {
//     "input": "KlanWomen cheering themselves....#SOTU",
//     "output": 5
//   },
//   {
//     "input": "Always here to support LOL",
//     "output": 1
//   },
//   {
//     "input": "Kkkk kkkk stop chasing shadows Bra",
//     "output": 1
//   },
//   {
//     "input": "I support you",
//     "output": 1
//   },
//   {
//     "input": "Presenting the greatest individual SuperCoach effo",
//     "output": 1
//   },
//   {
//     "input": "\"We have a moral duty to create an immigration system that",
//     "output": 5
//   },
//   {
//     "input": "One reason Trump's State of the Union feels like it matters less is b",
//     "output": 5
//   }
// ].map(({ input, output: o }) => ({ input, output: [o] }))

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
