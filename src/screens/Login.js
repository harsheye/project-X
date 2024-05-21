import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/Login.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// import Otp from './Otp';
// import Redirector from './Redirector';

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
   // const [userId, setUserId] = useState(null);
    const [json, setJson] = useState(null); // Define json state
    const [message, setMessage] = useState({ text: "", type: "" }); // state for message


    // useEffect(() => {
    //    // console.log(userId)
    // }, [userId ]);
   
    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:9015/api/login", {
		    
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const json = await response.json();
            setJson(json); // Set json state

            if (!json.success) {
                console.log("the api worked got the response from the db" + json.message);
                setMessage({ text: "Enter Valid Credentials", type: "error" });
            } else {
                const decodedToken = jwtDecode(json.authToken);
                console.log("the api worked got the response from the db" + json.message )
                // console.log(decodedToken)
                //    setUserId(decodedToken.user.id);
                // console.log(decodedToken.user.id)
                // console.log(json)
                //alert("Login Successful");
                setMessage({ text: "Login Successful", type: "success" });
               
                // Define a global variable
                 window.ID = decodedToken.user.id;
                 
                sessionStorage.setItem("authToken", json.authToken);
                setIsLoggedIn(true);
                if (!json.email_verified ) {
                    console.log("email not verified");
                    
                    navigate('/Otp')
                    console.log("why aren't u redirected to otp")
                } else if( isLoggedIn && json.email_verified) {
                    console.log("email verified")
                    navigate('/Home');
                    
                }
                console.log("why aren't u redirected to Home")
            }
        } catch (error) {
            console.error('Error occurred:', error);
            setMessage({ text: 'Sorry, an error occurred. Please try again.', type: 'error' });
        }
    };
    useEffect(() => {
        if (isLoggedIn) {
            window.location.href='/Home'
        }
    }, [isLoggedIn, navigate]);
    
    const handleSignup = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch("http://localhost:9015/api/create", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
    
            if (!response.ok) {
                const text = await response.text();
                console.error("Error Response:", text);
                // No need to call response.json() here
                setMessage({ text, type: 'error' }); // Display the error message
            } else {
                setMessage({ text: "User Created", type: 'success' });
                setCredentials({ email: "", password: "" });
            }
        } catch (error) {
            console.error('Error occurred:', error);
            setMessage({ text: 'Sorry, an error occurred. Please try again.', type: 'error' });
        }
    };
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
    };  

 

    return (
        <>
            {!isLoggedIn && (
                <div className="body" style={{ position: "relative" }}>
                    <div className="section tai" style={{ backgroundColor:"#1c1c1d",position: "absolute", top: "0%", left: "0%", transform: "translate(-0%, -0%)" }}>
                        <div className="containeroflogin">
                            <div className="row full-height justify-content-center">
                                <div className="col-12 text-center align-self-center py-5">
                                    <div className="section pb-5 pt-5 pt-sm-2 text-center">
                                        <h6 className="mb-0 pb-3"><span>Log In </span><span>Sign Up</span></h6>
                                        <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" />
                                        <label htmlFor="reg-log"></label>
                                        <div className="card-3d-wrap mx-auto">
                                            <div className="card-3d-wrapper">
                                                <div className="card-front">
                                                    <div className="center-wrap">
                                                        <div className="section text-center">
                                                            <h4 className="mb-4 pb-3">Log In</h4>
                                                            <form onSubmit={handleLogin}>
                                                                <div className="form-group">
                                                                    <input type="email" name="email" className="form-style" value={credentials.email} placeholder="Your Email" id="logemail" autoComplete="off" onChange={handleChange} />
                                                                    <i className="input-icon uil uil-at"></i>
                                                                </div>
                                                                <div className="form-group mt-2">
                                                                    <input type="password" name="password" className="form-style" value={credentials.password} placeholder="Your Password" id="logpass" autoComplete="off" onChange={handleChange} />
                                                                    <i className="input-icon uil uil-lock-alt"></i>
                                                                </div>
                                                                {message.text && (
                                                                    <p style={{ color: message.type === 'success' ? 'green' : 'red' }}>
                                                                        {message.text}
                                                                    </p>
                                                                )}
                                                                <button type="submit" className="btn mt-4">Submit</button>
                                                            </form>
                                                            <p className="mb-0 mt-4 text-center"><a href="#0" className="link">Forgot your password?</a></p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-back">
                                                    <div className="center-wrap">
                                                        <div className="section text-center">
                                                            <h4 className="mb-4 pb-3">Sign Up</h4>
                                                            <form onSubmit={handleSignup}>
                                                                <div className="form-group">
                                                                    <input type="text" name="name" className="form-style" value={credentials.name} placeholder="Your Full Name" id="SIGNNAME" autoComplete="off" onChange={handleChange} />
                                                                    <i className="input-icon uil uil-user"></i>
                                                                </div>
                                                                <div className="form-group mt-2">
                                                                    <input type="email" name="email" className="form-style" value={credentials.email} placeholder="Your Email" id="SIGNMAIL" autoComplete="off" onChange={handleChange} />
                                                                    <i className="input-icon uil uil-at"></i>
                                                                </div>
                                                                <div className="form-group mt-2">
                                                                    <input type="password" name="password" className="form-style" value={credentials.password} placeholder="Your Password" id="SIGNPASS" autoComplete="off" onChange={handleChange} />
                                                                    <i className="input-icon uil uil-lock-alt"></i>
                                                                </div>
                                                                {message.text && (
                                                                    <p style={{ color: message.type === 'success' ? 'green' : 'red' }}>
                                                                        {message.text}
                                                                    </p>
                                                                )}
                                                                <button type="submit" className="btn mt-4">Submit</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

{isLoggedIn && (

    window.location.href='/Home'

)}

            
        </>
    );
}
