var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TagsSchema = new Schema({
    name: String,
});
module.exports = mongoose.model('Tag', TagsSchema);