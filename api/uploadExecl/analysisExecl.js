// 解析传递execl
const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');
const absolutePath = path.resolve(__dirname, '../../upload');


module.exports = async (file) => {
    // 获取后缀
    const [name, ext] = file.originalFilename.split('.');
    // 读取传递file文件
    const readFile = fs.createReadStream(file.filepath);
    // console.log(readFile);

    const filePath = `${absolutePath}/${name}${~~(Math.random() * 100000)}.${ext}`;
    // 创建文件
    const writeFile = fs.createWriteStream(filePath);
    // console.log(writeFile);
    // 数据写入文件
    const fileType = await readPipSteam(readFile, writeFile);
    // console.log(fileType);

    if (!fileType) {
        const dataArr = [];
        // execl解析文件 -> 返回数据
        const work = xlsx.readFile(filePath);
        // console.log(work);

        // 有多少张表
        const sheetName = work.SheetNames;

        sheetName.forEach((item) => {
            // 读取 Sheets 下的每行数据
            const workSheet = work.Sheets[item];
            const data = xlsx.utils.sheet_to_json(workSheet);
            dataArr.push(data);
        })
        return {
            data: dataArr,
            message: '读取成功',
            status: 'success',
        };
    } else {
        return {
            message: '上传文件出错',
            status: 'error',
        };
    }
}

const readPipSteam = (readFile, writeFile) => {
    return new Promise((resolve) => {
        // pipe 管道写入
        let stream = readFile.pipe(writeFile);
        stream.on('finish', (error) => {
            resolve(error);
        });
    });
}