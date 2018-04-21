
function refresh(db)
{
    for(var i = 0;i<db.length;i++)
    {
        if(db[i].status == 0)
        {
            db.splice(i,1);
            i--;
        }
    }
    return db;
}

module.exports = refresh;