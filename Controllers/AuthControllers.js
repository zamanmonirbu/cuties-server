import UserModel from "../Models/UserModels.js";
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  const { userName, password, firstName, lastName } = req.body;

  if (!userName || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      userName,
      password: hashedPassword,
      firstName,
      lastName,
    });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password don't match" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};