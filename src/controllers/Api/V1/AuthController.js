const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const USER_TYPE = require("../../../config/userType");
const { validationResult } = require("express-validator");

const authController = {
  registerAdmin: async (req, res) => {
    try {
      // Validate the user input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(401).json({ message: errors.array() });
      }
      const { username, phone, password } = req.body;
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create the user in the database
      await User.createAdmin({ username, phone, password: hashedPassword });
      return res.status(200).json({ message: "Admin registered successfully" });
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Registration failed", error: error?.message });
    }
  },
  loginAdmin: async (req, res) => {
    try {
      const { username, password } = req.body;
      // Find the user by phone
      const [rows] = await User.findByUsername(username);
      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const user = rows[0];
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Password" });
      }
      // Generate a JWT token
      const { id, user_type } = user ?? {};
      const token = jwt.sign(
        { userId: id, username: username, userType: user_type },
        process.env.DB_SECRET,
        {
          expiresIn: "30 days", // Adjust the expiration time as needed
        }
      );
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ message: "Login failed" });
    }
  },

  register: async (req, res) => {
    try {
      // Validate the user input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }

      const { username, phone, password } = req.body;
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create the user in the database
      await User.createUser({ username, phone, password: hashedPassword });
      const [rows] = await User.findByPhone(phone);
      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const user = rows[0];
      // Generate a JWT token
      const { id, user_type } = user ?? {};
      const token = jwt.sign(
        { userId: user.id, phone: phone, userType: user_type },
        process.env.DB_SECRET,
        {
          expiresIn: "30 days", // Adjust the expiration time as needed
        }
      );

      res
        .status(200)
        .json({ message: "User registered successfully", token: token });
    } catch (error) {
      res.status(401).json({ message: "Registration failed" });
    }
  },

  login: async (req, res) => {
    try {
      // Validate the user input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
      const { phone, password } = req.body;
      // Find the user by phone
      const [rows] = await User.findByPhone(phone);

      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = rows[0];
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Password" });
      }
      // Generate a JWT token
      const { id, user_type } = user ?? {};
      const token = jwt.sign(
        { userId: user.id, phone: phone, userType: user_type },
        process.env.DB_SECRET,
        {
          expiresIn: "30 days", // Adjust the expiration time as needed
        }
      );
      res
        .status(200)
        .json({ message: "User login successfully", token: token });
    } catch (error) {
      res.status(401).json({ message: "Login failed" });
    }
  },
  authMe: async (req, res) => {
    try {
      const { token } = req ?? {};
      const authData = await jwt.verify(token, process.env.DB_SECRET);
      if (!authData) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      const { userId } = authData ?? {};
      // Find the user by phone
      const [rows] = await User.findById(userId);
      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid User" });
      }
      const user = rows[0];
      delete user["password"];
      res.status(200).json({ user: user });
    } catch (error) {
      res.status(401).json({ message: "Login failed" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { token } = req ?? {};
      const authData = await jwt.verify(token, process.env.DB_SECRET);
      if (!authData) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      const { userId } = authData ?? {};
      const { id, phone, profileImage, isActive, username } = req?.body;
      const userRequest = {
        id: id,
        phone: phone,
        profileImage: profileImage,
        isActive: isActive,
        username: username,
      };

      await User.updateUser(userRequest);
      const [rows] = await User.findById(userId);
      let user = authData;
      if (rows.length !== 0) {
        user = rows[0];
      }
      delete user["password"];
      res.status(200).json({ user: user });
    } catch (error) {
      res.status(401).json({ message: "Login failed" });
    }
  },
  fetchAllUser: async (req, res) => {
    try {
      const { token } = req ?? {};
      const authData = await jwt.verify(token, process.env.DB_SECRET);
      if (!authData || authData?.userType !== USER_TYPE.admin) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      const [rows] = await User.findAllUser();
      res.status(200).json({ message: "Successfully fetched", data: rows });
    } catch (error) {
      res.status(401).json({ message: "Data fetched failed" });
    }
  },
  updateUserPassword: async (req, res) => {
    try {
      const { token } = req ?? {};
      const authData = await jwt.verify(token, process.env.DB_SECRET);
      if (!authData) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      const { id, password } = req?.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userRequest = {
        id: id,
        password: hashedPassword,
      };
      await User.updateUserPassword(userRequest);
      res.status(200).json({ message: "Successfully update pasword" });
    } catch (error) {
      res.status(401).json({ message: "Login failed" });
    }
  },
};

module.exports = authController;
