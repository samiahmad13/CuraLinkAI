require('dotenv').config();
const { OpenAI } = require("openai");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  
});

const app = express();
app.use(bodyParser.json());
app.use(cors()); 
const port = 3080;

app.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    const validMessages = messages.filter(
      (message) => message.content && message.content.trim() !== ""
    );

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: validMessages,
      max_tokens: 100,
      temperature: 0.5,
    });

    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
