import { rtdb, hasDatabaseCredentials } from '../config/firebase';
import {
  AgentEventRecord,
  AgentRunRecord,
  AgentStepRecord,
  ForecastRecord,
  ShortageRecord
} from '../types/agent.types';
import { MemoryStore } from './memory-store';
import { logger } from '../utils/logger';

export class AgentRepository {
  private runsRef = rtdb.ref('agentRuns');
  private stepsRef = rtdb.ref('agentSteps');
  private eventsRef = rtdb.ref('agentEvents');
  private forecastsRef = rtdb.ref('forecasts');
  private shortagesRef = rtdb.ref('shortages');
  private memStore = MemoryStore.getInstance();

  // Agent Runs
  async createRun(run: AgentRunRecord): Promise<AgentRunRecord> {
    if (hasDatabaseCredentials) {
      try {
        await this.runsRef.child(run.id).set(run);
      } catch (err) {
        logger.warn(`[AgentRepository] RTDB createRun error for ${run.id}`, err);
      }
    }
    this.memStore.agentRuns.set(run.id, run);
    return run;
  }

  async findRunById(runId: string): Promise<AgentRunRecord | null> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.runsRef.child(runId).once('value');
        if (snapshot.exists()) {
          return snapshot.val() as AgentRunRecord;
        }
      } catch (err) {
        logger.warn(`[AgentRepository] RTDB findRunById error for ${runId}`, err);
      }
    }
    return this.memStore.agentRuns.get(runId) || null;
  }

  async updateRun(runId: string, updates: Partial<AgentRunRecord>): Promise<AgentRunRecord | null> {
    const existing = await this.findRunById(runId);
    if (!existing) return null;

    const updated: AgentRunRecord = {
      ...existing,
      ...updates
    };

    if (hasDatabaseCredentials) {
      try {
        await this.runsRef.child(runId).update(updated);
      } catch (err) {
        logger.warn(`[AgentRepository] RTDB updateRun error for ${runId}`, err);
      }
    }

    this.memStore.agentRuns.set(runId, updated);
    return updated;
  }

  async findRunsByHospital(hospitalId: string): Promise<AgentRunRecord[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.runsRef.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: AgentRunRecord[] = Object.values(val);
          list.sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''));
          return list;
        }
      } catch (err) {
        logger.warn('[AgentRepository] RTDB findRuns error', err);
      }
    }
    const runs = Array.from(this.memStore.agentRuns.values()).filter(
      (r) => !r.hospitalId || r.hospitalId === hospitalId || r.hospitalId === 'hospital-citycare-001'
    );
    runs.sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''));
    return runs;
  }

  // Agent Steps
  async recordStep(step: AgentStepRecord): Promise<AgentStepRecord> {
    if (hasDatabaseCredentials) {
      try {
        await this.stepsRef.child(step.id).set(step);
      } catch (err) {
        logger.warn(`[AgentRepository] RTDB recordStep error for ${step.id}`, err);
      }
    }
    this.memStore.agentSteps.set(step.id, step);
    return step;
  }

  async saveStep(step: AgentStepRecord): Promise<AgentStepRecord> {
    return this.recordStep(step);
  }

  async findStepsByRun(runId: string): Promise<AgentStepRecord[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.stepsRef.orderByChild('runId').equalTo(runId).once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const steps: AgentStepRecord[] = Object.values(val);
          steps.sort((a, b) => a.stepNumber - b.stepNumber);
          return steps;
        }
      } catch (err) {
        logger.warn(`[AgentRepository] RTDB findSteps error for ${runId}`, err);
      }
    }
    const steps = Array.from(this.memStore.agentSteps.values()).filter((s) => s.runId === runId);
    steps.sort((a, b) => a.stepNumber - b.stepNumber);
    return steps;
  }

  // Agent Events
  async recordEvent(event: AgentEventRecord): Promise<AgentEventRecord> {
    if (hasDatabaseCredentials) {
      try {
        await this.eventsRef.child(event.id).set(event);
      } catch (err) {
        logger.warn(`[AgentRepository] RTDB recordEvent error for ${event.id}`, err);
      }
    }
    this.memStore.agentEvents.set(event.id, event);
    return event;
  }

  async createEvent(event: AgentEventRecord): Promise<AgentEventRecord> {
    return this.recordEvent(event);
  }

  async findEventsByRun(runId: string): Promise<AgentEventRecord[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.eventsRef.orderByChild('runId').equalTo(runId).once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const events: AgentEventRecord[] = Object.values(val);
          events.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
          return events;
        }
      } catch (err) {
        logger.warn(`[AgentRepository] RTDB findEvents error for ${runId}`, err);
      }
    }
    const events = Array.from(this.memStore.agentEvents.values()).filter((e) => e.runId === runId);
    events.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    return events;
  }

  // Forecasts
  async saveForecast(forecast: ForecastRecord): Promise<ForecastRecord> {
    if (hasDatabaseCredentials) {
      try {
        await this.forecastsRef.child(forecast.id).set(forecast);
      } catch (err) {
        logger.warn(`[AgentRepository] RTDB saveForecast error for ${forecast.id}`, err);
      }
    }
    return forecast;
  }

  async findForecasts(hospitalId: string, inventoryId?: string): Promise<ForecastRecord[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.forecastsRef.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          let list: ForecastRecord[] = Object.values(val);
          if (inventoryId) {
            list = list.filter((f) => f.inventoryId === inventoryId);
          }
          return list;
        }
      } catch (err) {
        logger.warn('[AgentRepository] RTDB findForecasts error', err);
      }
    }
    return [];
  }

  // Shortages
  async saveShortage(shortage: ShortageRecord): Promise<ShortageRecord> {
    if (hasDatabaseCredentials) {
      try {
        await this.shortagesRef.child(shortage.id).set(shortage);
      } catch (err) {
        logger.warn(`[AgentRepository] RTDB saveShortage error for ${shortage.id}`, err);
      }
    }
    return shortage;
  }

  async findShortages(hospitalId: string): Promise<ShortageRecord[]> {
    if (hasDatabaseCredentials) {
      try {
        const snapshot = await this.shortagesRef.once('value');
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list: ShortageRecord[] = Object.values(val);
          return list;
        }
      } catch (err) {
        logger.warn('[AgentRepository] RTDB findShortages error', err);
      }
    }
    return [];
  }
}
