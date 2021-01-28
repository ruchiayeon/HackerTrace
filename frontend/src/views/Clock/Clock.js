import React, { Component } from 'react'

export class Clock extends Component {
    constructor(props) {
        super(props)
        this.state = {date: new Date()}
    }

    render() {
        return (
            <>
                <h6>{this.state.date.toDateString()} {this.state.date.toLocaleTimeString()}</h6>
            </>
        )
    }
}

export default Clock
