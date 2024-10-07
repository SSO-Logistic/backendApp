const db = require("../config/database");
const moment = require("moment");
const Order = {
  createOrder: (order) => {
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
      userId,
      brc,
      orderData,
    } = order ?? {};

    
    return db
      .promise()
      .execute(
        "INSERT INTO order_table (warehouse, task, vehicleRegistration,tralierNumber,palletsQuantity,strapped,containerNumber,sealNumber,customerName,quantityofcartons,issue,explanation,userId,createdAt,brc,orderData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)",
        [
          warehouse,
          task,
          vehicleRegistration || "",
          tralierNumber || "",
          palletsQuantity || "",
          strapped || "",
          containerNumber || "",
          sealNumber || "",
          customerName || "",
          quantityofcartons || "",
          issue || "",
          explanation || "",
          userId,
          new Date(),
          brc||false,
          orderData,
        ]
      )
      .catch((err) => {
        throw new Error(err);
      });
  },

  findById: (id) => {
    return db.promise().query("SELECT * FROM order_table WHERE id = ?", [id]);
  },
  findByUserId: (userId) => {
    return db
      .promise()
      .query(
        "SELECT * FROM order_table WHERE userId = ? ORDER BY createdAt DESC",
        [userId]
      );
  },
  findAll: () => {
    return db
      .promise()
      .query("SELECT * FROM order_table ORDER BY createdAt DESC");
  },
};

module.exports = Order;
