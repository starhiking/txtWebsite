var getFiction = require('./spiderFiction');
var dataBase = {};
var fs = require('fs');
var Path = process.cwd() + '/module/db.json';
var spiderFiction = require('./startSpider');
var updateNum = require('./updateNum');

function getFictionRes(err, result) {

    if (err) {
        throw err;
    } else {
        result.status = 1;
        result.fid = dataBase.length + 1;
        dataBase.push(result);
        fs.writeFileSync(Path, JSON.stringify(dataBase));//写入数据库
        fs.mkdir(process.cwd() + '/bookData/' + result.fid, 0777, function (err) {
            if (err) {
                console.log(err);
                console.log("创建" + result.fid + "目录失败");
            } else {
                console.log("创建" + result.fid + "目录成功");
            }
        })
        //开始爬虫
        var data = dataBase[dataBase.length-1];
        spiderFiction(data);

    }

}

function getRes(url, db) {
    dataBase = db;
    getFiction(url, getFictionRes);
}

module.exports = getRes;