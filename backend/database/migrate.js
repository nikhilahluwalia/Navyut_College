import sqlConnection from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigration = () => {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    sqlConnection.connect((err) => {
        if (err) {
            console.error('Database connection failed:', err);
            process.exit(1);
        }

        console.log('Database connected successfully');

        sqlConnection.query(schema, (error, results) => {
            if (error) {
                console.error('Migration failed:', error);
                sqlConnection.end();
                process.exit(1);
            }

            console.log('✓ Migration completed successfully');
            console.log('✓ Tables created:');
            console.log('  - users');
            console.log('  - sessions');
            console.log('  - password_reset_tokens');
            
            sqlConnection.end();
            process.exit(0);
        });
    });
};

runMigration();
