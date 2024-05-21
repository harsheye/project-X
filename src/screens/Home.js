import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../components/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/Background.js'; // Import JS Background File
import Background from '../components/Background.js';
import { useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';

export default function Home() {
    const [userData, setUserData] = useState(null); // State to store the fetched user data
    const [totalVaults, setTotalVaults] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [latestTransactions, setLatestTransactions] = useState([]);
    const [isRefresh, setIsRefresh] = useState(false);

    

    const navigate = useNavigate();
    // Check if global ID is undefined and decode the JWT token
    if (window.ID === undefined) {
        const authToken = sessionStorage.getItem('authToken'); // Assuming the token is stored in localStorage
        if (authToken) {
            const decodedToken = jwtDecode(authToken);
            window.ID = decodedToken.user.id;
        }
    }

    //**************************************************
    // If the user reload then logout
    //**************************************************

    // useEffect(() => {
    //     // Check if the page is being loaded for the first time or refreshed
    //     if (sessionStorage.getItem('isRefresh')) {
    //         setIsRefresh(true);
    //         sessionStorage.removeItem('isRefresh'); // Reset for next refresh
    //         sessionStorage.removeItem('authToken'); //Logged out
    //     } else {
    //         sessionStorage.setItem('isRefresh', 'true');
    //     }
    // }, []);

    // Function to calculate total income and expense
    const calculateIncomeAndExpense = () => {
        let income = 0;
        let expense = 0;

        // Iterate over transactions array
        userData.transactions.forEach(transaction => {
            // Check transaction type
            if (transaction.type === "deposit") {
                // If deposit, add amount to totalIncome
                income += transaction.money;
            } else if (transaction.type === "withdraw") {
                // If withdraw, add amount to totalExpense
                expense += transaction.money;
            }
        });

        // Set totalIncome and totalExpense states
        setTotalIncome(income);
        setTotalExpense(expense);
    };

    // Function to get latest 5 transactions
    const getLatestTransactions = () => {
        if (userData) {
            // Sort transactions based on timestamp in descending order
            const sortedTransactions = userData.transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            // Select latest 5 transactions
            const latest5 = sortedTransactions.slice(0, 5);
            // Set latest transactions state
            setLatestTransactions(latest5);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const authToken = sessionStorage.getItem('authToken');
           
        if (!authToken) return; // Check if authToken exists
            let response = await fetch(`http://localhost:9015/api/dataget/${window.ID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': "application/json",
                    'x-auth-token': authToken
                },


            });

            const responseJson = await response.json();

            if (responseJson._id === global.ID) {
                // Parse the JSON response and set the user data state
                setUserData(responseJson);

                // Initialize variables to store total number of vaults and total balance
                // Update totalVaults after fetching data
                const extractedTotalVaults = responseJson.vault.length;
                setTotalVaults(extractedTotalVaults);
                

                // Calculate total balance
                let balanceTotal = 0;
                responseJson.vault.forEach(vault => {
                    balanceTotal += vault.balance;
                });
                setTotalBalance(balanceTotal);

            } else {
                // Handle errors if the response is not successful
                console.error('Failed to fetch user data:', response.statusText);
            }
        };

        // Call the loadData function when the component mounts
        loadData();
    }, []);

    useEffect(() => {
        if (userData) {
            calculateIncomeAndExpense();
            getLatestTransactions();
        }
    }, [userData]);

    return (
        <div>
            <Navbar />
            <Background />
            {userData && (
                <div className="great" style={{ boxSizing: "border-box", position: "relative" }}>
                    <div className="heading" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <h1 style={{ paddingBottom: "25px" }}>Dashboard</h1>
                        <div className="name" style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", marginRight: "5vw" }}>
                            <h1 style={{ paddingRight: "10px" }}>Hi, {userData.name.toUpperCase()}</h1>
                            <img id="pp" src="https://i.kinja-img.com/gawker-media/image/upload/gd8ljenaeahpn0wslmlz.jpg" className="image--cover" />
                        </div>
                    </div>
                    <div className="tau">
                        <div className='wrappermaster' >
                            <div className="master101">
                                <div className="row row1" style={{  minWidth: "500px", paddingBottom: "20px", display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                    <div className="card-min card shadow col-sm-6 mb-3 mb-sm-0" style={{ minWidth: "250px", marginBottom: "50px" }}>
                                        <div className="card-body jaat">
                                            <h6 className="card-title">Total Balance</h6>
                                            <h6 className="card-subtitle mb-2 text-body-secondary">____________________</h6>
                                            <h4 className="card-text">₹ {userData.balance} </h4>
                                            <div className="row">
                                                <div className="col-sm-6 mb-3 mb-sm-0 samba">
                                                    <div className="card" style={{ border: "none" }}>
                                                        <div className="card-body">
                                                            <p className="card-title">Income</p>
                                                            <p>₹ {totalIncome} </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 samba">
                                                    <div className="card" style={{ border: "none" }}>
                                                        <div className="card-body">
                                                            <p className="card-title">Expense</p>
                                                            <p>₹ {totalExpense} </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-min card shadow text-center col-sm-4 mb-3 mb-sm-0" style={{ minWidth: "190px" }}>
                                        <div className="card-body">
                                            <h6 className="card-title">Total Vaults</h6>
                                            <h6 className="card-subtitle mb-2 text-body-secondary">________________</h6>
                                            <h4 className="card-text">{totalVaults ? totalVaults : 0 }</h4>
                                            <p style={{ paddingTop: "15px", marginBottom: "-5px" }}>Vault Balance</p>
                                            <h6 className="card-subtitle mb-2 text-body-secondary">________________</h6>
                                            <h4 className="card-text">₹ {totalBalance ? totalBalance : 0} </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="master101">
                                <div className="card card-trans shadow">
                                    <div className="card-body text-truncate" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <h2 className="card-title">Latest Transactions</h2>
                                        <p>view all</p>
                                    </div>
                                    <div className="card-body">
                                        {latestTransactions.map(transaction => (
                                           <div key={transaction._id} className="transactions" style={{
                                            marginTop: "-15px",
                                            background: "rgba(255, 255, 255, 0.192)",
                                            backdropFilter: "blur(10px)",
                                            borderRadius: "15px",
                                            border: "1px solid rgba(221, 221, 221, 0.568)",
                                            marginBottom: "20px", // Added to add some space between transactions
                                        }}>
                                            <p style={{marginBottom:"-6px", textAlign: "center"}}>  ______________________________________________</p>
                                   <div style={{ marginTop: "4px", paddingLeft: "14px" }}>
                                       <div class="toppermaster" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                           <p style={{ marginBottom: "-2px", fontWeight: "bold" }}>Id: {transaction.transaction_id}</p>
                                           <div class="moneylane" style={{ width: "30%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                               <p style={{ color: transaction.type === 'deposit' ? 'green' : (transaction.type === 'withdraw' ? 'red' : 'inherit'), fontWeight: "bold" }}>
                                                   {transaction.type.toUpperCase()}
                                               </p>
                                               <p style={{ color: transaction.type === 'deposit' ? 'green' : (transaction.type === 'withdraw' ? 'red' : 'inherit'), marginTop: "-20px", fontWeight: "bold" }}>
                                                   {transaction.type === 'withdraw' ? '-' : '+'} ₹ {Math.abs(transaction.money)}
                                               </p>
                                           </div>
                                       </div>
                                       <p style={{ marginTop: "-40px", fontWeight: "bold" }}>{transaction.type === 'deposit' ? 'From' : 'To'}: {transaction.type === 'deposit' ? transaction.from : transaction.to}</p>
                                       <p style={{ textAlign: "right", marginRight: "14px", marginTop:"-18px" }}>{new Date(transaction.timestamp).toLocaleString()}</p>
                                   </div>
                               </div>
                                        
                                        ))}
                                    </div>  
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ paddingTop: "20px" }}>
                            <div className="card card-bor shadow" style={{ width: "55.8%", marginLeft: "1px" }}>
                                <div className="card-header">
                                    Quick Transfer
                                </div>
                                <div className="card-body ">
                                    <blockquote className="blockquote mb-0">
                                        <p>Send Money within a Moment</p>
                                        <div className="chutad-yadav">
                                            <button type="button" className="btn-desi-nigga btn" style={{ height: "95px" }}>Arpita</button>
                                            <button type="button" className="btn-desi-nigga btn" style={{ height: "95px" }}>Manoj</button>
                                            <button type="button" className="btn-desi-nigga btn" style={{ height: "95px" }}>Vanshika</button>
                                            <button type="button" className="btn-desi-nigga btn" style={{ height: "95px" }}>Paras</button>
                                            <button type="button" className="btn-desi-nigga btn" style={{ height: "95px" }}>Chavi</button>
                                            <button type="button" className="btn-desi-nigga btn" style={{ height: "95px" }}>Nikhil</button>
                                        </div>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!userData && (
                <div><h1>Oops! Sorry some error occured at backend</h1></div>
            )}
        </div>
    )
    
}
