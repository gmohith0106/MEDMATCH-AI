import { Router } from 'express';
import { DataSourceController } from '../controllers/data-source.controller';

const router = Router();
const controller = new DataSourceController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/:id/sync', controller.sync);

export default router;
