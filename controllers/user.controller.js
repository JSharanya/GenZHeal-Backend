import bcrypt from 'bcryptjs';
import User from "../models/auth.model.js";

export const getUserProfilebyId = async (req, res) => {
  try {
    let _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found !" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  let _id = req.params.id;
  const user = await User.findById(_id);
  if (user) {
    const originalUserData = {
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      password: user.password,
    };

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const isUserDataChanged =
      Object.keys(originalUserData).some(
        (key) => user[key] !== originalUserData[key]
      ) ||
      (req.body.password && req.body.password !== user.password);

    if (isUserDataChanged) {
      await user.save();
      res.status(200).json({
        message: "Profile Updated Succesfully",
      });
    } else {
      return res.status(201).json({
        message: "No changes made",
      });
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).json({ message: "User is Empty !" });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error("Failed to fetch users from MongoDB:", err);
    res.status(500).json({ message: err.message });
  }
};