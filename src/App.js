/* eslint-disable */
import React from 'react';
import { HashRouter, Switch, Route, withRouter, NavLink } from 'react-router-dom'


import { Grid, Segment, Header, Image, Icon, Container, List, Transition, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import BigMonitor from './bigMonitor.js'
import Settings from './settings.js'

import './main.css'
import logo from './PacketMonitor.png';

var Datastore = window.require('nedb')
var path = window.require('path')
var moment = window.require('moment')
var { remote } = window.require('electron')

var DatabasePath = localStorage.getItem('DatabasePath') ? path.join(localStorage.getItem('DatabasePath'), "packetMonitor.db") : `${path.join(remote.app.getPath('userData'), "packetMonitor.db")}`
// var nedb = new Datastore({ filename: DatabasePath, autoload: true });

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: BigMonitor,
      DatabasePath: DatabasePath,

      getData: this.getData.bind(this)
    }

    this.nedb = new Datastore({ filename: this.state.DatabasePath, autoload: true });
    this.formatBytes = this.formatBytes.bind(this)

    this.getData = this.getData.bind(this)
    this.setData = this.setData.bind(this)
  }


  getData() {
    return new Promise((res, rej) => {
      this.nedb.find({ _id: { $gte: `01/${moment().format("MM/Y")}` } }, function (err, docs) {
        if (err) rej(err)
        if (docs.length) res(docs)
        else rej("no_docs_found")
      });
    })
  }

  setData(sent, recv) {
    return new Promise((res, rej) => {
      var Schema = {
        _id: moment().format("DD/MM/Y"),
        packets: {
          sent: sent,
          recv: recv
        },
        interface: ""
      }

      this.nedb.find({ _id: moment().format("DD/MM/Y") }, function (err, docs) {
        if (err) rej(err)
        if (!docs || !docs.length) {

          nedb.insert(Schema, function (err, newDoc) {
            if (err) return rej(err)
            if (newDoc.length) res()
          });
        } else {
          this.nedb.update({ _id: moment().format("DD/MM/Y") }, Schema, function (err, numRemplaced) {
            if (err) return rej(err)
            res(numRemplaced)
          })
        }
      });
    })
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
    var fetched = await this.getData()

    console.log(fetched)
  }


  render() {
    let getData = this.getData
    let setData = this.setData

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

          <Route path="/" exact component={this.state.visible} setData={setData} getData={getData} state={this.state} />

        </HashRouter>
      </div>
    );
  }
}


export default App