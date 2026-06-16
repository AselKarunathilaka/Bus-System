const ContactMessage = require("../models/ContactMessage");
const mongoose = require("mongoose");
const {
  cleanText,
  isValidEmail,
  isValidPhone,
} = require("../utils/validation");

const CATEGORIES = new Set([
  "Booking Issue",
  "Payment Issue",
  "Route Inquiry",
  "Bus Schedule Inquiry",
  "Account Issue",
  "General Support",
]);

const STATUSES = new Set(["New", "In Progress", "Resolved"]);

exports.createContactMessage = async (req, res) => {
  try {
    const name = cleanText(req.body.name, 100);
    const email = cleanText(req.body.email, 254).toLowerCase();
    const phone = cleanText(req.body.phone, 20);
    const subject = cleanText(req.body.subject, 150);
    const category = cleanText(req.body.category, 50);
    const message = cleanText(req.body.message, 2000);

    if (
      !name ||
      !subject ||
      message.length < 10 ||
      !isValidEmail(email) ||
      !CATEGORIES.has(category)
    ) {
      return res.status(400).json({ message: "Please provide valid support message details" });
    }

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({ message: "Please provide a valid phone number" });
    }

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    if (!STATUSES.has(status)) {
      return res.status(400).json({ message: "Invalid message status" });
    }

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
