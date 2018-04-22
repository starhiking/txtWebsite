var fs = require('fs')
var request = require("request");
var iconv = require('iconv-lite');

var cheerio = require('cheerio');
var getSinglePage = require('./spiderContent');
var getNum = require('./findNum');


var header = {
    'Host': 'www.biquge5200.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
}



module.exports = function getFiction(data) {
    
    var url = data.titleUrl;
    var id = data.fid;
    var record = getNum(id);
    var pages = new Array; //用来存放每个详细页面链接


    var options = {
        url: url,
        gzip: 'true',
        encoding: null,
        headers: header
    }


    request(options, function (error, response, body) {

        if (error) {
            console.log(error);
            return false;
        }

        var transbody = iconv.decode(body, 'GBK');
        var $ = cheerio.load(transbody);

        var links = $("dd>a");

        fs.mkdir(process.cwd() + '/bookData/' + data.fid, 0777, function (err) {
            if (err) {
                console.log(err);
                console.log("创建" + data.fid + "目录失败");
            } else {
                console.log("创建" + data.fid + "目录成功");
            }
        })

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
        console.log(pages.length);
        getPage(); //递归生成文件

    });
    
    
    function getPage() { //再封装下singlepage 用于递归
        
        if (record >= pages.length)
        {
            console.log("id为%d的小说下载完毕",id);
            return true;
        }
            
        pages[record].title = '' + record + pages[record].title;
        getSinglePage(pages[record++], id);
        setTimeout(getPage, 1000);
    }



};    


//去除特殊字符
function stripscript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}