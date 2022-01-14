/*
DB_CONNECTION=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=jimahpay_backend
DB_USERNAME=postgres_jimahpay_user
DB_PASSWORD=jDAJktTPl61m3h3T

*/

const { Pool } = require('pg')
const pool = new Pool({
  user: 'ksup_admin_user',
  host: '::',
  database: 'ksupporters_db',
  password: 'rhXQnkeBw6zz363W',
  port: 5432,
})
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res) 
  pool.end() 
})
