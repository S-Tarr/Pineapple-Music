import React, { Component, createContext } from 'react';

export const TimeContext = createContext();

class TimeContextProvider extends Component {
    state = {
        timeStamp: new Date(),
        elapsed: 0,
        isPlaying: false,
        beats: []
    }
    setTime = (newTime) => {
        this.setState({timeStamp: newTime.timeStamp,
            elapsed: newTime.elapsed, isPlaying: newTime.isPlaying,
            beats: newTime.beats})
    }
    render() {
        return (
            <TimeContext.Provider value={{...this.state, setTime: this.setTime}}>
                {this.props.children}
            </TimeContext.Provider>
        );
    }
}

export default TimeContextProvider;