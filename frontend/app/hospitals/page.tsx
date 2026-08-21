'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Bed,
  Stethoscope,
  Phone,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Info,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { getHospitals, getHospitalFilters } from '@/lib/api';
import { HospitalRecord, HospitalDirectoryResponse } from '@/types/hospital.types';

export default function HospitalDirectoryPage() {
  const [data, setData] = useState<HospitalDirectoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Query State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCareType, setSelectedCareType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Filter options
  const [filters, setFilters] = useState<{
    states: string[];
    careTypes: string[];
    categories: string[];
    disciplines: string[];
  }>({
    states: [],
    careTypes: [],
    categories: [],
    disciplines: [],
  });

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load initial filters
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const res = await getHospitalFilters();
        if (res) {
          setFilters(res);
        }
      } catch {
        // Fallback
      }
    }
    loadFilterOptions();
  }, []);

  // Fetch paginated directory data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHospitals({
        search: debouncedSearch,
        state: selectedState || undefined,
        careType: selectedCareType || undefined,
        category: selectedCategory || undefined,
        discipline: selectedDiscipline || undefined,
        page,
        limit,
      });

      if (res) {
        setData(res);
        if (res.filters && res.filters.states.length > 0) {
          setFilters(res.filters);
        }
      }
    } catch (err: any) {
      setError('Unable to load hospital records. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedState, selectedCareType, selectedCategory, selectedDiscipline, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedState('');
    setSelectedCareType('');
    setSelectedCategory('');
    setSelectedDiscipline('');
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Title & Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fff5f7] text-[#e3577c] border border-[#ffc8d3] uppercase">
              AUTHORITATIVE NATIONAL DIRECTORY
            </span>
            <span className="text-xs text-[#667085] font-mono">
              30,273 Registered Facilities
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#24324a] tracking-tight mt-1">
            Healthcare Facility Directory
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Verified clinical registry records, facility capacities, contact numbers, and district infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white border border-[#ffc8d3] text-xs font-semibold text-[#24324a] shadow-soft">
          <ShieldCheck className="w-4 h-4 text-[#94d4f8]" />
          <span>Source: Hospital Directory Dataset</span>
        </div>
      </div>

      {/* Mandatory Data Transparency & Limitation Notice */}
      <div className="p-4 rounded-lg bg-[#fff5f7] border border-[#ffc8d3] flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-[#e3577c] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-[#24324a]">Data Source & Scope Disclosure</p>
          <p className="text-[#667085] leading-relaxed">
            Information displayed is indexed directly from the authoritative open healthcare directory dataset (30,273 facility records across 48 attributes). 
            <strong className="text-[#24324a] ml-1">Important Notice:</strong> This registry contains administrative, facility, and bed infrastructure data; it does not establish real-time medicine inventory, supplier stock, or live procurement purchasing.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-lg border border-[#ffc8d3] p-4 sm:p-5 shadow-card space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hospitals by name, city, district, state, or PIN code..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#ffc8d3] focus:border-[#e3577c] bg-[#fff5f7] outline-none text-xs text-[#24324a] placeholder-[#667085]"
          />
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#667085] mb-1 uppercase">
              State / UT
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-2 rounded border border-[#ffc8d3] bg-[#fff5f7] text-[#24324a] outline-none text-xs"
            >
              <option value="">All States ({filters.states.length})</option>
              {filters.states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Care Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#667085] mb-1 uppercase">
              Care Type
            </label>
            <select
              value={selectedCareType}
              onChange={(e) => {
                setSelectedCareType(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-2 rounded border border-[#ffc8d3] bg-[#fff5f7] text-[#24324a] outline-none text-xs"
            >
              <option value="">All Care Types</option>
              {filters.careTypes.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#667085] mb-1 uppercase">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-2 rounded border border-[#ffc8d3] bg-[#fff5f7] text-[#24324a] outline-none text-xs"
            >
              <option value="">All Categories</option>
              {filters.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Discipline Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#667085] mb-1 uppercase">
              Discipline
            </label>
            <select
              value={selectedDiscipline}
              onChange={(e) => {
                setSelectedDiscipline(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-2 rounded border border-[#ffc8d3] bg-[#fff5f7] text-[#24324a] outline-none text-xs"
            >
              <option value="">All Disciplines</option>
              {filters.disciplines.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Stats & Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-[#ffc8d3]/60 text-xs">
          <div className="text-[#667085]">
            Found <strong className="text-[#24324a]">{data?.total?.toLocaleString() || 0}</strong> verified facilities
            {data && data.total < 30273 && ` (filtered)`}
          </div>

          {(selectedState || selectedCareType || selectedCategory || selectedDiscipline || search) && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-[#e3577c] hover:text-[#e27094] font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Results Table */}
      <div className="bg-white rounded-lg border border-[#ffc8d3] shadow-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#667085] space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#e3577c] border-t-transparent animate-spin mx-auto" />
            <p className="font-semibold text-[#24324a]">Querying 30,273 hospital records...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-xs text-rose-600 space-y-2">
            <AlertCircle className="w-6 h-6 mx-auto" />
            <p className="font-semibold">{error}</p>
          </div>
        ) : !data || data.hospitals.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#667085] space-y-2">
            <Building2 className="w-8 h-8 text-[#ffc8d3] mx-auto" />
            <p className="font-bold text-[#24324a]">No hospitals found</p>
            <p>Try refining your search terms or clearing state filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#ffc8d3] bg-[#fff5f7] text-[#24324a] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Hospital Name & Location</th>
                  <th className="py-3 px-4">State & District</th>
                  <th className="py-3 px-4">Care Type</th>
                  <th className="py-3 px-4">Discipline</th>
                  <th className="py-3 px-4">Beds</th>
                  <th className="py-3 px-4">Emergency</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffc8d3]/60 text-[#24324a]">
                {data.hospitals.map((hosp) => (
                  <tr
                    key={hosp.id}
                    className="hover:bg-[#fff5f7] transition-colors"
                  >
                    {/* Name & Subtitle */}
                    <td className="py-3.5 px-4 font-semibold text-[#24324a] max-w-[280px]">
                      <div className="font-bold text-sm truncate">{hosp.hospitalName}</div>
                      <div className="text-[11px] text-[#667085] truncate font-normal mt-0.5">
                        {hosp.address !== 'Not available' ? hosp.address : hosp.location}
                      </div>
                    </td>

                    {/* State & District */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-[#24324a]">{hosp.state}</div>
                      <div className="text-[11px] text-[#667085]">{hosp.district}</div>
                    </td>

                    {/* Care Type & Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-[#24324a] block">{hosp.hospitalCareType}</span>
                      <span className="text-[10px] text-[#667085] block">{hosp.hospitalCategory}</span>
                    </td>

                    {/* Discipline */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[#667085]">
                      {hosp.discipline}
                    </td>

                    {/* Beds */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold">
                      {hosp.totalNumBeds !== 'Not available' ? (
                        <span className="inline-flex items-center gap-1 text-[#24324a]">
                          <Bed className="w-3.5 h-3.5 text-[#e3577c]" />
                          <span>{hosp.totalNumBeds}</span>
                        </span>
                      ) : (
                        <span className="text-[#667085] font-normal text-[11px]">N/A</span>
                      )}
                    </td>

                    {/* Emergency */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {hosp.emergencyServices !== 'Not available' && hosp.emergencyServices.toLowerCase().includes('yes') ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E0F2FE] text-[#0F5B6E] border border-[#BAE6FD]">
                          24x7 Emergency
                        </span>
                      ) : (
                        <span className="text-[#667085] text-[11px]">
                          {hosp.emergencyServices !== 'Not available' ? hosp.emergencyServices : 'Not listed'}
                        </span>
                      )}
                    </td>

                    {/* Action Link */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/hospitals/${encodeURIComponent(hosp.id)}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white hover:bg-[#fff5f7] border border-[#ffc8d3] text-xs font-bold text-[#e3577c] shadow-soft transition-colors"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {data && data.totalPages > 1 && (
          <div className="p-4 bg-[#fff5f7] border-t border-[#ffc8d3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-[#667085]">
              Page <strong className="text-[#24324a]">{data.page}</strong> of <strong className="text-[#24324a]">{data.totalPages.toLocaleString()}</strong> ({data.total.toLocaleString()} total records)
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-[#ffc8d3] disabled:opacity-40 text-xs font-semibold text-[#24324a] shadow-soft"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="font-mono px-2 py-1 bg-white rounded border border-[#ffc8d3] text-xs font-bold text-[#24324a]">
                {page} / {data.totalPages}
              </span>

              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white border border-[#ffc8d3] disabled:opacity-40 text-xs font-semibold text-[#24324a] shadow-soft"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
