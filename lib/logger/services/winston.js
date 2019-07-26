'use strict';
const _ = require('underscore');
var winston = require('winston');
/**
 * Winston Service.
 *
 * @interface get, list
 * @pattern facade
 */

/**
 * Constructor.
 *
 * @param [ String ] The names of the logs to register
 */
function Winston(logs) {
    this.winston = winston; // @pattern singleton
    this._registerLogs(logs);
}

/**
 * Returns a registered log. The returned logger object MUST implement the `info`,
 * `warn` and `error` functions.
 *
 * @param name String The name of the log to fetch
 * @return {...} A Winston logging object
 */
Winston.prototype.get = function(name) {
    return this.winston.loggers.get(name); // @implements info, warn, error
};

/**
 * Does this log exist?
 *
 * @return Boolean
 */
Winston.prototype.exists = function(name) {
    return _.contains(this.list(), name);
};

/**
 * Returns a list of transports currently used.
 *
 * @return [ { Winston Transport } ]
 */
Winston.prototype._getTransports = function(log) {
    return [
        new winston.transports.Console({
            colorize: true,
            level: 'error',
            timestamp: true,
        }),
        new winston.transports.File({
            filename: 'data/logs/' + log + '.log',
            timestamp: true,
            json: true
        })
    ];
};

/**
 * Returns a list of the currently registered loggers.
 *
 * @return [ String ] The names of each log currently registered
 */
Winston.prototype.list = function() {
    return Object.keys(this.winston.loggers.loggers);
};

/**
 * Registers each log listed in the configurations.
 *
 * @param logs [ String ] The names of each log to register
 */
Winston.prototype._registerLogs = function(logs) {
    logs.forEach(function(log) {
        this.winston.loggers.add(log, {
            transports: this._getTransports(log)
        });
    }.bind(this));
};

/**
 * Register a log
 *
 * @param String log  Name of log
 */
Winston.prototype.registerLog = function(log) {
    this.winston.loggers.add(log, {
        transports: this._getTransports(log)
    });
};

/**
 * Exports.
 */
module.exports = Winston;
