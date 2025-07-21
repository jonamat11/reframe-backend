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

  console.log("📥 Incoming message:", message);

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is empty' });
  }

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a warm, emotionally attuned CBT coach.
Use Socratic questioning and reflect the user's emotions.
If the conversation drifts, bring it back to how the user is feeling.
Challenge cognitive distortions gently. Never ignore emotional cues.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const reply = response.data?.choices?.[0]?.message?.content || 'Sorry, I couldn’t generate a response.';

    console.log("🤖 GPT reply:", reply);

    res.json({ reply });
  } catch (err) {
    console.error("❌ Error with GPT:", err.message);
    res.status(500).json({ error: 'Something went wrong with GPT' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
