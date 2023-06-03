var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var passwordHash = require("password-hash");
var User = require("../../Models/user");
var Transaction = require("../../Models/transaction");

const { Validator } = require("node-input-validator");

function createToken(data) {
  return jwt.sign(data, "DonateSmile");
}

const getTokenData = async (token) => {
  // console.log('token', token);
  let userData = await User.findOne({ token: token }).exec();
  // console.log('adminData', userData);
  return userData;
};

const register = async (req, res) => {
  const v = new Validator(req.body, {
    email: "required|email",
    password: "required",
  });
  let matched = await v.check().then((val) => val);
  if (!matched) {
    return res.status(200).send({ status: false, error: v.errors });
  }
  User.findOne({ email: req.body.email }).then(async (data) => {
    if (data == null || data == "") {
      console.log("Data", data);
      let userData = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
        token: createToken(req.body),
      };
      if (typeof req.body.contact !== "undefined" && req.body.contact != "") {
        userData.contact = req.body.contact;
      }
      if (typeof req.body.address !== "undefined" && req.body.address != "") {
        userData.address = req.body.address;
      }
      if (
        typeof req.body.instagram !== "undefined" &&
        req.body.instagram != ""
      ) {
        userData.instagram = req.body.instagram;
      }
      if (typeof req.body.website !== "undefined" && req.body.website != "") {
        userData.website = req.body.website;
      }

      const all_users = new User(userData);

      return all_users
        .save()
        .then((result) => {
          res.status(200).json({
            status: true,
            success: true,
            message: "New user created successfully",
            data: result,
          });
        })
        .catch((error) => {
          res.status(200).json({
            status: false,
            success: false,
            message: "Server error. Please try again.",
            error: error,
          });
        });
    } else {
      res.status(200).json({
        status: false,
        message: "Email is already registered.",
        error: "Email exists.",
      });
    }
  });
};

const transaction = async (req, res) => {
  let userData = {
    _id: mongoose.Types.ObjectId(),
    transactionid: req.body.transactionid,
    email: req.body.email,
  };

  const all_users = new Transaction(userData);

  return all_users
    .save()
    .then((result) => {
      res.status(200).json({
        status: true,
        success: true,
        message: "ransaction saved successfully",
        data: result,
      });
    })
    .catch((error) => {
      res.status(200).json({
        status: false,
        success: false,
        message: "Server error. Please try again.",
        error: error,
      });
    });
};

// const signup = async (req,res)=>{}

const login = async (req, res) => {
  let v = new Validator(req.body, {
    email: "required|email",
    password: "required|minLength:8",
  });
  let matched = await v.check().then((val) => val);
  if (!matched) {
    return res.status(401).json({
      status: false,
      error: v.errors,
    });
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data == null || data == "") {
      res.status(400).json({
        status: false,
        message: "Wrong email id.",
        error: "Wrong email id.",
      });
    } else if (
      data != null &&
      data != "" &&
      data.comparePassword(req.body.password)
    ) {
      return res.status(200).json({
        status: true,
        message: "Successfully logged in",
        data: data,
      });
    } else {
      res.status(500).json({
        status: false,
        message: "Wrong password.",
        error: "Wrong password.",
      });
    }
  });
};

module.exports = {
  getTokenData,
  register,
  login,
  transaction,
};
