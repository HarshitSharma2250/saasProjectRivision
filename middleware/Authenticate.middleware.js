const jwt = require("jsonwebtoken");
const user = require("../models/useLogin.model");
require("dotenv").config();

const AuthenticationMiddleware = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      success: false,
      msg: "Not Authorized",
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    jwt.verify(token, process.env.ACCESS_KEY, async (error, decoded) => {
      if (error) {
        return res.status(403).json({
          success: false,
          msg: error.message,
        });
      }
      const checkUser = await user.findById(decoded?.userId).lean();

      if (!checkUser) {
        return res.status(404).json({
          success: false,
          msg: "User not Found , Account mismatched !",
        });
      }
      req.user_detail = checkUser;
      next();
    });
  } catch (error) {
    throw error;
  }
};

module.exports=AuthenticationMiddleware
