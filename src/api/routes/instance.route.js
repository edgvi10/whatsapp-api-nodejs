const express = require("express");
const controller = require("../controllers/instance.controller");
const keyVerify = require("../middlewares/keyCheck");
const loginVerify = require("../middlewares/loginCheck");

const router = express.Router();
router.route("/list").get(controller.list);

router.route("/init").post(controller.init);
router.route("/create").post(controller.init);

router.route("/info").get(keyVerify, controller.info);

router.route("/qr").get(keyVerify, controller.qr);
router.route("/qrcode").get(keyVerify, controller.qr);
router.route("/qrbase64").get(keyVerify, controller.qrbase64);

router.route("/restore").get(controller.restore);

router.route("/logout").delete(keyVerify, loginVerify, controller.logout);
router.route("/delete").delete(keyVerify, controller.delete);

// RESTFUL API
router.route("/").post(controller.init);
router.route("/").get(controller.list);
router.route("/:key").get(keyVerify, controller.info);
router.route("/:key/qr").get(keyVerify, controller.qrbase64);
router.route("/:key").put(keyVerify, controller.init);
router.route("/:key/disconnect").patch(keyVerify, controller.logout);
router.route("/:key/connect").patch(keyVerify, controller.init);
router.route("/:key").delete(keyVerify, controller.init);

module.exports = router;
