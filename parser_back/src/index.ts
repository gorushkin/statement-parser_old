import { Express } from 'express';
import { checkFilesPath } from './helpers/until';
import { app } from './app';
import { logger } from './logger';
import { statements, rates } from './entities';
import { DB_PATH, PORT, TEMP_FILES_PATH } from './helpers/config';

const init = async (app: Express, tempFilesPath: string, port: number, dbPath: string) => {
  statements.init(dbPath);
  await rates.init(dbPath);
  await checkFilesPath(tempFilesPath);
  logger.info(`Temp files dir exist`);

  app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
  });
};

init(app, TEMP_FILES_PATH, PORT, DB_PATH);
