const { body ,header} = require("express-validator");

const userRegisterValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters"),

    body("password")
      .notEmpty()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters"),

    body("phone")
      .notEmpty()
      .isMobilePhone()
      .withMessage("Invalid phone  number")
      .isLength({ min: 10})
      .withMessage("Phone must be at least 10 characters"),
  ];
};

const userLoginValidationRules = () => {
  return [
    body("phone")
      .notEmpty()
      .isMobilePhone()
      .withMessage("Invalid phone number"),

    body("password")
      .notEmpty()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters"),
  ];
};


const verifyToken=(req,res,next)=>{
   


  
  const bearerHeader=req.headers.authorization
  
  if(typeof bearerHeader!=='undefined'){
    const bearer=bearerHeader.split(' ')
    const bearerToken=bearer[1];
    req.token=bearerToken
    next();
  }
  else{
    res.status(403).json({ message:'Invalid token' });
  }
}




module.exports = {
  userRegisterValidationRules,
  userLoginValidationRules,
  verifyToken
};
