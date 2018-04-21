var fs = require('fs');

function getCorrect(filenames, number) {
    for (var i = 0; i < filenames.length; i++) {
        if (parseInt(number) == parseInt(filenames[i])) {
            return filenames[i];
        }
    }
    return false;
}

function findContent(fid, section) {
    var dir = process.cwd() + '/bookData/' + fid;
    //var dir = '../bookData/'+fid;
    let files = fs.readdirSync(dir);
    var ctitle = getCorrect(files, section);
    if (ctitle) {
        //console.log(ctitle);
        dir += '/' + ctitle;
    } else {
        return {
            isExist: false
        };
    }

    var data = fs.readFileSync(dir, 'utf-8');

    return {
        content: data.split('　　'),
        fid: fid,
        section: section,
        ctitle: ctitle.replace(section, '').replace('.json', '')
    }
}

module.exports = findContent;

//console.log(findContent('我的姐姐是大明星','17'))