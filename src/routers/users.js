const express = require('express');
const router = express.Router()
const Users = require('../models/users');
const auth = require('../middleware/auth')




//login
router.post('/users/login', async (req, res) => {
    try {
        const user = await Users.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({
            user,
            token
        })
    } catch (err) {
        res.status(400).send(err);
    }
})
//logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        //return all the token that not equle to the sent token
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send()
    } catch (err) {
        res.status(500).send();
    }
})
//logoutAll
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send()
    } catch (err) {
        res.status(500).send();
    }
})





//create new user
router.post('/users', async (req, res) => {
    try {
        const user = new Users(req.body);
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({
            user,
            token
        })
    } catch (err) {
        res.status(400).send(err);
    }
});

// //get all users
router.get('/users/me', auth, async (req, res) => {
    //this user is from auth object which get the user by the token
    res.send(req.user);
})

// //get user by id
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;

//     try {
//         const user = await Users.findById(_id)
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (err) {
//         res.status(500).send(err);
//     }

// })


//deleteing user

router.delete('/users/me', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const user = await Users.findByIdAndDelete(req.user._id)
        await req.user.remove();
        res.status(200).send(req.user)
    } catch (err) {
        res.status(500).send()
    }
})



// updating users;
router.patch('/users/me', auth, async (req, res) => {
    const _id = req.user._id;
    const _body = req.body;
    const _allowedProperties = ['name', 'email', 'password', 'age'];
    const bodyKeys = Object.keys(_body);
    const isValid = bodyKeys.every((key) => _allowedProperties.includes(key))

    if (!isValid) {
        return res.status(400).send({
            'error': 'invaild updates'
        })
    }
    try {
        bodyKeys.forEach(update => req.user[update] = _body[update])
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        return res.status(500).send();
    }
})


module.exports = router;