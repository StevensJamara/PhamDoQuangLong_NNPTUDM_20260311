let mongoose = require('mongoose');

let roleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:[true, "Tên role đã tồn tại"]
    },
    description: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false // Phục vụ cho xoá mềm
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

module.exports = new mongoose.model('role', roleSchema);