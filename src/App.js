/* eslint-disable */
import React from 'react';
import { HashRouter, Switch, Route, withRouter, NavLink } from 'react-router-dom'


import { Grid, Segment, Header, Image, Icon, Container, List, Transition, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import BigMonitor from './bigMonitor.js'
import Settings from './settings.js'

import './main.css'
import logo from './PacketMonitor.png';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: BigMonitor,
    }

    this.formatBytes = this.formatBytes.bind(this)
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

  async componentDidMount() {

  }


  render() {

    return (
      <div className={'AppBG'}>
        <HashRouter>

          <Header textAlign='center' as='h2' style={{ marginTop: "30px" }}>
            <Image src={logo} centered /> <br />
            Packet Monitor
          </Header>
          <Container textAlign='center' >

            <Container className={'ListBG'} style={{ marginTop: "20px" }}>
              <Grid columns={"equal"} divided>
                <Grid.Row>

                  <Grid.Column>
                    <List style={{ margin: "2px" }}>
                      <List.Item>
                        <List.Content>
                          <Button style={{ backgroundColor: this.state.visible == Settings ? "#a1a1a1" : "" }} fluid icon='settings' onClick={() => { this.setState({ visible: Settings }) }} />
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>

                  <Grid.Column>
                    <List style={{ margin: "2px" }}>
                      <List.Item>
                        <List.Content>
                          <Button style={{ backgroundColor: this.state.visible == BigMonitor ? "#a1a1a1" : "" }} fluid icon='bars' onClick={() => { this.setState({ visible: BigMonitor }) }} />
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>

                  <Grid.Column>
                    <List style={{ margin: "2px" }}>
                      <List.Item>
                        <List.Content>
                          <Button fluid icon='question circle' />
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>

                </Grid.Row>
              </Grid>
            </Container>
          </Container>

          <Route path="/" exact component={this.state.visible} state={this.state} />

        </HashRouter>
      </div>
    );
  }
}


export default App