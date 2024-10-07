const db = require("../config/database");
const USER_TYPE = require("../config/userType");

const User = {
  createAdmin: (user) => {
    const { username, phone, password } = user ?? {};
    return db
      .promise()
      .execute(
        "INSERT INTO user_table (username, phone, password,user_type,isActive) VALUES (?, ?, ?, ?, ?)",
        [username, phone, password, USER_TYPE.admin, true]
      );
  },

  createUser: (user) => {
    const { username, phone, password } = user ?? {};
    return db
      .promise()
      .execute(
        "INSERT INTO user_table (username, phone, password,user_type,isActive) VALUES (?, ?, ?, ?, ?)",
        [username, phone, password, USER_TYPE.worker, false]
      )
      .catch((err) => {
        throw new Error(err);
      });
  },

  findByUsername: (userName) => {
    return db
      .promise()
      .query("SELECT * FROM user_table WHERE  username = ?", [userName]);
  },

  findByPhone: (phone) => {
    return db
      .promise()
      .query("SELECT * FROM user_table WHERE phone = ?", [phone]);
  },
  findById: (id) => {
    return db.promise().query("SELECT * FROM user_table  WHERE id = ?", [id]);
  },
  updateUser: (user) => {
    const { id, username, phone, profileImage, isActive } = user ?? {};
    return db
      .promise()
      .execute(
        "UPDATE user_table SET username=?, phone=?,profileImage=?,isActive=? WHERE id = ?",
        [username, phone, profileImage, isActive, id]
      )
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  },

  findAllUser: () => {
    return db.promise().query("SELECT * FROM user_table");
  },
  updateUserPassword: (user) => {
    const { id, password } = user ?? {};
    return db
      .promise()
      .execute("UPDATE user_table SET password=? WHERE id = ?", [password, id])
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  },
};

module.exports = User;
