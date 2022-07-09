const multer = require('@koa/multer'); // 图片上传的插件

const storage = multer.diskStorage({
    // 文件保存路径
    destination: function (req, file, cb) {
        cb(null, './upload');
    },
    filename: function (req, file, cb) {
        // 上传文件名称
        const fileFormat = (file.originalname).split('.')
        // 时间戳名称
        cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
    }
})
const limits = {
    files: 1, // 单次上传数量
    fileSize: 1024 * 1024 * 3, // 文件大小
}
module.exports = multer({ storage, limits });