var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: String,
    password: String,
    tags: [{type: mongoose.Schema.Types.ObjectId, ref:'Tag'}]
});
module.exports = mongoose.model('User', UserSchema);