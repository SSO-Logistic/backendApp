const multer = require("multer");
const fs = require("fs");
const excelFilter = (req, file, cb) => {
  if (file.mimetype.includes("jpeg") || file.mimetype.includes("png")) {
    cb(null, true);
  } else {
    cb("Please upload only jpeg and png file.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir("./public/uploads/", (err) => {
      cb(null, "./public/uploads/");
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}_${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = uploadFile;
