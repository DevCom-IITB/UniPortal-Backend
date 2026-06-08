const axios = require('axios');

const translateText = async (req, res) => {
  try {
    const { text, target_lang } = req.body;
    
    // The NewBee-NLP service usually runs on port 5001
    const nlpUrl = process.env.NLP_SERVICE_URL || 'http://localhost:5001/translate';
    
    const response = await axios.post(nlpUrl, {
      text,
      target_lang: target_lang || 'en'
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Translation error:', error.message);
    res.status(500).json({ message: 'Error translating text' });
  }
};

module.exports = {
  translateText
};
