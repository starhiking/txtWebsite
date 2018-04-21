var fs = require('fs');
var getList = require('../module/searchfiction');
var getContent = require('../module/searchcontent');
var getFictionMes = require("../module/spiderFiction")
var getNameById = require('../module/getNameById');
var refreshDb = require('../module/refreshDb');
var dbOperation = require('../module/jsonOperation');

module.exports = (app) => {
  app.get('/', (req, res) => {
    var dataBase = JSON.parse (fs.readFileSync(process.cwd() + '/module/db.json'));
    dataBase = refreshDb(dataBase);
    res.render('home', {
      data: dataBase
    });
  });

  // /directory?fid=1; 目录页面
  app.get('/directory', (req, res) => {
    var fid = req.query.fid;
    var fictionName = getNameById(fid);
    var fictionList = getList(fid);
    var data = {
      list: fictionList,
      fid: fid,
      ftitle: fictionName //小说名字
    }
    res.render('list', data);
  });


  // /content?fid=number&section=number  
  app.get('/content', (req, res) => {

    var queryResult = req.query;
    var fid = queryResult.fid; //小说序号
    var section = queryResult.section; //章节序号
    var titleName = getNameById(fid);
    
    var backresult = getContent(fid, section);
    if (backresult.isExist == false) {
      res.redirect('/directory?fid=' + fid);
    } else {
      backresult.ftitle = titleName;
      res.render('content', backresult);
    }

  });

  // delete?fid=4
  app.get('/delete',(req,res)=>{
    var fid = req.query.fid;
    dbOperation.delete(fid);
    res.redirect('/');
  });

  app.get('/add',(req,res)=>{
    var url = req.query.url;
    dbOperation.add(url);
    res.redirect('/');
    
  })


}


