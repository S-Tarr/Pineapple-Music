import React, { Component, createContext } from 'react';

export const TimeContext = createContext();

class TimeContextProvider extends Component {
    state = {
        timeStamp: new Date(), // time at which the time was last updated
        elapsed: 0, // time elapsed in miliseconds.
        isPlaying: false, //whether or not song is currently playing
        song: "", // song id
        beats: [],
        segments: [],
        bookTime: 0
    }
    setIsPlaying = (newIsPlaying) => {
        this.setState({isPlaying: newIsPlaying});
    }
    updateTime = () => {
        if (this.state.isPlaying) {
            var time = new Date();
            this.setState({elapsed: ((time - this.state.timeStamp) + this.state.elapsed),
                timeStamp: time});
        }
    }
    updateBook = () => {
        if (this.state.isPlaying) {
            var time = new Date();
            this.setState({bookTime: ((time - this.state.timeStamp) + this.state.elapsed)});
        }
    }
    setTime = (newTime) => {
        this.setState({timeStamp: newTime.timeStamp,
            elapsed: newTime.elapsed, isPlaying: newTime.isPlaying,
            beats: newTime.beats, segments: newTime.segments, song: newTime.song});
    }
    render() {
        return (
            <TimeContext.Provider value={{...this.state,
                setTime: this.setTime, setIsPlaying: this.setIsPlaying,
                updateTime: this.updateTime, updateBook: this.updateBook}}>
                {this.props.children}
            </TimeContext.Provider>
        );
    }
}

export default TimeContextProvider;