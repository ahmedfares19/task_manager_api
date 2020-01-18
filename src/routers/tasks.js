const express = require('express');
const Tasks = require('../models/tasks');
const auth = require('../middleware/auth')
const router = express.Router()



/* Tasks */
// desc , completed
router.post('/tasks', auth,async (req, res) => {
    //const task = new Tasks(req.body);
    const task = new Tasks({
        ...req.body,
        owner:req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err);
    }


    // task.save().then((task) => {
    //     res.status(201).send(task)
    // }).catch((err) => {
    //     res.status(400).send(err);
    // })
});
//get all tasks
router.get('/tasks', auth,async (req, res) => {

    try {
        // const tasks = await Tasks.find({owner:req.user._id});
        await req.user.populate('tasks').execPopulate();
        if (!req.user.tasks) {
            return res.status(404).send()
        }
        res.send(req.user.tasks);
    } catch (err) {
        res.status(500).send(err)
    }
})




//get one task by id
router.get('/tasks/:id', auth,async (req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Tasks.findById(_id)
        const task = await Tasks.findById({_id , owner:req.user._id})
        if (!task) {
            return res.status(404).send();
        }
        res.send(task)
    } catch (err) {
        res.status(500).send();
    }
})

//remove task by id
router.delete('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id;
    console.log('from delete')
    try {
        await Tasks.findOneAndDelete({_id , owner:req.user._id})
        // await Tasks.findByIdAndDelete(_id);
        const count = await Tasks.countDocuments({
            completed: false
        });
        res.send(count);
    } catch (err) {
        res.status(404).send(err);
    }
});

// updating task desc completed

router.patch('/tasks/:id', auth,async (req, res) => {
    const _id = req.params.id;
    const _body = req.body;
    const _allowedProperties = ['describtion', 'completed'];
    const bodyKeys = Object.keys(_body);
    const isValid = bodyKeys.every((key) => _allowedProperties.includes(key))
    if (!isValid) {
        return res.status(400).send({
            'error': 'invaild updates'
        })
    }
    try {
        const task = await Tasks.findOne({_id , owner:req.user._id})
        // const task = await Tasks.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        bodyKeys.forEach(update => task[update] = _body[update])
        await task.save()
        res.send(task)
    } catch (err) {
        return res.status(500).send();
    }
})
/* 
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Tasks.findByIdAndDelete(_id)
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (err) {
        res.status(500).send()
    }
}) */

module.exports = router;