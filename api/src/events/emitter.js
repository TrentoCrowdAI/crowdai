const EventEmitter = require('events');

const crowdrevEmitter = new EventEmitter();

/**
 * Registers a listener for the given event name.
 *
 * @param {String} eventName
 * @param {Function} listener
 */
const on = (eventName, listener) => {
  crowdrevEmitter.on(eventName, listener);
};

/**
 * Emits the given event, passing the specified arguments.
 *
 * @param {String} eventName
 * @param {Any[]} args
 */
const emit = (eventName, ...args) => {
  crowdrevEmitter.emit(eventName, ...args);
};

module.exports = {
  on,
  emit
};
