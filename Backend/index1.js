const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//const mongoDB = require('./db.js');
const clientRouter = require('./Routes/clients');
const clientAuthRouter = require('./Routes/clients_authentication');

const url = 'mongodb://localhost:27017';
const port = 9015;
const app = express();
console.log(process.env.jwtsecret);
const corsOptions = {
    origin: [
        'http://onelinesbi.live',
        'http://onlinesbii.live:80',
        'http://localhost:3000',
        'http://onlinesbii.live:3000',
        'http://20.197.0.23:80',
        'http://20.197.0.23:3000',
        'http://100.127.101.111:80',
        'http://js.stripe.com',
        'https://js.stripe.com',
        'https://js.stripe.com'
    ],
    credentials: true, // Enable credentials if true
    insecureContext: true
};

app.use(cors(corsOptions)); // Use cors middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB...');
    app.listen(port, () => {
        console.log('Server listening on port ' + port);
    });
    // // Call function to fetch clients data
    // mongoDB().then((clients) => {
    //     global.clients = clients;
    //     console.log(global.clients);
    // }).catch(err => {
    //     console.error("Error fetching clients data:", err);
    // });
})
.catch(err => console.error('Could not connect to MongoDB:', err));

app.use('/api', clientRouter);
app.use('/api', clientAuthRouter);
app.use('/api', require("./Routes/display"));

