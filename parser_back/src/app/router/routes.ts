import { Router } from 'express';
import { getStatement, getStatements, uploadFile, uploadStatement } from '../controller/controller';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).send({ data: `App is working` });
});

router.post('/files', uploadFile);
router.get('/statements/:id', getStatement);

router.get('/statements', getStatements);

router.post('/statements', uploadStatement);

export { router };
