var fs = require('fs');
var request = require("request");
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var Path = process.cwd() + '/bookData/';

async function getSinglePage(page,id) {


    var options = {
        url:page.url,
        gzip:'true',
        encoding : null,
        headers:{
            'Host': 'www.biquge5200.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
        }
    }

    request(options, async function (err,res,body) {
        if(err)
        {
            console.log(error);
            return false;
        }

        var transbody = iconv.decode(body, 'GBK');
        var $ = cheerio.load(transbody);
        var content = JSON.stringify($("#content").text());
        
        fs.writeFile(Path+ id+'/' +page.title+'.json',content,{flag:'w',encoding:'utf-8'},function (err) {
            if(err)
                console.log(err);
            else    
                console.log(page.title+" 保存成功");
        });

    })

}

module.exports = getSinglePage;

//测试数据
//var url = 'http://www.biquge5200.com/42_42714/151062611.html';
    
//var testpage = {
//     url :url,
//     title:"哈哈哈"
// }

//getSinglePage(testpage)