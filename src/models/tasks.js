const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    describtion: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    //the relation between the task and the user
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Users'
    }
})


const Tasks = mongoose.model('Tasks', taskSchema);

module.exports = Tasks;