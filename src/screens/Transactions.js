import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Background from '../components/Background.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/search.css';
import { jwtDecode } from 'jwt-decode';


// Move the filter functions outside the component function
const filterDeposits = (transactionsData) => {
    return transactionsData.filter(transaction => transaction.type === 'deposit');
};

const filterWithdrawals = (transactionsData) => {
    return transactionsData.filter(transaction => transaction.type === 'withdraw');
};

export default function Transactions() {
    const [transactionsData, setTransactionsData] = useState([]);
    const [userData, setUserData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All'); // Add state for selected category

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authToken = sessionStorage.getItem('authToken');
                if (!authToken) {
                    throw new Error('No authentication token found');
                }

                const decodedToken = jwtDecode(authToken);
                const userID = decodedToken.user.id;

                const response = await fetch(`http://localhost:9015/api/dataget/${userID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': authToken
                    },
                });

                const responseJson = await response.json();

                if (responseJson._id === userID) {
                    // Parse the JSON response and set the user data state
                    setUserData(responseJson);
                    // Extract transactions data and set state
                    setTransactionsData(responseJson.transactions);
                } else {
                    // Handle errors if the response is not successful
                    console.error('Failed to fetch user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        fetchData();
    }, []);

    // Function to handle category selection
    const handleCategorySelect = (category) => {
        console.log(category)
        setSelectedCategory(category);
    };

    useEffect(() => {
        // Function to hide/show transactions based on category selection
        const handleHideTransactions = () => {
            const allTransactions = document.querySelectorAll('.transaction-conatiner');
            const depositTransactions = document.querySelectorAll('.deposit-transaction');
            const withdrawTransactions = document.querySelectorAll('.withdraw-transaction');

            if (selectedCategory === 'All') {
                allTransactions.forEach(transaction => (transaction.style.display = ''));
                depositTransactions.forEach(transaction => (transaction.style.display = ''));
                withdrawTransactions.forEach(transaction => (transaction.style.display = ''));
            } else if (selectedCategory === 'Income') {
                allTransactions.forEach(transaction => (transaction.style.display = 'none'));
                depositTransactions.forEach(transaction => (transaction.style.display = ''));
                withdrawTransactions.forEach(transaction => (transaction.style.display = 'none'));
            } else if (selectedCategory === 'Expense') {
                allTransactions.forEach(transaction => (transaction.style.display = 'none'));
                depositTransactions.forEach(transaction => (transaction.style.display = 'none'));
                withdrawTransactions.forEach(transaction => (transaction.style.display = ''));
            }
        };

        handleHideTransactions();
    }, [selectedCategory]);
 const paper = {
    marginLeft:"20px",
    transition: "background-color 0.3s", // Smooth transition for hover effect
    // Define default background color
    backgroundColor: "#fff", 
 }
 const hoverStyles = {
    backgroundColor: "lightblue", // Background color on hover
};

 
    return (
        <>
            <Navbar />
            <Background />
            <div className="tau" style={{ width: "80vw", height: "100vh", marginLeft: "200px", paddingTop: "50px" , position:"relative"}}>
                <div className="card shadow ">
                    <div className="card-body text-truncate" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <h2 className="card-title">Transactions</h2>
                        <div className="row height d-flex justify-content-center align-items-center">
                            <div className="col-md-8">
                                <div className="search">
                                    <input type="text" className="form-control" placeholder="Search Transactions here...." />
                                    <button className="btn btn-primary">Search</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-body" style={{ marginTop: "-25px", width: "40%", display:"flex", flexDirection:"row", justifyContent:"space-evenly" }}>
                        {/* Category links */}
                        <button id="button-53"   onClick={() => handleCategorySelect('All')} className={selectedCategory === 'All' ? 'selected-category' : ''}>All</button>
                        <button id="button-54"  onClick={() => handleCategorySelect('Income')} className={selectedCategory === 'Income' ? 'selected-category' : ''} >Income</button>
                        <button id="button-55"  onClick={() => handleCategorySelect('Expense')} className={selectedCategory === 'Expense' ? 'selected-category' : ''}>Expense</button>
                    </div>

                    {/* Render transactions based on selected category */}
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div className="transactions-container" style={{ width: "40vw", height: "80vh", marginLeft:"20vw"}}>
                            {transactionsData.map(transaction => (
                                <div key={transaction._id} className={`transaction ${transaction.type === 'deposit' ? 'deposit-transaction' : 'withdraw-transaction'}`} style={{ display: '' }}>
                                    {/* Render transaction details */}
                                    <p style={{ marginBottom: "-6px", textAlign: "center" }}> ________________________________________________________________________________ </p>
                                    <div style={{ marginTop: "4px", paddingLeft: "14px" }}>
                                        <div className="toppermaster" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                            <p style={{ marginBottom: "-2px", fontWeight: "bold" }}>Id: {transaction.transaction_id}</p>
                                            <div className="moneylane" style={{ width: "30%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                <p style={{ color: transaction.type === 'deposit' ? 'green' : (transaction.type === 'withdraw' ? 'red' : 'inherit'), fontWeight: "bold" }}>
                                                    {transaction.type.toUpperCase()}
                                                </p>
                                                <p style={{ color: transaction.type === 'deposit' ? 'green' : (transaction.type === 'withdraw' ? 'red' : 'inherit'), marginTop: "-20px", fontWeight: "bold" }}>
                                                    {transaction.type === 'withdraw' ? '-' : '+'} ₹ {Math.abs(transaction.money)}
                                                </p>
                                            </div>
                                        </div>
                                        <p style={{ marginTop: "-40px", fontWeight: "bold" }}>{transaction.type === 'deposit' ? 'From' : 'To'}: {transaction.type === 'deposit' ? transaction.from : transaction.to}</p>
                                        <p style={{ textAlign: "right", marginRight: "14px", marginTop: "-18px" }}>{new Date(transaction.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                      
                    </div>
                </div>
            </div>
        </>
    );
}
