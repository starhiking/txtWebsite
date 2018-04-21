var fs = require('fs');

function getNameById(fid)
{
    var fictionName = ''
    var dataBase = JSON.parse(fs.readFileSync(process.cwd() + '/module/db.json'));
    for (var i = 0; i < dataBase.length; i++) {
      if (dataBase[i].fid == fid) {
        fictionName = dataBase[i].fictionName;
      }
    }
    return fictionName;
}

module.exports = getNameById;