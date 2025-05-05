const express = require("express");
const router = express.Router();

const { login, register, forgotPassword, resetPassword, uploadImage, updatePassword } = require("../controllers/auth");

router.get("/", (req, res) => {
    return res.json({
        data: "Hello World from API"
    })
})

router.post("/login", login);
router.post("/register", register);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/upload-image", uploadImage);

module.exports = router;
