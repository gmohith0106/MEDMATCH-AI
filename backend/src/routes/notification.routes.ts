import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/notifications', optionalAuth, NotificationController.getNotifications);
router.patch('/notifications/:id/read', optionalAuth, NotificationController.markAsRead);
router.post('/notifications/read-all', optionalAuth, NotificationController.markAllAsRead);

router.get('/sms/status', optionalAuth, NotificationController.getSmsStatus);
router.post('/sms/send', optionalAuth, NotificationController.sendSms);

export default router;

