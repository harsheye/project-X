import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Redirector(props) {
    const navigate = useNavigate();
    global.ID = props.userId;
    useEffect(() => {
        // Redirect to /Home after the component is mounted
        navigate('/Home');
    }, []); // Empty dependency array ensures this effect runs only once after mounting

    return null; // Return null because this component doesn't render any visible content
}
