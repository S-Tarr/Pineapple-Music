import React, { Component, createRef, useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';
import { SketchPicker } from 'react-color';
import { TimeContext } from '../contexts/TimeContext';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#11cb5f',
      },
    },
  });

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
const rCoef1 = (10 * Math.PI) / 360;
const waveLen = 35;
const rCoef2 = (2 * Math.PI) / waveLen;
const dampen = 4 / 360;
const colorSpeed = 80;

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
        this.colors = '#ffffff';
        this.colorsEnd = '#ffffff';
        this.addColor = 0;
        this.addColorR = 0;
        this.addColorG = 0;
        this.addColorB = 0;
        this.colorCounter = 0;
        this.countMode1 = 0;
        this.bumpPos = [-69, -69, -69, -69]; //array of positions for the current beat vis
        this.bumpIndex = 0;

        this.state = {
            visColor: '#2032CD',
            show: false,
            opacity: 1,
            buttonMessage: "Settings",
            mode: 0,
            colorMode: 0,
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
                (((bar_height - 150) / 4) * Math.sin((i + this.countMode1) * radCoef)) + minBar);
            y_end = center_y + Math.sin(rads * i) * (radius +
                ((bar_height - 25) * Math.sin((i + this.countMode1) * radCoef)) + minBar);

            //draw a bar
            this.drawBar(x, y, x_end, y_end, ctx, canvas);
        }
    }

    incrementPos(toAdd) {
        var x = 0;
        for (x = 0; x <= 3; x++) {
            if (this.bumpPos[x] == -69) {
                continue;
            }
            else {
                this.bumpPos[x] += toAdd;
                if (this.bumpPos[x] >= 360) {
                    this.bumpPos[x] = -69;
                }
            }
        }
    }

    animationLooper2(canvas) {
        canvas.width = width;
        canvas.height = height;

        ctx = canvas.getContext("2d");
        var ripple = [0, 0, 0, 0];
        for (var i = 0; i < bars; i++) {
            //divide a circle into equal part
            const rads = Math.PI * 2 / bars;
            // Math is magical

            bar_height = minBar;
            var bibble = 0;
            for (; bibble <= 3; bibble++) {
                if (i >= this.bumpPos[bibble] - waveLen &&
                    i <= this.bumpPos[bibble] &&
                    this.bumpPos[bibble] != -69) {
                    bar_height += (Math.sin(ripple[bibble] * rCoef2) *
                        (40 * Math.sin(this.bumpPos[bibble] * rCoef1))) /
                        (1 + ((1 + this.bumpPos[bibble]) * dampen));
                    ripple[bibble]++;
                }
            }

            const x = center_x + Math.cos(rads * i) * (radius);
            const y = center_y + Math.sin(rads * i) * (radius);
            x_end = center_x + Math.sin(rads * i) * (radius + bar_height);
            y_end = center_y + -Math.cos(rads * i) * (radius + bar_height);
            //draw a bar
            this.drawBar(x, y, x_end, y_end, ctx, canvas);
        }
        this.incrementPos(2);
    }

    drawBar(x1, y1, x2, y2, ctx, canvas) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
        gradient.addColorStop(1, "rgba(204, 83, 51, 1)");
        ctx.fillStyle = gradient;
        
        var lineColor;
        switch (this.state.colorMode) {
            case 0:
                lineColor = this.state.visColor;
                break;
            case 1:
                lineColor = this.colors;
                break;
            case 2:
                lineColor = this.colors;
                break;
            default:
                lineColor = this.state.visColor;
        }
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = bar_width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    changeColor1() {
        if (this.context.segments[this.y + 1] != null &&
            (this.context.elapsed / 1000) >= this.context.segments[this.y].start) {
            this.colorsEnd = '#ffffff';
            this.colorsEnd = this.colorsEnd.substring(1);
            var temp = parseInt(this.colorsEnd, 16);
            temp = parseInt(temp * (this.context.segments[this.y + 1].pitches[0]));
            var tempColor = this.colors.substring(1);
            var temp2 = parseInt(tempColor, 16);
            this.addColor = (temp - temp2) / 10;
            this.colorsEnd = "#" + temp.toString(16);
            this.y++;
        }
        else {
            this.colors = this.colors.substring(1);
            var c1 = parseInt(this.colors, 16);
            c1 = parseInt(c1 + this.addColor);
            this.colors = "#" + c1.toString(16);
            this.colorCounter++;
            if (this.colorCounter >= 10) {
                this.addColor = 0;
                this.colorCounter = 0;
            }
        }
    }

    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
      
    rgbToHex(r, g, b) {
      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    changeColor2() {
        if (this.context.segments[this.y] != null &&
            (this.context.elapsed / 1000) >= this.context.segments[this.y].start) {
            this.colorsEnd = '#ffffff';
            this.colorsEnd = this.colorsEnd.substring(1);
            var temp = parseInt(this.colorsEnd, 16);
            temp = parseInt(temp * (this.context.segments[this.y + 1].pitches[0]));
            if (temp <= 1048575) {
                temp = 1048576;
            }
            this.colorsEnd = "#" + temp.toString(16);
            var endRGB = this.hexToRgb(this.colorsEnd);
            var curRGB = this.hexToRgb(this.colors);
            this.addColorR = (endRGB.r - curRGB.r) / colorSpeed;
            this.addColorG = (endRGB.g - curRGB.g) / colorSpeed;
            this.addColorB = (endRGB.b - curRGB.b) / colorSpeed;
            this.y += 6;
        }
        else {
            var bipRGB = this.hexToRgb(this.colors);
            bipRGB.r += this.addColorR;
            if (bipRGB.r < 0) {
                bipRGB.r = 0;
            }
            if (bipRGB.r > 255) {
                bipRGB.r = 255;
            }
            bipRGB.g += this.addColorG;
            if (bipRGB.g < 0) {
                bipRGB.g = 0;
            }
            if (bipRGB.g > 255) {
                bipRGB.g = 255;
            }
            bipRGB.b += this.addColorB;
            if (bipRGB.b < 0) {
                bipRGB.b = 0;
            }
            if (bipRGB.b > 255) {
                bipRGB.b = 255;
            }
            this.colors = this.rgbToHex(parseInt(bipRGB.r), parseInt(bipRGB.g), parseInt(bipRGB.b))
            this.colorCounter++;
            if (this.colorCounter >= colorSpeed) {
                this.addColor = 0;
                this.colorCounter = 0;
            }
        }
    }

    findBeat() {
        while((this.context.elapsed / 1000) < this.context.segments[this.y].start) {
            this.y--;
        }
        if (this.context.segments[this.y + 1].start != null) {
            while((this.context.elapsed / 1000) > this.context.segments[this.y + 1].start) {
                this.y++;
            }
        }
        else {
            this.y = 0;
        }
    }

    findSegment() {
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
        console.log("Book Time: " + this.context.bookTime);
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
                this.bumpPos[this.bumpIndex] = 0;
                this.bumpIndex++;
                if (this.bumpIndex > 3) {
                    this.bumpIndex = 0;
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
            switch (this.state.colorMode) {
                case 0:
                    break;
                case 1:
                    this.changeColor1();
                    break;
                case 2:
                    this.changeColor2();
                    break;
                default:
            }
            switch (this.state.mode) {
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
            visColor: color.hex,
            colorMode: 0,
        })
    }
    
    toggleStart = () => {
        if(this.toStart) {
            this.toStart = false;
            //this.getTime();
            this.findBeat();
            this.findSegment();
            this.rafId = requestAnimationFrame(this.tick);
        } else {
            cancelAnimationFrame(this.rafId);
            this.toStart = true;
        }
    }

    handleChangeColor = (event) => {
        this.setState({colorMode: event.target.value})
    }

    handleChange = (event) => {
        this.setState({mode: event.target.value})
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
                        <ThemeProvider theme={theme}>
                            <InputLabel id="demo-simple-select-label" color="primary">Mode</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.mode}
                                label="Mode"
                                onChange={this.handleChange}
                            >
                                <MenuItem value={0}>Basic</MenuItem>
                                <MenuItem value={1}>3D</MenuItem>
                                <MenuItem value={2}>Ripples</MenuItem>
                            </Select>
                            <InputLabel id="color" color="primary">Color Mode</InputLabel>
                            <Select
                                labelId="color"
                                id="colorSelect"
                                value={this.state.colorMode}
                                label="Color Mode"
                                onChange={this.handleChangeColor}
                            >
                                <MenuItem value={0}>Basic</MenuItem>
                                <MenuItem value={1}>Pitch</MenuItem>
                                <MenuItem value={2}>Mood</MenuItem>
                            </Select>
                        </ThemeProvider>
                    </div>
                </div>
                )}
            </Overlay>
            <canvas ref={this.canvas}  />
        </>
    }
}

export default Canvas;