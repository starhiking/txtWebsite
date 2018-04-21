var fs = require('fs');

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

//fid  小说在数据库中的id
function findSync(fid) {

    fid = process.cwd() + '/bookData/' + fid;
    let result = new Array();
    let files = fs.readdirSync(fid);
    for(var i =0 ;i<files.length;i++){
        var tempvals = files[i].split('.');
        var resIndex = parseInt(tempvals[0]); 
        var title = tempvals[0].replace(resIndex, "");
        if (tempvals[1] == 'json') {
            result[resIndex] = title;
        }

    }
    // files.forEach((val, index) => {

    //     var tempvals = val.split('.');
    //     var resIndex = parseInt(tempvals[0]);
    //     var title = tempvals[0].replace(resIndex, "");

    //     if (tempvals[1] == 'json') {
    //         result.insert(resIndex, title);
    //     }

    // });
    return result;

}

module.exports = findSync;

//let fileNames=findSync('../bookData/我的姐姐是大明星');
//console.log(fileNames);