import './Pages.css';
import { React, useContext } from 'react';
import Canvas from "../components/Canvas"
import NavBarContext from "../App.js"

function Visualizer() {
    //const [navigation, setNavBar] = useContext(NavBarContext);
    //setNavBar(false);
    return(
        <div className="Page">
            <Canvas />
        </div>
    )
}

export default Visualizer;