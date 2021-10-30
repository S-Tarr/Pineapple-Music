import './Pages.css';
import { React, useContext } from 'react';
import Canvas from "../components/Canvas"

function Visualizer() {
    const [navBar, setNavBar] = useContext(NavBarContext);
    return(
        <div className="Page">
            <Canvas />
        </div>
    )
}

export default Visualizer;