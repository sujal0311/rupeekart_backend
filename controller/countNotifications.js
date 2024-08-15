const Notification = require("../models/notificationModel");

const countNotifications = async (req, res) => {
  try {
    const count = await Notification.countDocuments();

    res.json({
      data: {
        count: count,
      },
      message: "ok",
      error: false,
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: false,
      success: false,
    });
  }
};

module.exports = countNotifications;
