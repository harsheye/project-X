const express = require('express');
const router = express.Router();
const Client = require('../Models/clients');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretkey = require('dotenv').config();

// ***********************************
// POST route to create a new client
// ************************************

router.post('/create', async (req, res) => {
    try {
        const { name, email, password, transactionId } = req.body; // Assuming transactionId is passed from the client

        // Validate email format
        if (!email.endsWith('@cuchd.in')) {
            return res.status(400).json({ message: 'Email must end with @cuchd.in' });
        }

        // Check if the email already exists
        const existingEmail = await Client.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new client
        const newClient = new Client({
            name,
            email,
            password: hashedPassword,
            balance: 0,
            email_verified: false,
            transactions: [],
            vault: [{ no: 1, balance: 0, days: 10 }]
        });

        // Save the new client to the database
        const savedClient = await newClient.save();

        // Create a default transaction object using the provided transaction ID
        const transaction = {
            
            type: 'deposit',
            from: 'system', // Indicate it's from the system
            to: savedClient.name, // Set the client's ID as the recipient
            money: 0, // Initial deposit amount if needed
            timestamp: Date.now()
        };

        // Add the default transaction to the new client
        savedClient.transactions.push(transaction);

        // Save the updated client with the default transaction
        await savedClient.save();

        res.json(savedClient);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Error Occurred' });
    }
});



// ***********************************************
// POST route to authenticate and log in a client
// ***********************************************


router.post("/login", async (req, res) => {

    // setting a array to store the user credentials so that they can further again used for the token creation
    const userlogindata = [{email: req.body.email, password: req.body.password}]
    let email = req.body.email;
    
    try {
        let user = await Client.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: "Try logging with correct credentials" });
        }

        // Compare passwords securely using bcrypt or similar library
        // For example:
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ errors: "Try logging with correct password" });
        }

        // // Assuming plain text password comparison for now
        // if (req.body.password !== user.password) {
        //     return res.status(400).json({ errors: "Try logging with correct password" });
        // }
        
        const data={
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data, process.env.jwtsecret,{expiresIn:"30m"})
        return res.json({ success: true,message:"lodu u got in the password is correc", email_verified : user.email_verified, authToken:authToken });
    } catch (error) {
        console.log(error);
        res.json({ success: false , Message:error});
    }
});

module.exports = router ;
