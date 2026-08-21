export type DataSourceSyncStatus = 'SYNCED' | 'SYNCING' | 'ERROR' | 'IDLE';

export interface DataSourceRecord {
  id: string;
  sourceName: string;
  sourceUrl: string;
  datasetName: string;
  description: string;
  categories: string[];
  coverage: string;
  recordCount: number;
  license?: string;
  retrievedAt: string;
  lastUpdated: string;
  syncStatus: DataSourceSyncStatus;
  lastSyncMessage?: string;
}

export interface SyncDataSourceResult {
  id: string;
  datasetName: string;
  recordsSynced: number;
  syncStatus: DataSourceSyncStatus;
  timestamp: string;
  message: string;
}
