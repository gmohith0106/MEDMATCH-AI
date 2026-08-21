import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';

// Route imports
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import hospitalRoutes from './routes/hospital.routes';
import inventoryRoutes from './routes/inventory.routes';
import forecastRoutes from './routes/forecast.routes';
import supplierRoutes from './routes/supplier.routes';
import agentRoutes from './routes/agent.routes';
import recommendationRoutes from './routes/recommendation.routes';
import procurementRoutes from './routes/procurement.routes';
import paymentRoutes from './routes/payment.routes';
import activityRoutes from './routes/activity.routes';
import notificationRoutes from './routes/notification.routes';
import researchRoutes from './routes/research.routes';
import dataSourceRoutes from './routes/data-sources.routes';

import paidServiceRoutes from './routes/paid-service.routes';
import staffRoutes from './routes/staff.routes';

export function createApp(): Application {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'];
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive origin fallback for development proxies
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'PAYMENT-SIGNATURE',
        'PAYMENT-REQUIRED',
        'PAYMENT-RESPONSE',
        'X-PAYMENT'
      ],
      exposedHeaders: [
        'PAYMENT-REQUIRED',
        'PAYMENT-SIGNATURE',
        'PAYMENT-RESPONSE',
        'X-PAYMENT'
      ]
    })
  );

  // Request body parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // HTTP request logging (disable in test environment)
  if (env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
  }

  // Mount API routes
  app.use('/', healthRoutes);
  app.use('/api', healthRoutes);
  app.use('/api', authRoutes);
  app.use('/api', hospitalRoutes);
  app.use('/api', inventoryRoutes);
  app.use('/api', forecastRoutes);
  app.use('/api', supplierRoutes);
  app.use('/api', agentRoutes);
  app.use('/api', recommendationRoutes);
  app.use('/api', procurementRoutes);
  app.use('/api', paymentRoutes);
  app.use('/api', paidServiceRoutes);
  app.use('/api', activityRoutes);
  app.use('/api', notificationRoutes);
  app.use('/api', researchRoutes);
  app.use('/api/data-sources', dataSourceRoutes);
  app.use('/api/staff', staffRoutes);


  // 404 Route handler
  app.use(notFoundHandler);

  // Central error handling middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
