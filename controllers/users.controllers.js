import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.models.js";

const SECRET_KEY = "secret";

const loginUser = async (req, resp) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return resp.status(404).json({ message: "User doesn't exit" });

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch)
      return resp.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    resp.status(200).json({ result: existingUser, token });
  } catch (err) {
    resp.status(500).json({ message: err });
  }
};

const signUpUser = async (req, resp) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return resp.status(400).json({ message: "User already exits" });
    if (password !== confirmPassword)
      return resp.status(400).json({ message: "Passwords do not match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { email: result.email, id: result._id },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return resp.status(201).json({ result, token });
  } catch (err) {
    resp.status(500).json({ message: err });
  }
};

export { loginUser, signUpUser };
