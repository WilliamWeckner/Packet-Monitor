/* eslint-disable */
import React from 'react';

import { Grid, Segment, Header, Label, Button, Container, List, Input, Divider, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './main.css'

import database from './assets/scripts/databaseHandler.js'
import moment, { localeData } from 'moment';

let { remote } = window.require('electron')
let path = window.require('path')




class BigMonitor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            DatabasePath: '',
            error: false,
            sucess: false
        }

        this.handleError = this.handleError.bind(this)
    }

    loadPath = () => {
        this.setState({
            DatabasePath: localStorage.getItem('DatabasePath')
                ? path.join(localStorage.getItem('DatabasePath'), "packetMonitor.db")
                : `${path.join(remote.app.getPath('userData'), "packetMonitor.db")}`
        })
    }

    handleError = (error) => {
        console.log(error)
        this.setState({ error: error }, () => {
            setTimeout(() => {
                this.setState({ error: false })
            }, 10000)
        })

    }

    handleSucess = (sucessMsg) => {
        this.setState({ sucess: sucessMsg }, () => {
            setTimeout(() => {
                this.setState({ sucess: false })
            }, 10000)
        })

    }

    componentDidMount() {
        this.loadPath()
    }

    render() {

        return (
            <div>

                <Container textAlign='center' >
                    <Container className={'ListBG'} style={{ margin: "10px" }}>

                        <List>
                            <Grid columns={"equal"} divided>
                                <Grid.Row>
                                    <Grid.Column>
                                        <List.Item>
                                            <List.Content style={{ margin: "0px" }}>
                                                <List.Header style={{ margin: "5px" }}>Database Dir</List.Header>
                                                <Label style={{ margin: "0px" }}>{this.state.DatabasePath}</Label>

                                                <Button style={{ margin: "5px" }} onClick={() => {
                                                    let NewDatabasePath = remote.dialog.showOpenDialogSync({ properties: ['openFile', 'openDirectory'] })
                                                    localStorage.setItem("DatabasePath", NewDatabasePath)


                                                    this.loadPath()
                                                }}>Change Database location</Button>
                                            </List.Content>
                                        </List.Item>
                                    </Grid.Column>
                                </Grid.Row>

                            </Grid>
                        </List>
                    </Container>

                    <Container className={'ListBG'} style={{ margin: "10px" }}>

                        <Message negative hidden={this.state.error === false ? true : false}>
                            <Message.Header>{this.state.error.code}</Message.Header>
                            <p>{this.state.error.message}</p>
                        </Message>

                        <Message positive hidden={this.state.sucess === false ? true : false}>
                            <p>{this.state.sucess}</p>
                        </Message>


                        <List>
                            <Grid columns={"equal"} divided>

                                <Grid.Row>
                                    <Grid.Column>
                                        <List.Item>
                                            <List.Content style={{ margin: "0px" }}>
                                                <List.Header style={{ margin: "5px" }}>Import Data from Net Speed Monitor</List.Header>
                                                <Button style={{ margin: "5px" }} onClick={() => {
                                                    let SQLiteItem = remote.dialog.showOpenDialogSync({
                                                        properties: ['openFile'], title: "SQL select", filters: [
                                                            { name: 'SQLite Database', extensions: ['db'] }
                                                        ]
                                                    })

                                                    if (!SQLiteItem) return
                                                    database.importSQLite(SQLiteItem[0])
                                                        .then(() => this.handleSucess("Sucess !"))
                                                        .catch(err => this.handleError(err))
                                                }}>Import</Button>
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