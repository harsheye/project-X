const express = require('express');
const router = express.Router();
const Client = require('../Models/clients');

const auth = require("../Middleware/auth");
const secretkey = require('dotenv').config();
const originhost = require("../Middleware/approved_origin");

// Utility function to check if a password meets certain criteria
// function isValidPassword(password) {
//     // Adjust the regex pattern as needed
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     return passwordRegex.test(password);
// }

// GET route to fetch all clients
// router.get('/check', async (req, res) => {
//     try {
//         const clients = await Client.find();
//         res.json(clients);
//     } catch (err) {
//         console.error('Error Found:', err);
//         res.status(500).send('Error ' + err);
//     }
// });

// GET route to fetch a specific client by ID
router.get('/dataget/:id',auth, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        res.json(client);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error ' + err);
    }
});



// PATCH route to update email verification status
router.patch('/otppatch/:id',auth, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        client.email_verified = true;
        const updatedClient = await client.save();
        res.json(updatedClient);
    } catch (err) {
        console.error('Error:', err);
        res.send('Error');
    }
});

// POST route to update email verification status
router.post('/updateEmailVerified/:userId',auth,  async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedClient = await Client.findByIdAndUpdate(userId, { email_verified: true }, { new: true });
        res.json(updatedClient);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to update email verification status' });
    }
});



// post request for the transaction
router.post('/transaction',originhost, auth, async (req, res) => {
    try {
        const { from, to, money, password } = req.body;

        // Find the sender by ID
        const sender = await Client.findById(from);
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }
        
        // Compare hashed password
        const passwordMatch = await bcrypt.compare(password, sender.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        //Checking if the user have already did his 20 transactions
        const limit = sender.transaction_limit;
        if(limit <= 0){
            return res.status(403).json({ok: false,
                message: "oops daily limit reached"
            })
        }

        // Check if sender has enough balance
        if (sender.balance < money) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Find the receiver by email
        const receiver = await Client.findOne({ email: to });
        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Update sender's balance (withdraw)
        sender.balance -= money;

        // Update receiver's balance (deposit)
        receiver.balance += money;

        // Generate transaction ID
        const transaction_id = `${sender.email.split('@')[0]}${Math.floor(100000 + Math.random() * 900000)}${to.split('@')[0]}`;

        // Create transaction objects with 'from' and 'to' fields
        const senderTransaction = { 
            transaction_id: transaction_id, 
            type: 'withdraw', 
            money: money, 
            from: sender.email, // Include sender's email
            to: receiver.email, // Include receiver's email
            timestamp: new Date() 
        };
        const receiverTransaction = { 
            transaction_id: transaction_id, 
            type: 'deposit', 
            money: money, 
            from: sender.email, // Include sender's email
            to: receiver.email, // Include receiver's email
            timestamp: new Date() 
        };

        // Add transactions to sender and receiver
        sender.transactions.push(senderTransaction);
        receiver.transactions.push(receiverTransaction);

        // Save updated sender and receiver
        await sender.save();
        await receiver.save();

        res.json({ message: 'Transaction successful' });
    } catch (error) {
        console.error('Error:', error);
        res.json({ message: 'Failed to process transaction', error:error });
    }
});

router.post('/send-verification-email',auth, (req, res) => {
    const { userId, email } = req.body;
  
    const transporter = nodemailer.createTransport({
      service: 'smtp.elasticemail.com', // Or your email provider
      auth: {
        user: 'harshbelarkha@proton.me',
        pass: '408CA25D72188F712BC0FA6F58192AA704BE'
      }
    });
  
    const mailOptions = {
      from: 'harshbelarkha@proton.me',
      to: email, 
      subject: 'Your Email Verification',
      text: `Your OTP: ${generateOTP()}` // Generate OTP here
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ error: 'Email sending failed' });
      } else {
        res.json({ message: 'Verification email sent' });
      }
    });
  });


module.exports = router;
