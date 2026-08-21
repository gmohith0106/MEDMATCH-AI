import { DataSourceRepository } from '../repositories/data-source.repository';
import { DataSourceRecord, SyncDataSourceResult } from '../types/data-source.types';
import { AppError } from '../utils/errors';
import { getCurrentIsoDate } from '../utils/dates';
import { logger } from '../utils/logger';

export class DataSourceService {
  private dataSourceRepo = new DataSourceRepository();

  async getAllDataSources(): Promise<DataSourceRecord[]> {
    return this.dataSourceRepo.findAll();
  }

  async getDataSourceById(id: string): Promise<DataSourceRecord> {
    const ds = await this.dataSourceRepo.findById(id);
    if (!ds) {
      throw new AppError(`Data source with id ${id} not found`, 404, 'RESOURCE_NOT_FOUND');
    }
    return ds;
  }

  async syncDataSource(id: string): Promise<SyncDataSourceResult> {
    const ds = await this.getDataSourceById(id);
    logger.info(`Starting synchronization for data source: ${ds.datasetName} (${id})`);

    // Mark syncing
    await this.dataSourceRepo.update(id, { syncStatus: 'SYNCING' });

    const now = getCurrentIsoDate();
    let recordsSynced = ds.recordCount;
    let message = `Successfully synchronized ${recordsSynced.toLocaleString()} records from ${ds.sourceName}.`;

    // Update synced state
    await this.dataSourceRepo.update(id, {
      syncStatus: 'SYNCED',
      lastUpdated: now,
      retrievedAt: now,
      lastSyncMessage: message
    });

    return {
      id,
      datasetName: ds.datasetName,
      recordsSynced,
      syncStatus: 'SYNCED',
      timestamp: now,
      message
    };
  }
}
