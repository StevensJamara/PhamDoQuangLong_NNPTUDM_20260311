var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// Yêu cầu 1: Lấy danh sách users (có query includes theo username)
router.get('/', async function (req, res, next) {
    try {
        let condition = { isDeleted: false };
        
        // Nếu có truyền query username trên URL (?username=abc)
        if (req.query.username) {
            // Sử dụng RegExp để tìm kiếm dạng 'includes' (chứa chuỗi), 'i' là không phân biệt hoa thường
            condition.username = new RegExp(req.query.username, 'i');
        }

        let data = await userModel.find(condition).populate('role', 'name');
        res.send(data);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        let result = await userModel.findOne({ _id: req.params.id, isDeleted: false }).populate('role', 'name');
        if (result) {
            res.send(result);
        } else {
            res.status(404).send("User không tồn tại hoặc đã bị xoá");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/', async function (req, res, next) {
    try {
        let newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let result = await userModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Xoá mềm (Soft delete) cho User
router.delete('/:id', async function (req, res, next) {
    try {
        let result = await userModel.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Yêu cầu 2: Hàm Enable status -> true
router.post('/enable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        
        // Tìm và update nếu đúng email và username
        let result = await userModel.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (result) {
            res.send({ message: "Kích hoạt thành công", user: result });
        } else {
            res.status(404).send({ message: "Sai thông tin Email hoặc Username!" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Yêu cầu 3: Hàm Disable status -> false
router.post('/disable', async function (req, res, next) {
    try {
        let { email, username } = req.body;
        
        // Tìm và update nếu đúng email và username
        let result = await userModel.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (result) {
            res.send({ message: "Vô hiệu hoá thành công", user: result });
        } else {
            res.status(404).send({ message: "Sai thông tin Email hoặc Username!" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;