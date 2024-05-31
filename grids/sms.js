import twilio from 'twilio';

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const accountSid = process.env.TWILIO_ACC_ID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = twilio(accountSid, authToken);

const sendSMS = (to, from, message) => {
  client.messages
    .create({
      body: message,
      from: from,
      to: to
    })
    .then(message => console.log('Message sent successfully, SID:', message.sid))
    .catch(error => console.error('Error sending message:', error));
};

const to = '+13476909573'; // Replace with the recipient's phone number
const from = process.env.TWILIO_NUMBER; 
const message = 'Hello, this is a test message from Hady with the APP!';

sendSMS(to, from, message);

