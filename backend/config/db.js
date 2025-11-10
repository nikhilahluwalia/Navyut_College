import mysql from 'mysql2';

const sqlConnection = mysql.createConnection({ 
    host : "localhost",
    user : "root" , 
    password : "root",
    database : "navyut_colleges",
    multipleStatements : true
});



export default sqlConnection;

