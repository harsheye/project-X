import React, { useState } from 'react';
import './Navbar1.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Example state for authentication

    const handleLogout = () => {
        // Perform logout actions (e.g., clear local storage, reset state)
        sessionStorage.removeItem('authToken');
        setIsLoggedIn(false); // Update authentication state
        // Navigate to the login page after logout
        navigate('/login');
    };

    return (
        <nav className="main-menu">
            <ul>
                <li>
                    <Link to="/home">
                        <i className="fa fa-home nav-icon"></i>
                        <span className="nav-text">Home</span>
                    </Link>
                </li>

                <li>
                    <Link to="/Transactions">
                        <i className="fa fa-clock-rotate-left nav-icon"></i>
                        <span className="nav-text">Transactions</span>
                    </Link>
                </li>

                <li>
                    <Link to="/Transfer">
                        <i className="fa fa-money-bill-transfer nav-icon"></i>
                        <span className="nav-text">Transfer</span>
                    </Link>
                </li>

                <li>
                    <Link to="/vault">
                        <i className="fa fa-vault nav-icon"></i>
                        <span className="nav-text">Vault</span>
                    </Link>
                </li>

                <li>
                    <Link to="/Notifications">
                        <i className="fa fa-bell nav-icon"></i>
                        <span className="nav-text">Notification</span>
                    </Link>
                </li>
            </ul>

            <ul className="logout">
                <li>
                    <Link to="/profile">
                        <i className="fa fa-user nav-icon"></i>
                        <span className="nav-text">Profile</span>
                    </Link>
                </li>

                <li onClick={handleLogout}>
                    <Link to="#">
                        <i className="fa fa-sign-out-alt nav-icon"></i> {/* Changed from fa-right-from-bracket */}
                        <span className="nav-text">Logout</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
