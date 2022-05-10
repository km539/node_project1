const {
    Pool
} = require('pg');

//connect to PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: 'postgres',
    port: 5432
});

pool.connect((err) => {
    if (err) throw err;
    console.log('Database is connected successfully !');
});

module.exports = pool;