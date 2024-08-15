const Notification=require("../models/notificationModel")
async function getNotificationController(req,res){
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
      }
}
module.exports=getNotificationController