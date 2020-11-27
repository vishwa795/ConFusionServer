const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Types.ObjectId,
        ref:'Dish'
    }]
},{
    timestamps:true
})

var Favorites = mongoose.model("Favorite",favoriteSchema);
module.exports = Favorites;