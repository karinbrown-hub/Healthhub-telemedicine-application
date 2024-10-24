const { exec } = require('child_process');
const path = require('path');

const DB_NAME = process.env.DB_NAME;
const BACKUP_PATH = path.join(__dirname, '../backups');

const backupCommand = `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${DB_NAME} > ${BACKUP_PATH}/${DB_NAME}_${Date.now()}.sql`;

exec(backupCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backup error: ${error}`);
    return;
  }
  console.log('Database backup completed successfully');
});

