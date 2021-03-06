function getAvailableEarmarks({ grantsCompleted, projectCategory }) {
  const availableEarmaks = [];
  if (grantsCompleted === 0) {
    if (projectCategory === "outreach") {
      availableEarmaks.push("newprojectoutreach");
    }
    else {
      availableEarmaks.push("newprojectoutreach");
      availableEarmaks.push("newproject");
    }
  } else {
    availableEarmaks.push("general");
  }

  if (grantsCompleted === 1 || grantsCompleted === 2) {
    availableEarmaks.push("2nd3rd");
  }

  availableEarmaks.push("coretech");

  return availableEarmaks;
}

module.exports = {
  getAvailableEarmarks,
};
