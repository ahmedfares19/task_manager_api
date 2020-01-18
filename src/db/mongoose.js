//requiring the mongoose module 
const mongoose = require('mongoose');
//setup the connection between the app and database server
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true
})