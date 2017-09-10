var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: String,
    password: String,
    tags: [{type: mongoose.Schema.Types.ObjectId, ref:'Tag'}],
    subscription:[{'endpoint':String,'p256dh':String,'auth':String}]
});
module.exports = mongoose.model('User', UserSchema);