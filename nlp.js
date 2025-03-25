const natural = require('natural');
const { WordTokenizer, SentimentAnalyzer } = natural;
const stemmer = natural.PorterStemmer;

// Initialize with English language using afinn lexicon
const analyzer = new SentimentAnalyzer('English', stemmer, 'afinn');
const tokenizer = new WordTokenizer();

module.exports = {
  analyzeSentiment: (text) => {
    try {
      const tokens = tokenizer.tokenize(text);
      return analyzer.getSentiment(tokens);
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return 0; // Return neutral if analysis fails
    }
  }
};

