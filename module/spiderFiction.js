var fs = require('fs')
var request = require("request");
var iconv = require('iconv-lite');

var cheerio = require('cheerio');


module.exports = function getFiction(url, callback, res) {


    var header = {
        'Host': 'www.biquge5200.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
    }

    var pages = new Array(); //用来存放每个详细页面链接

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


        heading = $("#info>h1").text().replace(/\s+/g, '');
        fictionName = heading;
        lastUpdateTime = $("#info>p").eq(-1).text().split("：")[1];


        lastUpdateNum = 0;
        lastUpdateTitle = $("#list dd a").eq(0).text().replace(/\s+/g,"");
        

        fictionMes = {
            titleUrl: url,
            fictionName: fictionName,
            lastUpdateTime: lastUpdateTime,
            lastUpdateTitle: lastUpdateTitle
        }


        console.log(fictionMes);

        callback(error, fictionMes);

        if (res) res.send(fictionMes);

    });

};