/* eslint-disable */
import React from 'react';

import { Grid, Segment, Header, Image, Icon, Container, List, Divider } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './main.css'

import database from './assets/scripts/databaseHandler.js'

import moment from 'moment';

const { ipcRenderer } = window.require('electron')

class BigMonitor extends React.Component {
    constructor(props) {
        super(props);


        this.props = props

        this.getData = database.getData.bind(this)
        this.setData = database.setData.bind(this)

        this.formatBytes = this.formatBytes.bind(this)
        this.getTodayStats = this.getTodayStats.bind(this)
        this.getCurrentMonthStats = this.getCurrentMonthStats.bind(this)

        this.state = {
            thisSession: {
                up: 0,
                down: 0
            },
            thisDay: {
                up: 0,
                down: 0
            },
            thisMonth: {
                up: 0,
                down: 0
            },

            packetSpeed: {
                up: 0,
                down: 0
            },
        }
    }

    async getTodayStats() {
        let reducer = (value, increment) => value + increment
        let sent = [0]
        let recv = [0]

        let fetched = await this.getData()
            .catch(err => console.log(err))
        if (!fetched) return

        fetched.map(data => {
            if (data._id !== moment().format("DD/MM/Y")) return
            sent.push(data.packets.sent)
            recv.push(data.packets.recv)
        })

        this.setState({
            thisDay: {
                up: sent.reduce(reducer),
                down: recv.reduce(reducer)
            }
        })
    }


    async getCurrentMonthStats() {
        let reducer = (value, increment) => value + increment
        let sent = [0]
        let recv = [0]

        var fetched = await this.getData()
            .catch(err => console.log(err))
        if (!fetched) return



        fetched.map(data => {
            sent.push(data.packets.sent)
            recv.push(data.packets.recv)
        })

        this.setState({
            thisMonth: {
                up: sent.reduce(reducer),
                down: recv.reduce(reducer)
            }
        })
    }

    async setTodayStats(sent, recv) {

        let fetched = await this.getData()
            .catch(err => console.log(err))

        let GetSent = 0
        let GetRecv = 0

        if (fetched) {
            fetched.map(data => {
                if (data._id !== moment().format("DD/MM/Y")) return
                GetSent = data.packets.sent + sent
                GetRecv = data.packets.recv + recv
            })
        }
        await this.setData(GetSent, GetRecv)
    }

    async componentDidMount() {
        //Start the monitoring
        ipcRenderer.on("update_data", async (event, arg) => {
            this.getCurrentMonthStats()
            this.getTodayStats()

            arg.forEach(async network => {
                if (network.tx_sec < 0 && network.rx_sec < 0) return
                this.setTodayStats(network.tx_sec, network.rx_sec)
                this.setState({
                    packetSpeed: {
                        up: network.tx_sec,
                        down: network.rx_sec
                    },
                    thisSession: {
                        up: this.state.thisSession.up += network.tx_sec,
                        down: this.state.thisSession.down += network.rx_sec
                    },
                })
            });
        })
    }

    formatBytes(bytes, decimals = 3, size = "MB") {
        var k = 1024
        var dm = decimals > 3 ? 3 : decimals
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        var i = Math.floor(Math.log(bytes) / Math.log(k)) // Auto

        let sizeNumber = (size === "Auto") ? (i) : (sizes.indexOf(size))
        if (bytes === 0) return parseInt(0).toFixed(dm) + `${sizes[0]}`
        return (bytes / Math.pow(k, sizeNumber)).toFixed(dm) + `${sizes[sizeNumber]}`;
    }

    render() {
        let packet = {
            up: this.formatBytes(this.state.packetSpeed.up),
            down: this.formatBytes(this.state.packetSpeed.down),
        }
        let month = {
            up: this.formatBytes(this.state.thisMonth.up),
            down: this.formatBytes(this.state.thisMonth.up),
            mix: this.formatBytes(this.state.thisMonth.up + this.state.thisMonth.down, 2, "Auto")
        }
        let today = {
            up: this.formatBytes(this.state.thisDay.up),
            down: this.formatBytes(this.state.thisDay.down),
            mix: this.formatBytes(this.state.thisDay.up + this.state.thisDay.down, 2, "Auto")
        }
        let session = {
            up: this.formatBytes(this.state.thisSession.up),
            down: this.formatBytes(this.state.thisSession.down),
            mix: this.formatBytes(this.state.thisSession.up + this.state.thisSession.down, 2, "Auto")

        }

        return (
            <div>
                <Container textAlign='center' >
                    <Container className={'ListBG'} style={{ margin: "10px" }}>
                        <List>
                            <Grid columns={2} divided>

                                <Grid.Row>

                                    <Grid.Column>
                                        <List.Item>
                                            <List.Content>
                                                <List.Header style={{ margin: "5px" }}>Upload</List.Header>
                                                <List.Description style={{ margin: "10px" }}>{packet.up}/s</List.Description>
                                            </List.Content>
                                        </List.Item>
                                    </Grid.Column>

                                    <Grid.Column>
                                        <List.Item>
                                            <List.Content>
                                                <List.Header style={{ margin: "5px" }}>Download</List.Header>
                                                <List.Description style={{ margin: "10px" }}>{packet.down}/s</List.Description>
                                            </List.Content>
                                        </List.Item>
                                    </Grid.Column>


                                </Grid.Row>

                            </Grid>
                        </List>
                    </Container>

                    <Container className={'ListBG'} style={{ margin: "10px" }}>
                        <List>
                            <Grid columns={1} divided>

                                <Grid.Column>
                                    <List.Item>
                                        <List.Content>
                                            <List.Header style={{ margin: "5px" }}>Session</List.Header>
                                            <List.Description style={{ margin: "10px" }}>{session.mix}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                </Grid.Column>

                            </Grid>
                        </List>
                    </Container>


                    <Container className={'ListBG'} style={{ margin: "10px" }}>
                        <List>
                            <Grid columns={1} divided>

                                <Grid.Column>
                                    <List.Item>
                                        <List.Content>
                                            <List.Header style={{ margin: "5px" }}>Day</List.Header>
                                            <List.Description style={{ margin: "10px" }}>{today.mix}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                </Grid.Column>

                            </Grid>
                        </List>
                    </Container>

                    <Container className={'ListBG'} style={{ margin: "10px" }}>
                        <List >
                            <Grid columns={1} divided>

                                <Grid.Row>
                                    <Grid.Column>
                                        <List.Item>
                                            <List.Content>
                                                <List.Header style={{ margin: "5px" }}>Month</List.Header>
                                                <List.Description style={{ margin: "10px" }}>{month.mix}</List.Description>
                                            </List.Content>
                                        </List.Item>
                                    </Grid.Column>
                                </Grid.Row>

                            </Grid>
                        </List>
                    </Container>

                </Container>
            </div>
        );
    }
}


export default BigMonitor