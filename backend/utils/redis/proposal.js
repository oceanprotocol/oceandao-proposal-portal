const redis = require("./index");

function getProposalRedis(id, path) {
  return redis.json.get(id, {
    path,
  });
}
function getProposalRedisMultiple(ids, path) {
  console.log(ids);
  return redis.json.mGet(ids, path);
}

module.exports = {
  getProposalRedis,
  getProposalRedisMultiple,
};
