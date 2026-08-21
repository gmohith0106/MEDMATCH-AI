export interface ActivityRecord {
  id: string;
  hospitalId: string;
  userId: string;
  runId?: string;
  type: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  runId?: string;
}
