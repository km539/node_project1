const pool = require("./database");

function getData(para){
    return new Promise((resolve, reject) => {
        pool.query(para, (err, res) => {
            if (!err) {
                resolve(res.rows);
            }else {
                reject(err.stack);
            }
        })
    });
}

module.exports = {
    getData,
}