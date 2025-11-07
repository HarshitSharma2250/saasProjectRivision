const user = require("../models/useLogin.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const day = require("dayjs");
const { getActiveUsersCount } = require("./presenceService");
const Revenue = require("../models/user.revenue.modal");

const registerUser = async ({ name, email, password, number, age, gender }) => {
  try {
    const isExist = await user.findOne({ email });

    if (isExist) {
      const error = new Error("User already registered, please login again");
      error.statusCode = 409;
      throw error;
    }

    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUND) || 10
    );
    const newUser = new user({
      name,
      email,
      password: hashPassword,
      number,
      age,
      gender,
    });
    await newUser.save();

    await Revenue.create({
      userId: newUser._id,
      amount: 500,
      source: "signup_bonus",
      status: "success",
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.ACCESS_KEY, {
      expiresIn: "7d",
    });
    return { newUser, token };
  } catch (error) {
    throw error;
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const isexist = await user.findOne({ email });

    if (!isexist) {
      const error = new Error("user is not register , please register first");
      error.statusCode = 404;
      throw error;
    }
    //Compare password
    const isMatch = await bcrypt.compare(password, isexist.password);

    if (!isMatch) {
      const error = new Error("Invalid credentials.");
      error.statusCode = 401;
      throw error;
    }

    const revinueRecord = await Revenue.findOne({ userId: isexist._id });
    if (revinueRecord) {
      revinueRecord.amount += 50;
      revinueRecord.source = "login_bonus";
      revinueRecord.status = "success";
      await revinueRecord.save();
    }

    const token = jwt.sign({ userId: isexist._id }, process.env.ACCESS_KEY, {
      expiresIn: "7d",
    });
    return { verifyUser: isexist, token };
  } catch (error) {
    throw error;
  }
};

const keyMatrixService = async () => {
  try {
    const revenueAggegration = [
      {
        $match: { status: "success" },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ];
    const startOfMonth = day().startOf("month").toDate();
    const endOfMonth = day().endOf("month").toDate();
    const totalUser = await user.countDocuments();
    const newUser = await user.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const activeCount = await getActiveUsersCount();
    const revinue = await Revenue.aggregate(revenueAggegration);

    const totalRevenue = revinue[0]?.total;
    return { totalUser, newUser, activeCount, totalRevenue };
  } catch (error) {
    throw error;
  }
};

const GetTotalusers = async () => {
  try {
    const totleUserWithRevenue = [
      {
        $lookup: {
          from: "revenues",
          foreignField: "userId",
          localField: "_id",
          as: "revenueModal",
        },
      },
      {
        $unwind: {
          path: "$revenueModal",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { "revenueModal.amount": -1 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          revenue: "$revenueModal.amount",
        },
      },
    ];
    const totaluser = await user.aggregate(totleUserWithRevenue);
    return totaluser;
  } catch (error) {
    throw error;
  }
};

module.exports = { registerUser, loginUser, keyMatrixService, GetTotalusers };
