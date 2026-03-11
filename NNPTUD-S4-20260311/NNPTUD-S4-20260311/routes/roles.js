var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users'); // Import userModel để query user theo role

// Yêu cầu 1: CRUD cơ bản cho Role
router.get('/', async function (req, res, next) {
    let data = await roleModel.find({ isDeleted: false });
    res.send(data);
});

router.get('/:id', async function (req, res, next) {
    try {
        let result = await roleModel.findOne({ _id: req.params.id, isDeleted: false });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send("Role không tồn tại hoặc đã bị xoá");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/', async function (req, res, next) {
    try {
        let newRole = new roleModel(req.body);
        await newRole.save();
        res.status(201).send(newRole);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let result = await roleModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false }, 
            req.body, 
            { new: true }
        );
        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Xoá mềm (Soft delete)
router.delete('/:id', async function (req, res, next) {
    try {
        let result = await roleModel.findByIdAndUpdate(
            req.params.id, 
            { isDeleted: true }, 
            { new: true }
        );
        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Yêu cầu 4: Lấy tất cả user có role là id
router.get('/:id/users', async function (req, res, next) {
    try {
        let roleId = req.params.id;
        // Tìm tất cả user chưa bị xoá mềm và có role khớp với ID
        let users = await userModel.find({ 
            role: roleId, 
            isDeleted: false 
        }).populate('role', 'name description'); // Lấy thêm thông tin name, description của role
        
        res.send(users);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;