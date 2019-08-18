const mongoose = require("../connection");
const Joi = require("Joi");
const _ = require('lodash');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 5, 
    maxlength: 1024 
  },
  comments: [
    { 
      body: String, 
      date: Date }
  ],
  joinDate: { 
    type: Date, 
    default: Date.now 
  },
  descripton: String,
  tokens: [{
    token: {
        type: String,
        required: true
    }
  }]
});

UserSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 10);
  }
  next();
})

UserSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this
  const token = jwt.sign(
    {
      _id: user._id,
      time: Date.now()
    },
     process.env.JWT_KEY
  );
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  console.log(email, password);
  const user = await User.findOne({email: email});
  if (!user) {
      throw new Error('Invalid login credentials');
  }
  const isPasswordCorrect = bcrypt.compare(password, user.password);
  if(isPasswordCorrect) {
    return user;
  } else {
    throw new Error('Invalid login credentials');
  }
}

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}
const User = mongoose.model("User", UserSchema);

exports.User = User;
exports.validate = validateUser;
