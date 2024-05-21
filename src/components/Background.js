import React from 'react'
import './Navbar1.css'; // Import CSS file

import '@fortawesome/fontawesome-free/css/all.css';
import {
    Link
} from 'react-router-dom'
export default function Background() {
    return (<>
    <div className="container1" style={{backgroundColor:"white"}}>
                    <div className="blob-c">
                        <div className="shape-blob"></div>
                        <div className="shape-blob one"></div>
                        <div className="shape-blob two"></div>
                        <div className="shape-blob three"></div>
                        <div className="shape-blob four"></div>
                        <div className="shape-blob five"></div>
                        <div className="shape-blob six"></div>
                    </div>
                    </div>
    
</>
    );
}