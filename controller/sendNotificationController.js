const Notification=require("../models/notificationModel")
async function sendNotificationController(req,res){
    try {
        const { message } = req.body;
        const notification = new Notification({ message });
        await notification.save();
        res.status(201).json({success:"true",notification});
      } catch (error) {
        res.status(500).json({ error:'Failed to send notification' });
      }
}
module.exports=sendNotificationController