var fs = require('fs');

function findNum(fid)
{
    var Path = process.cwd() + '/bookData/' + fid;
//    var Path = '../bookData/8';
    var files = fs.readdirSync(Path);

    return files.length;    
}

module.exports = findNum;