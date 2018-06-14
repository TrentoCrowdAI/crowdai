const delegates = require(__base + 'delegates');

/**
 * Returns all the aggregation api records associated with the
 * current requester. It also includes the ones built-in.
 *
 * @param {Object} ctx
 */
const getAll = async ctx => {
  const { sub } = ctx.state.loginInfo;
  let requester = await delegates.requesters.getRequesterByGid(sub);
  let builtin = await delegates.aggregationApi.getBuiltIn(requester.id);
  let allRequester = await delegates.aggregationApi.getByRequester(
    requester.id
  );
  ctx.response.body = builtin.rows.concat(allRequester.rows || []);
};

exports.register = router => {
  router.get('/aggregation-strategies', getAll);
};
