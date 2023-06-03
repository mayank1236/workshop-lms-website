const express = require("express");
const multer = require("multer");
var nodeCron = require("node-cron");

const router = express.Router();

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const AdminController = require("../../Controller/Auth/Admin");
const UserController = require("../../Controller/Auth/User");

/**-----------------------Website info section end----------------------- */

const middleware = require("../../service/middleware").middleware;

const AdminRoute = require("./admin");
const UserRoute = require("./user");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ status: false });
});

/** ================================= without login url ================================= */

router.post("/admin/register", AdminController.register);
router.post("/admin/login", AdminController.login);

router.post("/user/register", UserController.register); // add upload image option in future
router.post("/user/login", UserController.login);
router.post("/user/transaction", UserController.transaction);

/** ================================= without login url section end ================================ */

router.use(middleware);

router.use("/admin", AdminRoute);
router.use("/user", UserRoute);

module.exports = router;
