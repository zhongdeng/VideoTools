const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('txt');
console.log(defaultConfig);

module.exports = mergeConfig(defaultConfig, config);
