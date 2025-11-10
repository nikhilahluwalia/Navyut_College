import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const sqlConnection = mysql.createConnection({ 
    host : process.env.HOSTNAME ,
    user : process.env.DB_USER , 
    password : process.env.DB_PASSWORD ,
    database : process.env.DB_NAME ,
    multipleStatements : true
});



export default sqlConnection;

