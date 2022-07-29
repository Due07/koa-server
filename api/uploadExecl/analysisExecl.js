// 解析传递execl
const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');
const { resolve } = require('path');
const absolutePath = path.resolve(__dirname, '../../upload');

// 从读取的文件写入另一个文件
const readPipSteam = (readFile, writeFile) => {
    return new Promise((resolve) => {
        // pipe 管道写入 读取readFile 内容 并将writeFile写入
        let stream = readFile.pipe(writeFile);
        stream.on('finish', (error) => {
            resolve(error);
        });
    });
}

// 生成html代码化格式
const createExeclHtml = async (workSheet) => {
    const html = xlsx.utils.sheet_to_html(workSheet);
    // console.log(html);
    const htmlPath = `${+new Date()}.html`;

    // 读取可读文件
    // const htmlReadFile = fs.createReadStream(`${absolutePath}/${htmlPath}`);

    // 流形式读取里面的内容
    // htmlReadFile.on('data', (data) => {
    //     console.log(data);
    // });
    await new Promise(resolve => {
        // 创建可写文件
        const htmlWriterFile = fs.createWriteStream(`${absolutePath}/${htmlPath}`);

        htmlWriterFile.write(html);

        // 读取完毕需要手动结束，下面finish才能监听到
        htmlWriterFile.end();

        htmlWriterFile.on('finish', (error) => {
            if (error) {
                console.warn(error, '失败');
            } else {
                console.log('ok');
                resolve();
                // resolve(`/upload/${htmlPath}`);
            }
        });
    });

    return `upload/${htmlPath}`;
}


module.exports = async (file) => {
    // 获取后缀
    const [name, ext] = file.originalFilename.split('.');
    // 读取可读传递file文件
    const readFile = fs.createReadStream(file.filepath);
    // console.log(readFile);

    const filePath = `${absolutePath}/${name}${~~(Math.random() * 100000)}.${ext}`;
    // 创建可写文件
    const writeFile = fs.createWriteStream(filePath);
    // console.log(writeFile);
    // 数据写入文件
    const fileType = await readPipSteam(readFile, writeFile);
    // console.log(fileType);

    if (!fileType) {
        const dataArr = [];
        // execl路径
        let url;
        // execl解析文件 -> 返回数据
        const work = xlsx.readFile(filePath);
        // console.log(work);

        // 有多少张表
        const sheetName = work.SheetNames;
        await Promise.all(
            sheetName.map((item, index) => {
                // 读取 Sheets 下的每行数据
                const workSheet = work.Sheets[item];
                // 表里的数据转成JSON
                const data = xlsx.utils.sheet_to_json(workSheet);

                dataArr.push(data);
                // 只生成第一张表
                if (index === 0) return createExeclHtml(workSheet);
            }),
        ).then((res) => url = res[0]);

        return {
            data: dataArr,
            url,
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