'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Download,
  Database,
  Building,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export default function InventoryImportPage() {
  const router = useRouter();
  const { addToast } = useDemo();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      addToast(`Imported ${selectedFile.name} successfully into hospital inventory!`, 'success');
      router.push('/inventory');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#e3577c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-[#ffc8d3] p-6 sm:p-8 shadow-card space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#24324a] tracking-tight">
            Import Medical Inventory Records
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Upload CSV or Excel spreadsheets containing hospital SKU records, batch lots, and current stock levels.
          </p>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? 'border-[#e3577c] bg-[#fff5f7]'
              : 'border-[#ffc8d3] bg-[#fff5f7]/50 hover:bg-[#fff5f7]'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#ffc8d3]/60 text-[#e3577c] flex items-center justify-center shadow-soft">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#24324a]">
                {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
              </p>
              <p className="text-xs text-[#667085] mt-0.5">
                Supported formats: CSV, XLSX, XLS (max 25MB)
              </p>
            </div>
          </label>
        </div>

        {/* Standard Template Download */}
        <div className="p-4 rounded-lg bg-[#fff5f7] border border-[#ffc8d3] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-[#e3577c]" />
            <div>
              <p className="font-bold text-[#24324a]">Hospital Inventory Import Template</p>
              <p className="text-[#667085]">Standardized format with SKU, Category, Reorder Point, and Stock.</p>
            </div>
          </div>

          <button
            onClick={() => addToast('Downloading MedMatch Inventory Template (CSV)...', 'info')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-[#ffc8d3] text-xs font-semibold text-[#e3577c] hover:bg-[#fff5f7] shadow-soft"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Template</span>
          </button>
        </div>

        {/* Submit button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#ffc8d3]">
          <Link
            href="/inventory"
            className="px-4 py-2 rounded text-xs font-semibold text-[#667085] hover:text-[#24324a]"
          >
            Cancel
          </Link>
          <button
            disabled={!selectedFile || isImporting}
            onClick={handleImport}
            className="px-6 py-2 rounded bg-[#e3577c] hover:bg-[#e27094] disabled:opacity-50 text-white text-xs font-bold shadow-soft transition-all"
          >
            {isImporting ? 'Validating & Ingesting...' : 'Ingest Inventory Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
