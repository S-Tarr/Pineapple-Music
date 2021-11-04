import React, { Component, createRef, useRef } from 'react';
import songFile from './rocketMan.wav';
import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';
import { SketchPicker } from 'react-color';
import { TimeContext } from '../contexts/TimeContext';

// Changing Variables
let ctx, x_end, y_end, bar_height;

// constants
const width = window.innerWidth / 1.5;
const height = window.innerHeight / 1.3;
const bars = 360;
const bar_width = 1;
const radius = 0;
const center_x = width / 2;
const center_y = height / 2;

class Canvas extends Component {
    static contextType = TimeContext;
    constructor(props) {
        super(props)
        this.audio = new Audio(songFile);
        this.canvas = createRef();
        this.target = createRef();
        this.elapsedTime = 0;
        this.endTime = new Date();
        this.toStart = true;
        this.i = 0;
        this.y = 0;
        this.barBump = 200;
        this.colors = '#2032CD';
        this.epilepsy = false;

        this.state = {
            visColor: '#2032CD',
            show: false,
            opacity: 1,
            buttonMessage: "Settings",
        }
    }

    animationLooper(canvas) {
        canvas.width = width;
        canvas.height = height;

        ctx = canvas.getContext("2d");

        for (var i = 0; i < bars; i++) {
            //divide a circle into equal part
            const rads = Math.PI * 2 / bars;

            // Math is magical
            bar_height = this.barBump /*this.frequency_array[i]*/;

            const x = center_x + Math.cos(rads * i) * (radius);
            const y = center_y + Math.sin(rads * i) * (radius);
            x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
            y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

            //draw a bar
            this.drawBar(x, y, x_end, y_end, ctx, canvas);
        }
    }

    drawBar(x1=0, y1=0, x2=0, y2=0, ctx, canvas) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
        gradient.addColorStop(1, "rgba(204, 83, 51, 1)");
        ctx.fillStyle = gradient;
        
        var lineColor;
        if (this.epilepsy) {
            lineColor = this.colors;
        }
        else {
            lineColor = this.state.visColor;
        }
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = bar_width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    togglePlay = () => {
        const { audio } = this;
        if(audio.paused) {
            audio.play();
            this.rafId = requestAnimationFrame(this.tick);

         } else {
            audio.pause();
            cancelAnimationFrame(this.rafId);
         }
    }

    tick = () => {
        if (!this.context.isPlaying) {
            cancelAnimationFrame(this.rafId);
        }
        else {
            this.endTime = new Date();
            this.elapsedTime = ((this.endTime - this.context.timeStamp) + this.context.elapsed) / 1000;
            //console.log("TIME: " + this.elapsedTime);
            //console.log("START: " + this.context.beats[this.i].start);
            if (this.elapsedTime >= this.context.beats[this.i].start) {
                if (this.barBump < 260) {
                    this.barBump = this.barBump + 60;
                }
                this.i++;
            }
            else {
                if (this.barBump >= 100) {
                    this.barBump = this.barBump - 3;
                }
            }
            if (this.elapsedTime >= this.context.segments[this.y].start) {
                console.log("PITCHES: " + this.context.segments[this.y].pitches[0]);
                this.colors = this.state.visColor;
                this.colors = this.colors.substring(1);
                var temp = parseInt(this.colors, 16);
                console.log("TEMP: " + temp);
                temp = parseInt(temp * (1 - this.context.segments[this.y].pitches[0]));
                this.colors = "#" + temp.toString(16);
                console.log("HEX: " + this.colors);
                this.y++;
            }
            //console.log("BarBump: " + this.barBump);
            this.animationLooper(this.canvas.current);
            this.rafId = requestAnimationFrame(this.tick);
        }
    }

    handleShow (event) {
        this.setState({
            show :!this.state.show,
        });
        if (this.state.opacity == 1) {
            this.setState({
                opacity :0.5,
                buttonMessage:"Close",
            })
        }
        else {
            this.setState({
                opacity :1,
                buttonMessage: "Settings",
            })
        }
    }

    handleChangeComplete = (color) => {
        this.setState({
            visColor: color.hex
        })
    }
    
    toggleStart = () => {
        if(this.toStart) {
            this.rafId = requestAnimationFrame(this.tick);
            this.toStart = false;
        } else {
            cancelAnimationFrame(this.rafId);
            this.toStart = true;
        }
    }

    toggleColor = () => {
        if (this.epilepsy) {
            this.epilepsy = false;
        }
        else {
            this.epilepsy = true;
        }
    }
    
    render() {
        return <>
            <button onClick={this.toggleStart}>Start/Stop Visualizer</button>
            <Button variant="danger" ref={this.target} onClick={this.handleShow.bind(this)}>
                {this.state.buttonMessage}
            </Button>
            <Overlay target={this.target.current} show={this.state.show} placement="bottom">
                {({ placement, arrowProps, show: _show, popper, ...props }) => (
                <div
                    {...props}
                    style={{
                        display: "flex",
                        flexDirection:"column",
                        margin:"50px",
                        backgroundColor: "#202020",
                        padding: '2px 10px',
                        color: 'white',
                        width:"600px",
                        height:"500px",
                        borderRadius: 50,
                        textAlign:"center",
                        ...props.style,
                    }}
                >
                    <text>Visualizer Settings</text>
                    <div style={{backgroundColor:"#202020"}}>
                        <SketchPicker
                            color={ this.state.visColor }
                            onChangeComplete={ this.handleChangeComplete }
                        />
                        <button onClick={this.toggleColor}>
                            Toggle Colors
                        </button>
                    </div>
                </div>
                )}
            </Overlay>
            <canvas ref={this.canvas}  />
        </>
    }
}

export default Canvas;