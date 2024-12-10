// if need to terminate old session -> netstat -ano | findstr :3000 , taskkill /PID ---- /F, use node app.js to start

// const port = process.env.PORT ||4000;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
// const User = require('./models/usermodel.js'); // Import the User model
// const Enquiries = require('./models/usermodel.js'); // Import the Enquiries
const { User, Enquiries } = require('./models/usermodel.js');

const app = express();
const http = require('http').Server(app);

// MongoDB connection
mongoose.connect("mongodb+srv://aryanbangwal4:aryanmaster12@cluster0.lf5lx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Enable CORS for specific origins
app.use(cors({
  origin: 'http://127.0.0.1:5500' // Replace with the origin of your frontend app
}));

// Middleware to parse JSON
app.use(express.json()); 
app.use(bodyParser.json()); // Ensuring the server parses incoming JSON payloads

// Route to handle user signup
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Create and save the new user to database
        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to authenticate' });
    }
});

//Enquiries
app.post('/contact', async (req, res) => {
    const { name, email,contact, message } = req.body;

    try {
        // Create and save the new user to database
        const enquiry = new Enquiries({ name, email,contact, message });
        await enquiry.save();

        res.status(201).json({ message: 'Enquiry created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create Enquiry' });
    }
});

// Start the server
http.listen(3000, function() {
    console.log('Server is running on http://localhost:3000');
});
