const blockUser = (user) => {
  if (user?.isBlocked) throw new Error("your are blocked");
};

module.exports = blockUser;
