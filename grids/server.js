import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const accountSid = process.env.TWILIO_ACC_ID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = twilio(accountSid, authToken);

app.use(cors()); // Enable CORS

// Welcome Page for the Server
app.get('/', (req, res) => {
  res.send('Welcome to the Express Server');
});

// Twilio SMS endpoint
app.get('/send-receipt', async (req, res) => {
  // Get recipient and text message from query parameters
  const { phoneNumber, messageContent } = req.query;

  try {
    // Send Text
    const message = await client.messages.create({
      body: messageContent,
      to: phoneNumber,  // Text this number
      from:  process.env.TWILIO_NUMBER // From a valid Twilio number
    });
    res.status(200).send({ sid: message.sid });
  } catch (error) {
    console.error('Error sending message:', error); // Log the error
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => console.log(`Running on Port ${port}`));
