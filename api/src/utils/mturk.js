const AWS = require('aws-sdk');
const config = require(__base + 'config');

const getInstance = (exports.getInstance = requester => {
  return new AWS.MTurk({
    endpoint: config.mturk.requesterSandboxUrl,
    accessKeyId: requester.data.accessKeyId,
    secretAccessKey: requester.data.secretAccessKey,
    region: config.mturk.region
  });
});

const getExternalQuestionPayload = (exports.getExternalQuestionPayload = (
  url,
  frameHeight = 600
) => {
  return `
  <ExternalQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2006-07-14/ExternalQuestion.xsd">
    <ExternalURL>${url}</ExternalURL>
    <FrameHeight>${frameHeight}</FrameHeight>
  </ExternalQuestion>
`;
});
