var getFiction = require('./spiderFiction');
var dataBase = {};
var fs = require('fs');
var Path = process.cwd() + '/module/db.json';

function getFictionRes(err, result) {

    if (err) {
        throw err;
    } else {
        result.havedNum = 0;
        result.lastViewTitle = "还未开始阅读";
        result.status = 1;
        result.fid = dataBase.length + 1;
        dataBase.push(result);
        fs.writeFileSync(Path, JSON.stringify(dataBase));
        //开始爬虫
        //...//
    }

}

function getRes(url, db) {
    dataBase = db;
    getFiction(url, getFictionRes);
}

module.exports = getRes;