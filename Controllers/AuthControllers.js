import UserModel from "../Models/UserModels.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
  const { userName, password, firstName, lastName } = req.body;

  if (!userName || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const newUser = new UserModel(req.body);
    const oldUser = await UserModel.findOne({ userName });

    if (oldUser) {
      return res.status(200).json("User already exists");
    }

    const user = await newUser.save();
    const token = jwt.sign({ userName: user.userName, id: user._id }, "helloBuka", { expiresIn: '1h' });
    res.status(200).json({ user, token });
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
      return res.status(401).json({ message: "Password doesn't match" });
    }

    const token = jwt.sign({ userName: user.userName, id: user._id }, "helloBuka", { expiresIn: '1h' });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
