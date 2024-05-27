// mongodb+srv://anuraggupta199418:tulsi1234@cluster0.24mvzvx.mongodb.net/

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const port = 8000;
app.use(express.json());
app.use(cors());
const keySecret = "1234";
// const clientId =
//   "43990325827-4v7rp5ce0kf6qq4i2h6i0b07992lehae.apps.googleusercontent.com";
// const clientSecret = "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";

// mongodb url to connect data base

var mongoURL =
  "mongodb+srv://anuraggupta199418:tulsi1234@cluster0.24mvzvx.mongodb.net/hotel-room";
mongoose.connect(mongoURL);

// userSchema

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp:{
    type: String,
    required : false
  }
});
const user = mongoose.model("newuser", userSchema);

// signup method
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await user.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "user already register" });
    }
    const hashPass = await bcrypt.hash(password, 10);
    const otp = Math.floor(1000 * Math.random()*8000).toString();
    const newUser = new user({ email, password: hashPass, otp });
    await newUser.save();
    res.status(200).json({ message: "user created succsffully",otp });
  } catch (e) {
    console.log("Error while create an user");
    res.status(500).json({ message: "Internal server issues" });
  }
});

// signin method
app.post("/signin", async (req, res) => {
  try {
    const { email, password,otp } = req.body;
    const userExistlogin = await user.findOne({ email });
    if (!userExistlogin) {
      return res.status(401).json({ message: "Invalid email address" });
    }
    const IsPasswordCorrect = await bcrypt.compare(
      password,
      userExistlogin.password
    );
    if (!IsPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Incorrect password provide correct password" });
    }
    if(otp !== userExistlogin.otp){
        return res
        .status(401)
        .json({ message: "Incorrect otp" });
    }
    const token = jwt.sign({ email: userExistlogin.email }, keySecret, {
      expiresIn: "1h",
    });
    res.json({token});
  } catch (e) {
    console.log("Error while loggin");
    res.status(500).json({ message: "Internal serverl error" });
  }
});
// mongoose.connect();
app.listen(port, () => {
  console.log(`running at port ${port}`);
});
