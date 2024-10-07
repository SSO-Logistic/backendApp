const db = require("../config/database");
const USER_TYPE = require("../config/userType");

const Image = {
  createImage: (image) => {
    const { parentId, imageData, imageKey } = image ?? {};
    console.log(image)
    return db
      .promise()
      .execute(
        "INSERT INTO image_table (parentId, imageData) VALUES (?, ?)",
        [parentId, imageData]
      ).catch((err)=>{
        throw new Error(err)
      });
  },
  findByOrderId: (orderId) => {
    return db
      .promise()
      .query("SELECT * FROM image_table WHERE parentId = ?", [orderId]);
  },

  updateImage: (image) => {
    const { imageData,id } = image ?? {};
    console.log(image)
    return db
      .promise()
      .execute("UPDATE image_table SET imageData=? WHERE id = ?", [imageData, id])
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  },

};

module.exports = Image;
