const {
    Pool
} = require('pg');
const fs = require('fs');

//connect to PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'my_database',
    password: 'postgres',
    port: 5432
});

pool.connect((err) => {
    if (err) throw err;
    console.log('Database is connected successfully !');
    fs.readFile('./sql/create.sql', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        //console.log(data);
        pool.query(data, (err, res) => {
            if (err) {
                console.log(err.stack);
            }
        })
    });
});

module.exports = pool;