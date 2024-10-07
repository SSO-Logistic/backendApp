const USER_TYPE = require("../../../config/userType");
const Order = require("../../../models/Order");
const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const Image = require("../../../models/Image");

const orderController = {
  createOrder: async (req, res) => {
    try {
      const { token } = req ?? {};
      const authData = await jwt.verify(token, process.env.DB_SECRET);
      if (!authData) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      const { userId } = authData ?? {};

      const {
        warehouse,
        task,
        vehicleRegistration,
        tralierNumber,
        palletsQuantity,
        strapped,
        containerNumber,
        sealNumber,
        customerName,
        quantityofcartons,
        issue,
        explanation,
        brc,
      } = req?.body ?? {};

      const orderData = {
        warehouse: warehouse,
        task: task,
        vehicleRegistration: vehicleRegistration,
        tralierNumber: tralierNumber,
        palletsQuantity: palletsQuantity,
        strapped: strapped,
        containerNumber: containerNumber,
        sealNumber: sealNumber,
        customerName: customerName,
        quantityofcartons: quantityofcartons,
        issue: issue,
        explanation: explanation,
        userId: userId,
        brc:brc,
        orderData:JSON.stringify(req?.body)
      };
      
      const [results] = await Order.createOrder(orderData);
      const orderId = results.insertId;

      res
        .status(200)
        .json({ message: "Order created successfully", orderId: orderId });
    } catch (error) {
      console.log(error)
      res.status(401).json({ message: "Order creation failed", error: error });
    }
  },

  fetchUserOrder: async (req, res) => {
    try {
      const { token } = req ?? {};
      const authData = await jwt.verify(token, process.env.DB_SECRET);
      if (!authData) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      const { userId } = authData ?? {};
      const [rows] = await Order.findByUserId(userId);
     
      res.status(200).json({ message: "Success", data: rows });
    } catch (error) {

      res.status(401).json({ message: "Fetching Order failed" });
    }
  },
  fetchOrderById: async (req, res) => {
    try {
      const { token } = req ?? {};
      const authData = await jwt.verify(token, process.env.DB_SECRET);
      if (!authData) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      const { id } = req.params ?? {};

      const orderResult = await Order.findById(id);
      const orderData = orderResult?.[0] || [];
      if (orderData.length === 0) {
        return res.status(403).json({ message: "Invalid Order id" });
      }
      const [rows] = await Image.findByOrderId(id);
      
      const imageData=rows?.length!==0?JSON.parse(rows?.[0]?.imageData):{}
      const orderObj={...orderData?.[0],"orderData":JSON.parse(orderData?.[0]?.orderData)}
      const result = {
        ...orderObj,
        imageData: imageData,
      };

      res.status(200).json({ message: "Success", data: result });
    } catch (error) {
      res.status(401).json({ message: "Fetching Order failed" });
    }
  },
  fetchAllOrder: async (req, res) => {
    try {
      const { token } = req ?? {};
      const authData = await jwt.verify(token, process.env.DB_SECRET);
      if (!authData || authData?.userType !== USER_TYPE.admin) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      const { userId } = authData ?? {};
      const userResult = await User.findById(userId);
      const userData = userResult?.[0] || {};
      if (userData.length === 0) {
        return res.status(403).json({ message: "Invalid User" });
      }
      const [rows] = await Order.findAll();
      res.status(200).json({ message: "Success", data: rows });
    } catch (error) {
      res.status(401).json({ message: "Fetching Order failed" });
    }
  },
  fetchOrderByUserId: async (req, res) => {
    try {
      const { token } = req ?? {};
      
      const authData = await jwt.verify(token, process.env.DB_SECRET);
      if (!authData|| authData?.userType !== USER_TYPE.admin) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      const { userId } = req.params ?? {};
      const userResult = await User.findById(userId);
     
      const userData = userResult?.[0] || {};
     
      if (userData.length === 0) {
        return res.status(403).json({ message: "Invalid User" });
      }
      const [rows] = await Order.findByUserId(userId);
     
      res.status(200).json({ message: "Success", data: rows });
    } catch (error) {

      res.status(401).json({ message: "Fetching Order failed" });
    }
  },
};

module.exports = orderController;
