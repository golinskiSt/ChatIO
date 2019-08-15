const mongoose = require('../connection')
const Joi = require('Joi');
const Schema = mongoose.Schema

const UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: { type: String, trim: true, unique: true, required: true, minlength: 5, maxlength: 50 },
  email: { type: String, trim: true, unique: true, required: true, minlength: 5, maxlength: 255 },
  password: { type: String, required: true, minlength: 5, maxlength: 1024 },
  comments: [{ body: String, date: Date }],
  joinDate: { type: Date, default: Date.now },
  descripton: String
})

function validateUser(user){
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  }
  return Joi.validate(user, schema);
}
const User = mongoose.model('User', UserSchema)

exports.User = User;
exports.validate = validateUser;