const { format } = require('date-fns');
import { v4 as uuid } from 'uuid';
import fs from 'fs';
const fsPromises = require('fs').promises;
import path from 'path';

const logEvents = async (message: string) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, 'logs'));
    }
    await fsPromises.appendFile(
      path.join(__dirname, 'logs', 'eventLog.txt'),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};
console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'));

console.log(uuid());

module.exports = logEvents;
