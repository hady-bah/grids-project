import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Twilio configuration
const accountSid = process.env.TWILIO_ACC_ID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = twilio(accountSid, authToken);

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.post('/send-receipt', async (req, res) => {
  const { phoneNumber, messageContent } = req.body;

  try {
    const message = await client.messages.create({
      body: messageContent,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    res.status(200).send({ sid: message.sid });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
