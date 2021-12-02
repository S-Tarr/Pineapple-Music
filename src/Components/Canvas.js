import React, { Component, createRef, useRef } from 'react';
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
const minBar = 120;
const maxBar = 260;
const increment = 60;

class Canvas extends Component {
    static contextType = TimeContext;
    constructor(props) {
        super(props)
        this.canvas = createRef();
        this.target = createRef();
        this.toStart = true;
        this.i = 0;
        this.y = 0;
        this.barBump = minBar;
        this.colors = '#2032CD';
        this.epilepsy = false;
        this.mode = 1;
        this.countMode1 = 0;
        this.bumpPos = -1;

        this.state = {
            visColor: '#2032CD',
            show: false,
            opacity: 1,
            buttonMessage: "Settings",
        }
    }

    animationLooper0(canvas) {
        canvas.width = width;
        canvas.height = height;

        ctx = canvas.getContext("2d");

        for (var i = 0; i < bars; i++) {
            //divide a circle into equal part
            const rads = Math.PI * 2 / bars;

            // Math is magical
            bar_height = this.barBump;

            const x = center_x + Math.cos(rads * i) * (radius);
            const y = center_y + Math.sin(rads * i) * (radius);
            x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
            y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

            //draw a bar
            this.drawBar(x, y, x_end, y_end, ctx, canvas);
        }
    }

    animationLooper1(canvas) {
        canvas.width = width;
        canvas.height = height;

        ctx = canvas.getContext("2d");

        for (var i = 0; i < bars; i++) {
            //divide a circle into equal part
            const rads = Math.PI * 2 / bars;
            const radCoef = .1047;
            // Math is magical
            bar_height = this.barBump;

            const x = center_x + Math.cos(rads * i) * (radius);
            const y = center_y + Math.sin(rads * i) * (radius);
            x_end = center_x + Math.cos(rads * i) * (radius +
                (((bar_height - 150) / 6) * Math.sin((i + this.countMode1) * radCoef)) + minBar);
            y_end = center_y + Math.sin(rads * i) * (radius +
                ((bar_height - 25) * Math.sin((i + this.countMode1) * radCoef)) + minBar);

            //draw a bar
            this.drawBar(x, y, x_end, y_end, ctx, canvas);
        }
    }

    animationLooper2(canvas) {
        canvas.width = width;
        canvas.height = height;

        ctx = canvas.getContext("2d");
        var ripple = this.barBump - minBar;
        for (var i = 0; i < bars; i++) {
            //divide a circle into equal part
            const rads = Math.PI * 2 / bars;
            // Math is magical
            bar_height = this.barBump;

            const x = center_x + Math.cos(rads * i) * (radius);
            const y = center_y + Math.sin(rads * i) * (radius);
            x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
            y_end = center_y + Math.sin(rads * i) * (radius + bar_height);
            ripple -= 2;
            //draw a bar
            this.drawBar(x, y, x_end, y_end, ctx, canvas);
        }
    }

    drawBar(x1, y1, x2, y2, ctx, canvas) {
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

    findBeat() {
        while((this.context.elapsed / 1000) < this.context.beats[this.i].start) {
            this.i--;
        }
        if (this.context.beats[this.i + 1].start != null) {
            while((this.context.elapsed / 1000) > this.context.beats[this.i + 1].start) {
                this.i++;
            }
        }
        else {
            this.i = 0;
        }
    }

    tick = () => {
        if (!this.context.isPlaying) {
            cancelAnimationFrame(this.rafId);
            this.toStart = true;
        }
        else {
            //bump start
            if ((this.context.elapsed / 1000) >= this.context.beats[this.i].start) {
                if (this.barBump < maxBar) {
                    this.barBump = this.barBump + increment;
                }
                this.i++;
            }
            else {
                if (this.barBump >= minBar) {
                    this.barBump = this.barBump - 3;
                }
            }
            if (this.countMode1 > 60) {
                this.countMode1 = 0;
            }
            else {
                this.countMode1+= 2;
            }
            //color start
            if ((this.context.elapsed / 1000) >= this.context.segments[this.y].start) {
                this.colors = this.state.visColor;
                this.colors = this.colors.substring(1);
                var temp = parseInt(this.colors, 16);
                temp = parseInt(temp * (1 - this.context.segments[this.y].pitches[0]));
                this.colors = "#" + temp.toString(16);
                this.y++;
            }
            switch (this.mode) {
                case 0:
                    this.animationLooper0(this.canvas.current);
                    break;
                case 1:
                    this.animationLooper1(this.canvas.current);
                    break;
                case 2:
                    this.animationLooper2(this.canvas.current);
                    break;
                default:
                    this.animationLooper0(this.canvas.current);
            }
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
            this.toStart = false;
            //this.getTime();
            this.findBeat();
            this.rafId = requestAnimationFrame(this.tick);
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