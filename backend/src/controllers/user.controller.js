import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const changePassword = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { oldPassword, newPassword } = req.body || {};

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    if (String(newPassword).length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    if (String(oldPassword) === String(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from old password",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const storedPassword = user.password || "";
    const looksLikeBcryptHash = typeof storedPassword === "string" && storedPassword.startsWith("$2");

    let oldMatches = false;
    if (looksLikeBcryptHash) {
      oldMatches = await bcrypt.compare(oldPassword, storedPassword);
    } else {
      oldMatches = String(oldPassword) === String(storedPassword);
    }

    if (!oldMatches) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Set new password; model pre-save hook hashes it.
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

