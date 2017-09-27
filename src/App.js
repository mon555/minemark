import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
// Library
import ClientInfo from './lib/clientInfo'
import Runner from './lib/Runner'

// Services
import Collector from './services/Collector'

// Components
import Stage from './components/Stage'
import Meter from './components/Meter'
import Terminal from './components/Terminal'
import Cars from './components/Cars'
import CoinHive from './components/CoinHive'
// TODO // import { onShare } from './components/Share'
import { Buttonz } from './styles/buttons'
import { icon_facebook } from './styles/icons'

// Styles
import styled from 'styled-components'

const Containerz = styled.div`
  text-align: center
`
const COIN_HIVE_SITE_KEY = 'QCLjDlh3Kllh2aj3P0cW6as65eZH3oeK'

class App extends Component {
  constructor (props) {
    super(props)

    this.clientInfo = new ClientInfo().getData()
    this.collector = new Collector()

    // Ranking
    const ranking = [
      {
        min: 21.27,
        max: 32.44,
        thread: 4,
        browserName: 'Chrome',
        browserVersion: '60.0.3112.113'
      },
      {
        min: 19.61,
        max: 24.23,
        thread: 4,
        browserName: 'Firefox',
        browserVersion: '60.0.3112.113'
      },
      {
        min: 15.77,
        max: 18.45,
        thread: 4,
        browserName: 'Safari',
        browserVersion: '60.0.3112.113'
      },
      {
        min: 7.54,
        max: 8.98,
        thread: 4,
        browserName: 'Edge',
        browserVersion: '60.0.3112.113'
      },
      {
        min: 5.54,
        max: 6.98,
        thread: 4,
        browserName: 'Opera',
        browserVersion: '1.2.1'
      }
    ]

    this.state = {
      status: `INIT`,
      ranking
    }
  }

  onInit = miner => {
    setInterval(
      () =>
        miner &&
        this.onMining({
          hashesPerSecond: miner.getHashesPerSecond(),
          totalHashes: miner.getTotalHashes(),
          acceptedHashes: miner.getAcceptedHashes()
        }),
      1000
    )
  }

  onMining = ({ hashesPerSecond = 0, totalHashes = 0, acceptedHashes = 0 }) => {
    this.hps = hashesPerSecond
    this.terminal.update(`⛏ Mining...${Number(this.hps).toPrecision(8)}`)
  }

  onFound = () => this.terminal.update('💎 Found!')
  onAccepted = () => this.terminal.update('💵 Accepted!')
  onError = err => this.terminal.update(`🔥 Error! ${err}`)

  componentDidMount = () => {
    this.svg = document.getElementById('svg')

    // Meter
    this.meter = new Meter(this.svg)

    // Terminal
    this.terminal = new Terminal(this.svg)
    this.terminal.update('⚡ Initializing...')

    // Gimmick
    this.cars = new Cars(this.svg)

    // Runner
    this.runner = new Runner(this.onRun)
    this.runner.startLoop()

    const DevicesQuery = gql`
    query {
      allDevices {
        browserName
        browserVersion
        thread
        min
        max
      }
    }`

    this.props.client
      .query({
        query: DevicesQuery
      })
      .then(res =>
        this.setState({
          ranking: res.data.allDevices
        })
      )
  }

  componentWillUnmount = () => this.runner.stopLoop()

  onRun = () => {
    // Move car
    this.cars.update()

    // HPS
    this.meter.update(this.hps)
  }

  onShareClick = e => {
    console.log(e.target)
    // TODO : const json = await onShare(this.svg)
  }

  render () {
    return (
      <Containerz>
        <Containerz>
          <Stage clientInfo={this.clientInfo} ranking={this.state.ranking} />
          <CoinHive
            status={this.state.status}
            siteKey={COIN_HIVE_SITE_KEY}
            onInit={miner => this.onInit(miner)}
            onFound={() => this.onFound()}
            onAccepted={() => this.onAccepted()}
            onError={err => this.onError(err)}
          />
        </Containerz>
        <Buttonz onClick={e => this.onShareClick(e)}>
          {icon_facebook}
          <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>SHARE</span>
        </Buttonz>
        <div style={{ width: 0, height: 0, overflow: 'hidden' }}><canvas id='canvas' width='640' height='640' /></div>
      </Containerz>
    )
  }
}

export default App
