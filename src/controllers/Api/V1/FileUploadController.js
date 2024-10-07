const Image = require("../../../models/Image");

const fileUploadController = {
  uploadImage: async (req, res) => {
    try {
      const { parentId, imageKey } = req?.body ?? {};
      const { filename, path } = req?.file ?? {};

      const [rows] = await Image.findByOrderId(parentId);
      if (rows?.length == 0) {
        const tempData = {
          [imageKey]: path,
        };
        const imageObj = {
          parentId: parentId,
          imageData: JSON.stringify(tempData),
        };
        await Image.createImage(imageObj);
      } else {
        const { id, imageData } = rows?.[0] ?? {};
        let tempData = JSON.parse(imageData);
        tempData = {
          ...tempData,
          [imageKey]: path,
        };
        const imageObj = {
          id: id,
          imageData: JSON.stringify(tempData),
        };
        await Image.updateImage(imageObj);
      }

      res
        .status(200)
        .json({ message: "File upload successfully", fileName: path });
    } catch (error) {
      res
        .status(403)
        .json({ message: "File upload failed", error: error?.message });
    }
  },
};

module.exports = fileUploadController;
