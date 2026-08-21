export interface HospitalRecord {
  id: string;
  srNo: string;
  locationCoordinates: string;
  location: string;
  hospitalName: string;
  hospitalCategory: string;
  hospitalCareType: string;
  discipline: string;
  address: string;
  state: string;
  district: string;
  subdistrict: string;
  pincode: string;
  telephone: string;
  mobileNumber: string;
  emergencyNum: string;
  ambulancePhoneNo: string;
  bloodbankPhoneNo: string;
  foreignPcare: string;
  tollfree: string;
  helpline: string;
  hospitalFax: string;
  primaryEmail: string;
  secondaryEmail: string;
  website: string;
  specialties: string;
  facilities: string;
  accreditation: string;
  registrationNumber: string;
  registrationNumberScan: string;
  nodalPersonInfo: string;
  nodalPersonTele: string;
  nodalPersonEmail: string;
  town: string;
  subtown: string;
  village: string;
  establishedYear: string;
  ayush: string;
  miscellaneousFacilities: string;
  numberDoctor: string;
  numMediconsultantOrExpert: string;
  totalNumBeds: string;
  numberPrivateWards: string;
  numBedForEcoWeakerSec: string;
  empanelmentOrCollaborationWith: string;
  emergencyServices: string;
  tariffRange: string;
  stateId: string;
  districtId: string;
  source: string;
  sourceLimitation: string;
  lastUpdated: string;
}

export interface HospitalDirectoryFilterQuery {
  search?: string;
  state?: string;
  district?: string;
  town?: string;
  careType?: string;
  category?: string;
  discipline?: string;
  emergencyServices?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface HospitalDirectoryResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  filters: {
    states: string[];
    careTypes: string[];
    categories: string[];
    disciplines: string[];
  };
  hospitals: HospitalRecord[];
  source: string;
  sourceLimitation: string;
}
