const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/auth");
const { nanoid } = require("nanoid");
const cloudinary = require("cloudinary");


// cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
// sendgrid
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.register = async (req, res) => {
    console.log("Signup Hit");
    try {
        // validation
        const { username, name, email, password, profile_photo } = req.body;
        if (!username) {
            return res.json({
                error: "Username is required",
            });
        }
        if (!name) {
            return res.json({
                error: "Name is required",
            });
        }
        if (!email) {
            return res.json({
                error: "Email is required",
            });
        }
        if (!password) {
            return res.json({
                error: "Password is required",
            });
        }
        const existUsername = await User.findOne({ username });
        if (existUsername) {
            return res.json({
                error: "Username is taken",
            });
        }
        // const existEmail = await User.findOne({ email });
        // if (existEmail) {
        //     return res.json({
        //         error: "Email is taken",
        //     });
        // }
        console.log("path:",profile_photo)

        let result
        if (profile_photo) {
            result = await cloudinary.uploader.upload(profile_photo, {
                public_id: nanoid(),
                resource_type: "image",
            });
        }
        console.log("result: ", result?.public_id)

        // hash password
        const hashedPassword = await hashPassword(password);
        try {
            const user = await new User({
                username,
                name,
                email,
                password: hashedPassword,
                profile_photo: {
                    public_id: result?.public_id || "",
                    url: result?.secure_url || ""},
            }).save();
            // create signed token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
              console.log(user);
            const { password, ...rest } = user.toJSON();
            return res.json({
                token,
                user: rest,
            });
        } catch (err) {
            console.log(err);
            return err
        }
    } catch (err) {
        console.log(err);
        return false
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // check if our db has user with that username
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({
                error: "No user found",
            });
        }
        // check password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.json({
                error: "Wrong password",
            });
        }
        // create signed token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        user.password = undefined;
        user.secret = undefined;
        res.json({
            token,
            user,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    // find user by email
    const user = await User.findOne({ email });
    console.log("USER ===> ", user);
    if (!user) {
        return res.json({ error: "No user found" });
    }
    // generate code
    const resetCode = nanoid(5).toUpperCase();
    // save to db
    user.resetCode = resetCode;
    user.save();
    // prepare email
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password reset code",
        html: `<h1>Your password  reset code is: ${resetCode}</h1>`
    };
    // send email
    try {
        const data = await sgMail.send(emailData);
        console.log(data);
        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.json({ ok: false });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { username, oldPassword, newPassword, confirmNewPassword } = req.body;
        if (!username || !oldPassword || !newPassword || !confirmNewPassword) {
            return res.json({ error: "Please fill in all fields" });
        }
        // find user based on email and resetCode
        const user = await User.findOne({username});
        // if user not found
        if (!user) {
            return res.json({ error: "Username not found" });
        }
        // if old password is valid
        const match = await comparePassword(oldPassword, user.password);
        if (!match) {
            return res.json({error: "Wrong old password"});
        }
        // if new password is valid
        if (oldPassword === newPassword) {
            return res.json({ error: "New password is the same as the old one" });
        }
        // if new password is matched
        if (newPassword !== confirmNewPassword) {
            return res.json({ error: "Passwords not matched"});
        }
        // // if password is short
        // if (!newPassword || newPassword.length < 6) {
        //     return res.json({
        //         error: "Password is required and should be 6 characters long",
        //     });
        // }
        // hash password
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        user.resetCode = "";
        user.save();
        return res.json({ ok: true });
    } catch (err) {
        console.log(err);
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.body.profile_photo, {
            public_id: nanoid(),
            resource_type: "image"
        })
        console.log(req.body.profile_photo)
        console.log(req.body.user);
        const user = await User.findByIdAndUpdate(req.body.user._id,{
            profile_photo: {
                public_id: result.public_id,
                url: result.secure_url
            }
        }, { new: true });

        return res.json({
            username: user.username,
            name: user.name,
            email: user.email,
            password: user.password,
            profile_photo: user.profile_photo,
            dogConfirmed: user.dogConfirmed,
            dogNotConfirmed:user.dogNotConfirmed
        })
    } catch (error) {
        console.log(error)
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const { password } = req.body;
        console.log(req.body.user.user._id)
        if (password && password.length < 6) {
            return res.json({
                error: "Password is required and should be min 6 characters long",
            });
        } else {
            // update db
            const hashedPassword = await hashPassword(password);
            const user = await User.findByIdAndUpdate(req.body.user.user._id, {
                password: hashedPassword,
            });
            user.password = undefined;
            user.secret = undefined;
            return res.json(user);
        }
    } catch (err) {
        console.log(err);
    }
};
