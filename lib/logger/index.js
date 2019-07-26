'use strict';
const Logger = require('./services/winston');
/**
 * Logger.
 *
 * Manages logs. Settings are configured in the default configuration file.
 */
const logger = new Logger(["sanitizer", "de_sanitizer"]);

/**
 * Exports.
 */
module.exports = logger;