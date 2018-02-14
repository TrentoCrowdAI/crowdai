/**
 * Creates the primary index in order to query the bucket.
 */

const couchbase = require('couchbase');
const config = require('../config');

const cluster = new couchbase.Cluster(`couchbase://${config.db.host}`);
cluster.authenticate(config.db.user, config.db.password);
const bucket = cluster.openBucket(config.db.bucket);
const bucketManager = bucket.manager();

bucketManager.createPrimaryIndex({ name: 'crowdai-amt-pi' }, error => {
  if (error) {
    console.error('Error while creating primery index', error);
    process.exit(1);
  }
});
console.log('Done');
process.exit(0);
