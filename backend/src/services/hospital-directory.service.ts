import fs from 'fs';
import path from 'path';
import { HospitalRecord, HospitalDirectoryFilterQuery, HospitalDirectoryResponse } from '../types/hospital.types';
import { logger } from '../utils/logger';

/**
 * Robust RFC 4180 CSV parser
 */
function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // Skip CR
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Normalization helper:
 * Converts "0", "", null, undefined to "Not available" for general text fields.
 * Keeps numeric counts if valid.
 */
function normalizeText(val: string | undefined): string {
  if (!val) return 'Not available';
  const clean = val.trim();
  if (clean === '' || clean === '0' || clean === 'null' || clean === 'undefined' || clean === 'NA' || clean === 'N/A') {
    return 'Not available';
  }
  return clean;
}

function normalizeCount(val: string | undefined): string {
  if (!val) return 'Not available';
  const clean = val.trim();
  if (clean === '' || clean === 'null' || clean === 'undefined' || clean === 'NA') {
    return 'Not available';
  }
  const num = parseInt(clean, 10);
  if (isNaN(num)) return 'Not available';
  return num.toString();
}

export class HospitalDirectoryService {
  private static instance: HospitalDirectoryService;
  private hospitals: HospitalRecord[] = [];
  private hospitalMap: Map<string, HospitalRecord> = new Map();
  private uniqueStates: string[] = [];
  private uniqueCareTypes: string[] = [];
  private uniqueCategories: string[] = [];
  private uniqueDisciplines: string[] = [];
  private isLoaded = false;

  private constructor() {
    this.loadDataset();
  }

  public static getInstance(): HospitalDirectoryService {
    if (!HospitalDirectoryService.instance) {
      HospitalDirectoryService.instance = new HospitalDirectoryService();
    }
    return HospitalDirectoryService.instance;
  }

