const { sendNewUserEmail } = require("../utils/email");

module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, username, email } = req.body;

  try {
    sendNewUserEmail(to, username, email);
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
