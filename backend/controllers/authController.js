const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required", });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be between 6 to 15 characters long.", });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: `User registered with email ${email}` });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required", });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be between 6 to 15 characters long.", });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: `User with email ${email} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
      return res.status(404).json({ message: `Invalid credentails` });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h"}
    );

    res.status(200).json({ token });

  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  register,
  login,
};
