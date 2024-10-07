const express = require("express");
const router = express.Router();

const authController = require("../controllers/Api/V1/AuthController");
const orderController = require("../controllers/Api/V1/OrderController");

const {
  userRegisterValidationRules,
  userLoginValidationRules,
  verifyToken,
} = require("../validations/Api/V1/UserValidation");
const uploadFile= require('../services/uploadFile');
const fileUploadController = require("../controllers/Api/V1/FileUploadController");



router.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcoe" });
});

router.post(
  "/registerAdmin",
  userRegisterValidationRules(),
  authController.registerAdmin
);
router.post(
  "/register",
  userRegisterValidationRules(),
  authController.register
);
router.post(
  "/loginAdmin",
  userLoginValidationRules(),
  authController.loginAdmin
);
router.post("/login", userLoginValidationRules(), authController.login);
router.get("/authMe", verifyToken, authController.authMe);
router.get("/fetchAllUser", verifyToken, authController.fetchAllUser);
router.post("/updateUser", verifyToken, authController.updateUser);
router.post("/reserPassword", verifyToken, authController.updateUserPassword);


router.post("/createOrder", verifyToken, orderController.createOrder);
router.get("/userOrders", verifyToken, orderController.fetchUserOrder);
router.get("/order/:id", verifyToken, orderController.fetchOrderById);
router.get("/allOrder", verifyToken, orderController.fetchAllOrder);
router.get("/userOrder/:userId", verifyToken, orderController.fetchOrderByUserId);

router.post('/upload', uploadFile.single('image'),fileUploadController.uploadImage);



module.exports = router;
