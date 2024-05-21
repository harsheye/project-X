import './App.css';
import Home from './screens/Home';
import Login from './screens/Login';
import Profile from './screens/Profile';
import Transactions from './screens/Transactions';
import Transfer from './screens/Transfer';
import Vault from './screens/Vault';
import Notifications from "./screens/Notifications";
import Otp from './screens/Otp';
//import signup from './screens/signup'; // Make sure this import is correct
import withAuth from './withAuth';
import isLoggedIn from './authUtils'; 

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Login/>}/>
          <Route 
            path="/home"
            element={isLoggedIn() ? <Home /> : <Navigate to="/" replace />} 
          />
          <Route exact path="/login" element={<Login/>}/>
          {/* Add your other routes here */}
          <Route exact path="/Notifications" element={<Notifications/>}/>
          <Route exact path="/signup" element={<signup/>}/>

          <Route 
            path="/Profile"
            element={isLoggedIn() ? <Profile /> : <Navigate to="/" replace />} 
          />

          <Route 
            path="/Transactions"
            element={isLoggedIn() ? <Transactions /> : <Navigate to="/" replace />} 
          />

          <Route 
            path="/Transfer"
            element={isLoggedIn() ? <Transfer /> : <Navigate to="/" replace />} 
          />

          <Route 
            path="/Vault"
            element={isLoggedIn() ? <Vault /> : <Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
