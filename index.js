const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const messages = [
      {
        role: "system",
        content:
          "You are a warm and supportive CBT coach. Help the user reflect on their thoughts. Use Socratic questioning. Prompt them to explore cognitive distortions and reframe unhelpful beliefs."
      },
      { role: "user", content: message }
    ];

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: messages,
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error('GPT Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Something went wrong with GPT' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
