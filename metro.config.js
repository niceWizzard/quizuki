const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add custom extensions if needed
config.resolver.sourceExts.push('sql');

// Add 'src' to watchFolders so Metro can find 'src/app'
config.watchFolders = [path.resolve(__dirname, 'src')];

module.exports = config;
