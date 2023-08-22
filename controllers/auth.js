import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import users from "../models/auth.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    const existUser = await users.findOne({ email });
    if (existUser) {
      res.status(404).json({ message: "already exist" });
      console.log(existUser);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await users.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      "test",
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ message: "something wrong" });
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const existUser = await users.findOne({ email });
    if (!existUser) {
      res.status(404).json({ message: "don't exist" });
    }

    const isPw = await bcrypt.compare(password, existUser.password);
    console.log(isPw);
    if (!isPw) {
      res.status(404).json({ message: "not match pw" });
    }
    const token = jwt.sign(
      { email: existUser.email, id: existUser._id },
      `${process.env.JWT_SECRET_KEY}`
    );
    res.status(200).json({ result: existUser, token });
  } catch (error) {
    res.status(500).json({ message: "something wrong" });
    console.log(error);
  }
};
