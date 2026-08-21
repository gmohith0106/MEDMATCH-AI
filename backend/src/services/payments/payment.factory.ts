import { PaymentService } from './payment.interface';
import { X402PaymentService } from './x402-payment.service';
import { logger } from '../../utils/logger';

let instance: PaymentService | null = null;

export class PaymentFactory {
  static getService(): PaymentService {
    if (instance) return instance;

    logger.info('[PaymentFactory] Initializing X402PaymentService (Algorand Smart Settlement)');
    instance = new X402PaymentService();
    return instance;
  }

  static resetInstance(): void {
    instance = null;
  }
}

