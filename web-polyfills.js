// Web polyfills for React Native modules
import 'react-native-url-polyfill/auto';

// Add any other web-specific polyfills here
if (typeof global === 'undefined') {
  global = globalThis;
}