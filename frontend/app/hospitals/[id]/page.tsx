'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Building2,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Bed,
  Stethoscope,
  Award,
  Calendar,
  AlertTriangle,
  Info,
  ExternalLink,
  CheckCircle2,
  HeartPulse,
} from 'lucide-react';
import { getHospitalById } from '@/lib/api';
import { HospitalRecord } from '@/types/hospital.types';
import { useDemo } from '@/context/DemoContext';

export default function HospitalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { updateHospitalSettings, addToast } = useDemo();
  const id = params?.id as string;

  const [hospital, setHospital] = useState<HospitalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getHospitalById(id);
        if (res) {
          setHospital(res);
        } else {
          setError('Hospital record not found in authoritative directory.');
        }
      } catch (err: any) {
        setError('Failed to retrieve hospital record.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSelectInstitution = () => {
    if (!hospital) return;
    updateHospitalSettings({
      name: hospital.hospitalName,
      department: hospital.hospitalCareType !== 'Not available' ? hospital.hospitalCareType : 'Central Clinical Facility',
    });
    addToast(`Institution context updated to ${hospital.hospitalName}`, 'success');
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[#667085] space-y-2">
        <div className="w-8 h-8 rounded-full border-2 border-[#e3577c] border-t-transparent animate-spin mx-auto" />
        <p className="font-semibold text-[#24324a]">Loading authoritative hospital details...</p>
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="py-20 text-center text-xs space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#24324a]">Hospital Record Not Found</h2>
          <p className="text-[#667085] mt-1">{error || 'No record matched this identifier in the directory.'}</p>
        </div>
        <Link
          href="/hospitals"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#e3577c] text-white text-xs font-bold shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Hospital Directory</span>
        </Link>
      </div>
    );
  }

  const renderField = (label: string, value: string | undefined, icon?: React.ReactNode) => {
    const isMissing = !value || value === 'Not available' || value === '0';
    return (
      <div className="p-3 rounded bg-[#fff5f7] border border-[#ffc8d3] space-y-1">
        <span className="text-[10px] uppercase font-bold text-[#667085] block flex items-center gap-1">
          {icon}
          <span>{label}</span>
        </span>
        <span className={`text-xs block font-semibold ${isMissing ? 'text-[#667085] italic font-normal' : 'text-[#24324a]'}`}>
          {isMissing ? 'Not available' : value}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/hospitals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#e3577c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hospital Directory</span>
        </Link>

        <button
          onClick={handleSelectInstitution}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#e3577c] hover:bg-[#e27094] text-white text-xs font-bold shadow-soft transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Set As Active Hospital Context</span>
        </button>
      </div>

      {/* Hospital Hero Banner */}
      <div className="bg-white rounded-lg border border-[#ffc8d3] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#ffc8d3]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#fff5f7] border border-[#ffc8d3] text-[#e3577c] flex items-center justify-center font-bold shadow-soft flex-shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#24324a] tracking-tight">
                  {hospital.hospitalName}
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3] uppercase">
                  RECORD #{hospital.srNo}
                </span>
              </div>
              <p className="text-xs text-[#667085] font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#e3577c]" />
                <span>{hospital.district}, {hospital.state} (PIN: {hospital.pincode})</span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2 py-0.5 rounded bg-white text-[11px] font-semibold text-[#24324a] border border-[#ffc8d3]">
                  Care Type: {hospital.hospitalCareType}
                </span>
                <span className="px-2 py-0.5 rounded bg-white text-[11px] font-semibold text-[#24324a] border border-[#ffc8d3]">
                  Category: {hospital.hospitalCategory}
                </span>
                <span className="px-2 py-0.5 rounded bg-white text-[11px] font-semibold text-[#24324a] border border-[#ffc8d3]">
                  Discipline: {hospital.discipline}
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block">
              TOTAL BED CAPACITY
            </span>
            <div className="text-2xl font-black text-[#24324a] font-mono">
              {hospital.totalNumBeds !== 'Not available' ? hospital.totalNumBeds : 'N/A'}
            </div>
            <p className="text-[11px] text-[#667085]">
              {hospital.numberDoctor !== 'Not available' ? `${hospital.numberDoctor} Registered Doctors` : 'Doctors unlisted'}
            </p>
          </div>
        </div>

        {/* Data Limitation Notice Box */}
        <div className="p-4 rounded-lg bg-[#fff5f7] border border-[#ffc8d3] flex items-start gap-3 text-xs">
          <Info className="w-4 h-4 text-[#e3577c] flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-[#24324a]">Source Provenance & Boundaries</p>
            <p className="text-[#667085]">
              <strong>Source:</strong> Hospital Directory Dataset &bull; <strong>Scope:</strong> Facility infrastructure and contact specifications. This record does NOT establish real-time pharmacy or PPE inventory.
            </p>
          </div>
        </div>

        {/* 1. Location & Geography */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#24324a] border-b border-[#ffc8d3] pb-1.5">
            1. Geographic & Location Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {renderField('Address Line', hospital.address)}
            {renderField('State', hospital.state)}
            {renderField('District', hospital.district)}
            {renderField('Subdistrict', hospital.subdistrict)}
            {renderField('Town / City', hospital.town)}
            {renderField('Subtown', hospital.subtown)}
            {renderField('Village', hospital.village)}
            {renderField('Pincode', hospital.pincode)}
            {renderField('Coordinates (Lat, Lng)', hospital.locationCoordinates)}
            {renderField('Location Landmark', hospital.location)}
            {renderField('State ID', hospital.stateId)}
            {renderField('District ID', hospital.districtId)}
          </div>
        </div>

        {/* 2. Emergency Services & Critical Care */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#24324a] border-b border-[#ffc8d3] pb-1.5">
            2. Emergency & Critical Contact Channels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {renderField('Emergency Services', hospital.emergencyServices)}
            {renderField('Emergency Phone', hospital.emergencyNum, <Phone className="w-3 h-3 text-[#e3577c]" />)}
            {renderField('Ambulance Phone', hospital.ambulancePhoneNo, <HeartPulse className="w-3 h-3 text-[#e3577c]" />)}
            {renderField('Blood Bank Phone', hospital.bloodbankPhoneNo)}
            {renderField('Telephone', hospital.telephone)}
            {renderField('Mobile Number', hospital.mobileNumber)}
            {renderField('Toll-Free Number', hospital.tollfree)}
            {renderField('Helpline', hospital.helpline)}
            {renderField('Primary Email', hospital.primaryEmail, <Mail className="w-3 h-3 text-[#e3577c]" />)}
            {renderField('Secondary Email', hospital.secondaryEmail)}
            {renderField('Official Website', hospital.website, <Globe className="w-3 h-3 text-[#e3577c]" />)}
            {renderField('Hospital Fax', hospital.hospitalFax)}
          </div>
        </div>

        {/* 3. Capacity & Infrastructure */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#24324a] border-b border-[#ffc8d3] pb-1.5">
            3. Capacity & Clinical Staffing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {renderField('Total Beds', hospital.totalNumBeds, <Bed className="w-3 h-3 text-[#e3577c]" />)}
            {renderField('Private Wards', hospital.numberPrivateWards)}
            {renderField('Eco-Weaker Section Beds', hospital.numBedForEcoWeakerSec)}
            {renderField('Number of Doctors', hospital.numberDoctor, <Stethoscope className="w-3 h-3 text-[#e3577c]" />)}
            {renderField('Medical Consultants / Experts', hospital.numMediconsultantOrExpert)}
            {renderField('Tariff Range', hospital.tariffRange)}
            {renderField('AYUSH Facilities', hospital.ayush)}
            {renderField('Established Year', hospital.establishedYear, <Calendar className="w-3 h-3 text-[#e3577c]" />)}
          </div>
        </div>

        {/* 4. Facilities, Specialties & Accreditations */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#24324a] border-b border-[#ffc8d3] pb-1.5">
            4. Facilities, Specialties & Regulatory Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {renderField('Clinical Specialties', hospital.specialties)}
            {renderField('Medical Facilities', hospital.facilities)}
            {renderField('Miscellaneous Facilities', hospital.miscellaneousFacilities)}
            {renderField('Empanelment / Collaborations', hospital.empanelmentOrCollaborationWith)}
            {renderField('Accreditation Status', hospital.accreditation, <Award className="w-3 h-3 text-[#e3577c]" />)}
            {renderField('Registration Number', hospital.registrationNumber)}
            {renderField('Registration Scan Record', hospital.registrationNumberScan)}
            {renderField('Foreign Patient Care (pcare)', hospital.foreignPcare)}
          </div>
        </div>

        {/* 5. Nodal Officer Contacts */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#24324a] border-b border-[#ffc8d3] pb-1.5">
            5. Institutional Nodal Officer Directory
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {renderField('Nodal Officer Name / Info', hospital.nodalPersonInfo)}
            {renderField('Nodal Officer Telephone', hospital.nodalPersonTele)}
            {renderField('Nodal Officer Email', hospital.nodalPersonEmail)}
          </div>
        </div>
      </div>
    </div>
  );
}
