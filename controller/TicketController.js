const Ticket = require("../models/TicketModel");
const UserModel = require("../models/userModels");
const { sendMail } = require("./helpers/sendMail");

exports.createTicket = async (req, res) => {
  try {
    const { subject, description } = req.body;

    // Generate a unique ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    console.log(ticketNumber);
    // Create a new ticket with the generated ticket number
    const newTicket = new Ticket({
      userId: req.userId,
      subject,
      description,
      ticketNumber,
    });

    await newTicket.save();
    console.log("saved ticket");
    // Fetch user details to send the email
    const user = await UserModel.findById(req.userId);
    // console.log(user);
    const email = user.email;
    const name = user.name;

    const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ticket Created Successfully</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f8f8; margin: 0; padding: 0; color: #333; }
          .container { max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
          .header { background-color: #4CAF50; color: #fff; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .content { padding: 20px; }
          .content h2 { font-size: 22px; margin-bottom: 15px; color: #4CAF50; font-weight: 500; }
          .content p { line-height: 1.6; margin-bottom: 10px; }
          .ticket-section { margin-bottom: 20px; }
          .ticket-details { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .ticket-details th, .ticket-details td { padding: 12px; border: 1px solid #ddd; text-align: left; font-size: 14px; }
          .ticket-details th { background-color: #f2f2f2; font-weight: 600; }
          .footer { background-color: #4CAF50; color: #fff; text-align: center; padding: 15px; font-size: 14px; border-top: 1px solid #ddd; }
          .footer p { margin: 0; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ticket Created Successfully</h1>
          </div>
          <div class="content">
            <h2>Dear ${name},</h2>
            <p>Your ticket has been successfully created. Below are the details:</p>
            <div class="ticket-section">
              <h3>Ticket Details</h3>
              <table class="ticket-details">
                <tr>
                  <th>Ticket Number</th>
                  <td>${ticketNumber}</td>
                </tr>
                <tr>
                  <th>Subject</th>
                  <td>${subject}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>${description}</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for reaching out to us! We will get back to you shortly.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the email
    sendMail(
      email,
      "Ticket created successfully",
      "Your ticket has been successfully created",
      emailHTML
    );

    // Return success response with the created ticket
    res
      .status(201)
      .json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: "Error creating ticket", error });
  }
};

// Get tickets for the user
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tickets", error });
  }
};

// Admin view: Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: "true", tickets });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tickets", error });
  }
};

exports.updateTicketStatus = async (req, res) => {
  const { ticketID, status } = req.body;
  // console.log(ticketID);
  try {
    const ticket = await Ticket.findOneAndUpdate({ _id: ticketID }, { status },{new:"true"});
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    const user = await UserModel.findById(ticket.userId);
    const email = user.email;
    const name = user.name;
    const emailHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Closed Successfully</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f8f8f8;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            font-size: 22px;
            margin-bottom: 15px;
            color: #4CAF50;
            font-weight: 500;
        }
        .content p {
            line-height: 1.6;
            margin-bottom: 10px;
        }
        .ticket-section {
            margin-bottom: 20px;
        }
        .ticket-details {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .ticket-details th, .ticket-details td {
            padding: 12px;
            border: 1px solid #ddd;
            text-align: left;
            font-size: 14px;
        }
        .ticket-details th {
            background-color: #f2f2f2;
            font-weight: 600;
        }
        .footer {
            background-color: #4CAF50;
            color: #fff;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            border-top: 1px solid #ddd;
        }
        .footer p {
            margin: 0;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ticket Closed Successfully</h1>
        </div>
        <div class="content">
            <h2>Dear ${name},</h2>
            <p>We are writing to inform you that your ticket has been successfully closed. Here are the details:</p>

            <div class="ticket-section">
                <h3>Ticket Details</h3>
                <table class="ticket-details">
                    <tr>
                        <th>Ticket Number</th>
                        <td>${ticket.ticketNumber}</td>
                    </tr>
                    <tr>
                        <th>Subject</th>
                        <td>${ticket.subject}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>${ticket.description}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>${ticket.status}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="footer">
            <p>Thank you for contacting us! If you have any further questions, feel free to reach out.</p>
        </div>
    </div>
</body>
</html>
`;
    sendMail(
      email,
      "Ticket closed successfully",
      "Your ticket has been successfully closed",
      emailHTML
    );
    res.status(200).json({ success: "true", ticket });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Error updating ticket status", error });
  }
};
