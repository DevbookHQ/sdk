import { DevbookFlock } from './devbookFlock'
import { Behavior } from './devbookSimulator'
import randomItem from './randomItem'
import randomNumber from './randomNumber'
import wait from './wait'

const behaviors: Behavior[] = [
  // async (devbook) => {
  //   devbook.runCmd('ls')
  //   devbook.runCmd('ls')
  //   devbook.runCmd('ls')
  // },
  async d => {
    await d.fs.write('/hello', 'world')
    const c = await d.fs.get('/hello')
    console.log('OUT', c)
  },
  // (devbook) => devbook.fs.write('/index.js', 'console.log("testing")'),
  // async () => { },
]

const randomBehavior: Behavior = (devbook) => {
  const behavior = randomItem(behaviors)
  return behavior(devbook)
}

const initialPopulation = 1
const idealPopulation = 1
const populationStep = 2

function evolvePopulation(flock: DevbookFlock) {
  if (flock.size > idealPopulation) {
    flock.size -= 1
    // flock.size -= randomNumber(populationStep)
  } else if (flock.size < idealPopulation) {
    flock.size += 1
    // flock.size += randomNumber(populationStep)
  } else {
    // flock.size += randomNumber(populationStep) - Math.ceil(populationStep / 2)
  }
}

const tickInterval = 2

async function simulate() {
  console.log('Starting stress test')
  console.log('--------------------')

  const flock1 = new DevbookFlock('banana-node', initialPopulation)
  // const flock2 = new DevbookFlock('banana-python', initialPopulation)

  let tick = 0

  while (true) {
    tick++
    console.log(`[Tick #${tick}] Current sessions: ${flock1.size /*+ flock2.size*/}, Elapsed time: ${tickInterval * tick} seconds`)

    console.log('Flock1 outputs', {
      stdouts: flock1.devbooks.map(d => d.stdout),
      stderrs: flock1.devbooks.map(d => d.stderr),
    })

    console.log('flock1 stats', flock1.stats)
    // console.log('flock2 stats', flock2.stats)

    evolvePopulation(flock1)
    // evolvePopulation(flock2)

    flock1.tick(randomBehavior)
    // flock2.tick(randomBehavior)

    console.log('--------------------')
    await wait(tickInterval * 1000)
  }
}

simulate()
