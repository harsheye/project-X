import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Background from '../components/Background';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/transfer.css';
import { jwtDecode } from 'jwt-decode';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


export default function Transfer() {
    if (global.ID === undefined) {
        const authToken = sessionStorage.getItem('authToken');
        if (authToken) {
            const decodedToken = jwtDecode(authToken);
            global.ID = decodedToken.user.id;
        }
    }

    const [formData, setFormData] = useState({
        email: "",
        amount: "",
        password: "",
        from: global.ID
    });
    const [alertMessage, setAlertMessage] = useState("");

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate form fields
        if (!formData.email || !formData.amount || !formData.password) {
            setAlertMessage("Please fill in all fields");
            return;
        }

        // Check if email includes '@' and auto-append '@cuchd.in' if needed
        let email = formData.email;
        if (!email.includes('@')) {
            email += '@cuchd.in';
        }

        // Proceed with the submission
        const confirmed = window.confirm(`Are you sure you want to send ${formData.amount} to ${email}?`);
        if (!confirmed) {
            return; // Exit the function if the user cancels
        }

        try {
            const amount = parseFloat(formData.amount);
            const response = await fetch('http://localhost:9015/api/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem(authToken)
                },
                body: JSON.stringify({
                    from: formData.from,
                    to: email,
                    money: amount,
                    password: formData.password
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                setAlertMessage(errorMessage.message);
            } else {
                setAlertMessage("Transaction successful");
                // Reset form fields
                setFormData({
                    email: "",
                    amount: "",
                    password: "",
                    from: global.ID
                });
                // Clear alert message after 2 seconds
                setTimeout(() => {
                    setAlertMessage("");
                }, 2000);
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage("Failed to process transaction");
        }
    };

    // Function to handle form field changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY'); // Replace with your publishable key

    useEffect(() => {
        const loadScript = () => {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/buy-button.js';
            script.async = false; // Load synchronously
            script.onload = () => {
                // Script loaded successfully
            };
            script.onerror = (error) => {
                console.error('Error loading script:', error);
                // Handle script loading error
            };
            document.body.appendChild(script);
        };
    
        loadScript();
    
        return () => {
            // Cleanup function
            const script = document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]');
            if (script) {
                script.remove();
            }
        };
    }, []);
    
    
    
    return (
        <>
            <Navbar />
            <div style={{marginLeft:"200px"}}>
            <Background />
            <div style={{position:"relative", zIndex:"400"}}>
                <h1 style={{ paddingLeft: "050px", margin: "4vh 0 0 0" }}> Transfer </h1>
                <div className="wrapper101" style={{ margin: "5px 0  0 0", width: "85vw", height: "45vh", border: "3px solid rgba(43, 43, 43, 0.568)", borderRadius: "15px", postion: "relative", zIndex: "400", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>


                    <div style={{ width: "40%", height: "40vh" }}>
                        <form onSubmit={handleSubmit} >
                            <h1> Send Money to ClassMate</h1>
                            <input className="form-control" type="text" placeholder="Enter Receiver's UID" aria-label="Name" name="email" value={formData.email} onChange={handleChange} />
                            <input className="form-control" type="text" placeholder="Enter Amount" aria-label="Email" name="amount" value={formData.amount} onChange={handleChange} />
                            <input type="password" className="form-control" placeholder="Enter Password" aria-label="password" name="password" value={formData.password} onChange={handleChange} />
                            <button type="submit" className="btn btn-primary btn-behan">Continue</button>
                        </form>
                        <div>
                        {alertMessage && (
                            <div className="alert alert-primary mt-3" role="alert" style={{ width: "40%" }}>
                                {alertMessage}
                            </div>
                        )}
                        </div>
                    </div>



                </div>
                <h2 style={{ marginLeft: "50px", marginTop: "1rem" }}>Add Money</h2>
                <div style={{ margin: "0 2vw 0 0px", border: "3px solid rgba(43, 43, 43, 0.568)", borderRadius: "0.5rem", marginTop: "10px", display: "flex", flexDirection: "row", justifyContent: "space-between"  }}>
                    <div style={{ marginRight: "7vw", paddingTop: "1vh", paddingLeft:"1vw", display:"flex", flexDirection:"row", justifyContent:"space-around" }}>
                     <div><div style={{width:"2vw"}}></div>
                        <stripe-buy-button
                            buy-button-id="buy_btn_1P6RlLSDTVhKHFVlSoFWbbAW"
                            publishable-key="pk_test_51OdI5tSDTVhKHFVl855VuRwZwMc4qdlgfXJp21srLwYK2QMPOGS6IBTLYBziuxdCts9nsrgTmm77Ey9kKSErl6hC00XR4cWxnJ"
                        >
                        
                        </stripe-buy-button>
                        </div><div style={{width:"2vw"}}></div>
                        <div>
                        <stripe-buy-button
                            buy-button-id="buy_btn_1P6TuBSDTVhKHFVlp6I9JnH2"
                            publishable-key="pk_test_51OdI5tSDTVhKHFVl855VuRwZwMc4qdlgfXJp21srLwYK2QMPOGS6IBTLYBziuxdCts9nsrgTmm77Ey9kKSErl6hC00XR4cWxnJ"
                        >
                           
                        </stripe-buy-button>
                        </div><div style={{width:"2vw"}}></div>
                        <div>
                        <stripe-buy-button
                            buy-button-id="buy_btn_1P6TsYSDTVhKHFVl2PAG1LzU"
                            publishable-key="pk_test_51OdI5tSDTVhKHFVl855VuRwZwMc4qdlgfXJp21srLwYK2QMPOGS6IBTLYBziuxdCts9nsrgTmm77Ey9kKSErl6hC00XR4cWxnJ"
                        >
                        </stripe-buy-button>
                        </div><dv></dv>
                        </div>


                </div>
            </div>
           </div> 
        </>
    );
}
