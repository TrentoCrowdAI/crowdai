const Boom = require('boom');

const bucket = require(__base + 'db').bucket;
const config = require(__base + 'config/config.json');
const answersDelegate = require('./answers');

const getWorkerReward = (exports.getWorkerReward = async workerId => {
  try {
    const count = await answersDelegate.getWorkerAnswersCount(workerId);
    return { reward: count * config.rules.taskReward };
  } catch (error) {
    console.error(error);
    throw Boom.badImplementation('Error while computing reward');
  }
});
