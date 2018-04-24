var fs = require('fs');
var Path = process.cwd() + '/module/db.json';
var addMes = require('./getAllMesFromSpider');
var startSpider = require('./startSpider');

//将object写入文件 ---> db操作之后重写文件操作
function write(db) {
    fs.writeFileSync(Path, JSON.stringify(db));
}

//删除小说
function deleteFiction(fid) {
    //修改fid 的状态
    var dataBase = JSON.parse(fs.readFileSync(Path));
    for (var i = 0; i < dataBase.length; i++) {
        if (dataBase[i].fid == fid) {
            dataBase[i].status = 0;
            write(dataBase);
            break;
        }
    }
}


//新增小说
function addFiction(url) {
    //先判断是否已经存在这个url
    //如果status为1 则不变
    //如果status为0 修改状态
    //如果不存在,新增一个
    var dataBase = JSON.parse(fs.readFileSync(Path));
    var isExist = false;

    for (var i = 0; i < dataBase.length; i++) {
        if (dataBase[i].titleUrl == url) {
            isExist = true;
            dataBase[i].status = 1;
            break;
        }
    }
    
    if (!isExist) {
        //先加入数据库
        addMes(url,dataBase);

    } 
}

function updateFiction(fid){
    
    var dataBase = JSON.parse(fs.readFileSync(Path));
    for (var i = 0; i < dataBase.length; i++) {
        if (dataBase[i].fid == fid) {
            startSpider(dataBase[i]);
            break;
        }
    }   
}


module.exports = {
    add: addFiction,
    delete: deleteFiction,
    update:updateFiction

}   