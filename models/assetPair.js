const mongoose = require("mongoose")

const schema = mongoose.Schema({},{
    strict: false
})

module.exports = mongoose.model("AssestPairs", schema)