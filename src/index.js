//requiring the express module
const express = require('express');
const app = express();
//this will execute the creation of the database
require('./db/mongoose');
//the creation of the collections and it's rules 
const Users = require('./models/users')
const Tasks = require('./models/tasks')
//handel the route objects for each request 
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');
//setting the routes into the main app object
app.use(express.json())
app.use(userRouter);
app.use(taskRouter);


//application settings and configurtion
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is running on port " + port);
})
