const redis = require("./index");

function getProposalRedis(id, path) {
  return redis.json.get(id, {
    path,
  });
}
function getProposalRedisMultiple(ids, path) {
  if (ids.length == 0) return [];
  return redis.json.mGet(ids, path);
}

module.exports = {
  getProposalRedis,
  getProposalRedisMultiple,
};