  private loadDataset(): void {
    try {
      const csvPath = path.resolve(__dirname, '../../data/hospital_directory.csv');
      if (!fs.existsSync(csvPath)) {
        logger.warn(`[HospitalDirectoryService] CSV file not found at ${csvPath}`);
        return;
      }

      const startTime = Date.now();
      const content = fs.readFileSync(csvPath, 'utf8');
      const rows = parseCsv(content);

      if (rows.length < 2) {
        logger.warn('[HospitalDirectoryService] CSV contains no data rows');
        return;
      }

      // Header row
      const headers = rows[0]!.map((h) => h.replace(/^["']|["']$/g, '').trim());
      const headerMap = new Map<string, number>();
      headers.forEach((h, idx) => headerMap.set(h, idx));

      const getCol = (row: string[], colName: string): string => {
        const idx = headerMap.get(colName);
        if (idx !== undefined && idx < row.length) {
          return row[idx] || '';
        }
        return '';
      };

      const statesSet = new Set<string>();
      const careTypesSet = new Set<string>();
      const categoriesSet = new Set<string>();
      const disciplinesSet = new Set<string>();

      const records: HospitalRecord[] = [];
      const map = new Map<string, HospitalRecord>();

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]!;
        const srNo = getCol(row, 'Sr_No') || i.toString();
        const id = `hosp-${srNo}`;
        const hospitalName = normalizeText(getCol(row, 'Hospital_Name'));
        const state = normalizeText(getCol(row, 'State'));
        const district = normalizeText(getCol(row, 'District'));
        const careType = normalizeText(getCol(row, 'Hospital_Care_Type'));
        const category = normalizeText(getCol(row, 'Hospital_Category'));
        const discipline = normalizeText(getCol(row, 'Discipline_Systems_of_Medicine'));

        if (state !== 'Not available') statesSet.add(state);
        if (careType !== 'Not available') careTypesSet.add(careType);
        if (category !== 'Not available') categoriesSet.add(category);
        if (discipline !== 'Not available') disciplinesSet.add(discipline);

        const record: HospitalRecord = {
          id,
          srNo,
          locationCoordinates: normalizeText(getCol(row, 'Location_Coordinates')),
          location: normalizeText(getCol(row, 'Location')),
          hospitalName,
          hospitalCategory: category,
          hospitalCareType: careType,
          discipline,
          address: normalizeText(getCol(row, 'Address_Original_First_Line')),
          state,
          district,
          subdistrict: normalizeText(getCol(row, 'Subdistrict')),
          pincode: normalizeText(getCol(row, 'Pincode')),
          telephone: normalizeText(getCol(row, 'Telephone')),
          mobileNumber: normalizeText(getCol(row, 'Mobile_Number')),
          emergencyNum: normalizeText(getCol(row, 'Emergency_Num')),
          ambulancePhoneNo: normalizeText(getCol(row, 'Ambulance_Phone_No')),
          bloodbankPhoneNo: normalizeText(getCol(row, 'Bloodbank_Phone_No')),
          foreignPcare: normalizeText(getCol(row, 'Foreign_pcare')),
          tollfree: normalizeText(getCol(row, 'Tollfree')),
          helpline: normalizeText(getCol(row, 'Helpline')),
          hospitalFax: normalizeText(getCol(row, 'Hospital_Fax')),
          primaryEmail: normalizeText(getCol(row, 'Hospital_Primary_Email_Id')),
          secondaryEmail: normalizeText(getCol(row, 'Hospital_Secondary_Email_Id')),
          website: normalizeText(getCol(row, 'Website')),
          specialties: normalizeText(getCol(row, 'Specialties')),
          facilities: normalizeText(getCol(row, 'Facilities')),
          accreditation: normalizeText(getCol(row, 'Accreditation')),
          registrationNumber: normalizeText(getCol(row, 'Hospital_Regis_Number')),
          registrationNumberScan: normalizeText(getCol(row, 'Registeration_Number_Scan')),
          nodalPersonInfo: normalizeText(getCol(row, 'Nodal_Person_Info')),
          nodalPersonTele: normalizeText(getCol(row, 'Nodal_Person_Tele')),
          nodalPersonEmail: normalizeText(getCol(row, 'Nodal_Person_Email_Id')),
          town: normalizeText(getCol(row, 'Town')),
          subtown: normalizeText(getCol(row, 'Subtown')),
          village: normalizeText(getCol(row, 'Village')),
          establishedYear: normalizeText(getCol(row, 'Establised_Year')),
          ayush: normalizeText(getCol(row, 'Ayush')),
          miscellaneousFacilities: normalizeText(getCol(row, 'Miscellaneous_Facilities')),
          numberDoctor: normalizeCount(getCol(row, 'Number_Doctor')),
          numMediconsultantOrExpert: normalizeCount(getCol(row, 'Num_Mediconsultant_or_Expert')),
          totalNumBeds: normalizeCount(getCol(row, 'Total_Num_Beds')),
          numberPrivateWards: normalizeCount(getCol(row, 'Number_Private_Wards')),
          numBedForEcoWeakerSec: normalizeCount(getCol(row, 'Num_Bed_for_Eco_Weaker_Sec')),
          empanelmentOrCollaborationWith: normalizeText(getCol(row, 'Empanelment_or_Collaboration_with')),
          emergencyServices: normalizeText(getCol(row, 'Emergency_Services')),
          tariffRange: normalizeText(getCol(row, 'Tariff_Range')),
          stateId: normalizeText(getCol(row, 'State_ID')),
          districtId: normalizeText(getCol(row, 'District_ID')),
          source: 'Hospital Directory Dataset',
          sourceLimitation: 'Administrative, facility, and capacity registry data. Does not establish real-time medicine inventory.',
          lastUpdated: 'National Open Healthcare Directory'
        };

        records.push(record);
        map.set(id, record);
        map.set(srNo, record);
      }

      this.hospitals = records;
      this.hospitalMap = map;
      this.uniqueStates = Array.from(statesSet).sort();
      this.uniqueCareTypes = Array.from(careTypesSet).sort();
      this.uniqueCategories = Array.from(categoriesSet).sort();
      this.uniqueDisciplines = Array.from(disciplinesSet).sort();
      this.isLoaded = true;

      const duration = Date.now() - startTime;
      logger.info(`[HospitalDirectoryService] Indexed ${this.hospitals.length} authoritative hospital records in ${duration}ms`);
    } catch (error) {
      logger.error('[HospitalDirectoryService] Failed to load hospital_directory.csv', error);
    }
  }

  public getFilters() {
    return {
      states: this.uniqueStates,
      careTypes: this.uniqueCareTypes,
      categories: this.uniqueCategories,
      disciplines: this.uniqueDisciplines
    };
  }

  public getHospitalById(id: string): HospitalRecord | null {
    if (!this.isLoaded) this.loadDataset();
    return this.hospitalMap.get(id) || null;
  }

  public queryHospitals(query: HospitalDirectoryFilterQuery): HospitalDirectoryResponse {
    if (!this.isLoaded) this.loadDataset();

    const search = (query.search || '').trim().toLowerCase();
    const state = (query.state || '').trim().toLowerCase();
    const district = (query.district || '').trim().toLowerCase();
    const town = (query.town || '').trim().toLowerCase();
    const careType = (query.careType || '').trim().toLowerCase();
    const category = (query.category || '').trim().toLowerCase();
    const discipline = (query.discipline || '').trim().toLowerCase();
    const emergencyServices = (query.emergencyServices || '').trim().toLowerCase();

    let filtered = this.hospitals.filter((h) => {
      if (search) {
        const matchName = h.hospitalName.toLowerCase().includes(search);
        const matchTown = h.town.toLowerCase().includes(search);
        const matchDistrict = h.district.toLowerCase().includes(search);
        const matchState = h.state.toLowerCase().includes(search);
        const matchPincode = h.pincode.toLowerCase().includes(search);
        if (!matchName && !matchTown && !matchDistrict && !matchState && !matchPincode) {
          return false;
        }
      }

      if (state && h.state.toLowerCase() !== state) return false;
      if (district && h.district.toLowerCase() !== district) return false;
      if (town && h.town.toLowerCase() !== town) return false;
      if (careType && h.hospitalCareType.toLowerCase() !== careType) return false;
      if (category && h.hospitalCategory.toLowerCase() !== category) return false;
      if (discipline && h.discipline.toLowerCase() !== discipline) return false;
      if (emergencyServices && h.emergencyServices.toLowerCase() !== emergencyServices) return false;

      return true;
    });

    // Sorting
    const sortBy = query.sortBy || 'hospitalName';
    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;

    filtered.sort((a, b) => {
      let aVal = (a as any)[sortBy] || '';
      let bVal = (b as any)[sortBy] || '';

      if (sortBy === 'totalNumBeds' || sortBy === 'numberDoctor') {
        const aNum = parseInt(aVal, 10) || 0;
        const bNum = parseInt(bVal, 10) || 0;
        return (aNum - bNum) * sortOrder;
      }

      return aVal.toString().localeCompare(bVal.toString()) * sortOrder;
    });

    // Pagination
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
      filters: this.getFilters(),
      hospitals: paginated,
      source: 'Hospital Directory Dataset',
      sourceLimitation: 'Administrative, facility, and capacity registry data. Does not establish real-time medicine inventory.'
    };
  }
}

export const hospitalDirectoryService = HospitalDirectoryService.getInstance();
