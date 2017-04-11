var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


/* User schema attributes */
var UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,

  profile: {
    name: { type: String, default: '' },
    picture: { type: String, default: '' }
  },

  address: String,
  history: [{
    date: Date,
    paid: { type: Number, default: 0 },
    // item: { type: Schema.Types.ObjectId, ref: '' }
  }]
});

/* Hash Password */

UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});


/* compare Password in DB vs the one the user types in */

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
