const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Import language detector and config wizard
const { detectUserLanguage, getLanguageConfig } = require('./electronic-sheep-language-detector');
const { generateConfigWizard } = require('./electronic-sheep-config-wizard');

const app = express();
const PORT = 19003;

app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '2.7.1' });
});

// Language detection endpoint
app.post('/detect-language', (req, res) => {
  try {
    const { userAgent, acceptLanguage, userLocale, explicitLanguage } = req.body;
    const detectedLang = detectUserLanguage({
      userAgent,
      acceptLanguage,
      userLocale,
      explicitLanguage
    });
    res.json({ 
      detectedLanguage: detectedLang,
      config: getLanguageConfig(detectedLang)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Config wizard endpoint
app.post('/config-wizard', (req, res) => {
  try {
    const { language, context } = req.body;
    const wizard = generateConfigWizard(language, context);
    res.json(wizard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Memory operations with language support
app.post('/memory/query', (req, res) => {
  // Implementation for memory queries with language-aware responses
  res.json({ message: 'Memory query processed', language: req.body.language || 'auto' });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🐑 Electronic Sheep MCP Server v2.7.1 running on http://127.0.0.1:${PORT}`);
  console.log(`🌐 Multi-language support enabled`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🐑 Shutting down Electronic Sheep MCP Server...');
  process.exit(0);
});