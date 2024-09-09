const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Set Content-Type to application/json for all responses
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Replace with your MongoDB connection string
const mongoURI = 'mongodb+srv://rohansharma99anc:pRjwaXQMkzTQn5HM@cluster0.gx90o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema with numeric timestamp and separate fields for current, voltage, and temperature
const DataSchema = new mongoose.Schema({
    current: String,    // You can change the data type as needed
    power: String,    // You can change the data type as needed
    temperature: String, // Corrected the typo from "temprature" to "temperature"
    timestamp: Number   // Store the timestamp as a numeric value (milliseconds since Unix Epoch)
});

const DataModel = mongoose.model('Data', DataSchema);

// Endpoint to save data
app.post('/save-data', async (req, res) => {
    const { current, voltage, temperature } = req.body; // Destructure the data fields from the request body
    const timestamp = Date.now(); // Get the current timestamp in milliseconds

    try {
        // Create a new data entry with the received fields
        const newData = new DataModel({ current, voltage, temperature, timestamp });
        await newData.save();
        res.status(201).json({ message: 'Data saved successfully', data: newData });
    } catch (error) {
        res.status(500).json({ message: 'Error saving data', error });
    }
});

// Endpoint to get all data
app.get('/get-data', async (req, res) => {
    try {
        const allData = await DataModel.find();
        res.status(200).json({ data: allData });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data', error });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//https://current-data-api-compnet.vercel.app/