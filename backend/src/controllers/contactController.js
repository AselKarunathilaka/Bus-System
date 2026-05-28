const ContactMessage = require("../models/ContactMessage");

exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, category, message } = req.body;

    const newMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      category,
      message,
    });

    await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully",
      contactMessage: newMessage,
    });
  } catch (error) {
    console.error("Error creating contact message:", error);
    res.status(500).json({ message: "Server error creating message" });
  }
};

exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Server error fetching messages" });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({
      message: "Message status updated successfully",
      contactMessage: message,
    });
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({ message: "Server error updating status" });
  }
};
