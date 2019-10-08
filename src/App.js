/* eslint-disable */
import React from 'react';
import { HashRouter, Switch, Route, withRouter, NavLink } from 'react-router-dom'


import { Grid, Segment, Header, Image, Icon, Container, List, Transition, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import BigMonitor from './bigMonitor.js'

import './main.css'
import logo from './PacketMonitor.png';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.formatBytes = this.formatBytes.bind(this)

    this.state = {
      visible: true,

    }
  }


  formatBytes(bytes, decimals = 3, size = "MB") {
    var k = 1024
    var dm = decimals > 3 ? 3 : decimals
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var i = Math.floor(Math.log(bytes) / Math.log(k)) // Auto

    let sizeNumber = size === "Auto" ? i : sizes.indexOf(size)
    if (bytes === 0) return 0 + `${sizes[sizeNumber]}`
    return (bytes / Math.pow(k, sizeNumber)).toFixed(dm) + `${sizes[sizeNumber]}`;
  }

  toggleVisibility = () =>
    this.setState((prevState) => ({ visible: !prevState.visible }))

  componentDidMount() {
    console.log(window.screen.height + " x " + window.screen.width)
  }



  render() {
    let { visible } = this.state
    return (
      <div className={'AppBG'}>
        <HashRouter>

          <Header textAlign='center' as='h2' style={{ marginTop: "40px" }}>
            <Image src={logo} centered /> <br />
            Packet Monitor
          </Header>

          <Transition visible={visible} animation='scale' duration={500}>
            <Route path="/" exact component={BigMonitor} />
          </Transition>

        </HashRouter>
      </div>
    );
  }
}


export default App