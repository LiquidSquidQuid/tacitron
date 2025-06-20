const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for importing from the web
config.resolver.sourceExts = [...config.resolver.sourceExts, 'web.js', 'web.ts', 'web.tsx'];

// Ensure proper MIME types for web
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url.endsWith('.bundle')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      return middleware(req, res, next);
    };
  },
};

// Web-specific configuration
if (process.env.EXPO_PLATFORM === 'web') {
  // Ensure environment variables are available in web builds
  config.resolver.alias = {
    ...config.resolver.alias,
    '@env': require.resolve('./env-web.js'),
  };
}

module.exports = config; 