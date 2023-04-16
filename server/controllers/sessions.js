function withoutProperty(obj, property) {
  const { [property]: unused, ...rest } = obj;

  return rest;
}

exports.getSessionInfo = async (req, res) => {
  if (req.session) {
    res.json({
      status: "success",
      message: "Session information retrieved",
      data: req.session,
    });
  } else {
    res.status(404).json({
      status: "error",
      message: "No session found",
    });
  }
};

exports.generateSession = async (req, res) => {
  console.log("Inside generate Session of Session Controller");
  const userInfo = req.userInfo;
  const userDataToSend = {
    username: userInfo.username,
    role: userInfo.role,
    user_id: userInfo.user_id,
    events_booked: userInfo.events_booked,
    favorites: userInfo.favorites,
    listings: userInfo.listings,
    isActivated : userInfo.isActivated,
    isVerified : userInfo.isVerified
  };

  req.session.authorized = true;
  res.status(201).send({
    message: `Session Created for User: ${req.username}`,
    success: true,
    user: userDataToSend,
  });
};

exports.deleteSession = async (req, res) => {
  const username = req.session.user;
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({
        status: "error",
        message: "Error deleting session",
      });
    } else {
      res.json({ username, message: "Session deleted" });
    }
  });
};
