exports.getInstance = () => {
  return {
    createHIT(params, callback) {
      callback(null, {
        HIT: { ...params }
      });
    }
  };
};

exports.getExternalQuestionPayload = () => {
  return '';
};
