import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const logEvents = async (message: string, logName: string = 'eventLog.txt') => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir);
    }
    await fsPromises.appendFile(path.join(logsDir, logName), logItem);
  } catch (error) {
    console.log(error);
  }
};
console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'));

console.log(uuid());

const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
  console.log(`${req.method} ${req.path}`);
  next();
};

export { logEvents, logger };
