var fs = require('fs')
var request = require("request");
var iconv = require('iconv-lite');


module.exports = function getFiction(url,callback,res) {

    var cheerio = require('cheerio');
    var getSinglePage = require('./spiderContent');

    //var url = 'http://www.biquge5200.com/79_79883/';

    var header = {
        'Host': 'www.biquge5200.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
    }

    var pages = new Array(); //用来存放每个详细页面链接

    var record = 0; //用来记录递归保存文件的顺序

    var heading = ""; //文章标题  目录名称

    var options = {
        url: url,
        gzip: 'true',
        encoding: null,
        headers: header
    }

    var fictionName = "";
    var lastUpdateTime = "";
    var lastUpdateTitle = "";
    var lastUpdateNum = 0;

    var fictionMes = 0;

    request(options, function (error, response, body) {

        if (error) {
            console.log(error);
            return false;
        }

        var transbody = iconv.decode(body, 'GBK');
        var $ = cheerio.load(transbody);

        var links = $("dd>a");
        //创建小说目录
        heading = $("#info>h1").text().replace(/\s+/g, '');
        fictionName = heading;
        lastUpdateTime = $("#info>p").eq(-1).text().split("：")[1];

        /*
        fs.mkdir('bookData/' + heading, 0777, function (err) {
            if (err) {
                console.log(err);
                console.log("创建" + heading + "目录失败");
            } else {
                console.log("创建" + heading + "目录");
            }
        })*/

        for (var i = 0; i < links.length; ++i) {
            var temp = {};
            temp.url = links.eq(i).attr('href');
            temp.title = links.eq(i).text().replace(/\s+/g, ''); // 去空格
            temp.title = stripscript(temp.title); //去除特殊字符
            pages.push(temp);
        }

        //去重 最新章节重复了
        for (var i = 0; i < pages.length; ++i) {
            if (pages[0].url == pages[pages.length - i - 1].url)
                pages.splice(0, 1);
            else {
                break;
            }
        }

        lastUpdateNum = pages.length;
        lastUpdateTitle = pages[lastUpdateNum - 1].title;

           fictionMes =  {
                titleUrl:url,
                fictionName:fictionName,
                lastUpdateTime:lastUpdateTime,
                lastUpdateNum:lastUpdateNum,
                lastUpdateTitle:lastUpdateTitle
            }

       
        //console.log(fictionMes);

        callback(error,fictionMes);
            
        if(res) res.send(fictionMes);
        

        //章节数一般大于真正数量，因为有告读者的章节
        //return fictionMes;
        //暂时先不抓小说内容
        //getPage(); //递归生成文件

    });

};




function getPage() { //再封装下singlepage 用于递归
    if (record >= pages.length)
        return true;
    pages[record].title = '' + record + pages[record].title;
    getSinglePage(pages[record++], heading);
    setTimeout(getPage, 1000);
}

//去除特殊字符
function stripscript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}