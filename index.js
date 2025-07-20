const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a kind and supportive CBT coach. Help the user reflect on their thoughts using CBT principles.',
        },
        { role: 'user', content: message },
      ],
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
