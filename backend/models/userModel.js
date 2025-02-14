const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { 
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum : ['admin', 'cashier', 'customer'],
    default: 'customer', },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
