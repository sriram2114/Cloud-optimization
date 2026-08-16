import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { downloadReportPdf } from '../services/api';
import ChartCard from '../components/ChartCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FileBarChart,
  Download,
  FileText,
  Calendar,
  ChevronDown,
  CheckCircle
} from 'lucide-react';

const REPORT_TYPES = [
  { id: 'monthly-cost', label: 'Monthly Cost Report', description: 'Comprehensive monthly cloud spend breakdown' },
  { id: 'provider-cost', label: 'Cloud Provider Report', description: 'Cost comparison across AWS, Azure, and GCP' },
  { id: 'department-cost', label: 'Department Cost Report', description: 'Chargeback by corporate department' },
  { id: 'optimization', label: 'Optimization Report', description: 'Savings opportunities and applied optimizations' },
  { id: 'budget-compliance', label: 'Budget Compliance Report', description: 'Budget utilization and threshold breaches' },
  { id: 'governance', label: 'Governance Report', description: 'Policy compliance and violation summary' }
];

const Reports = () => {
  const { addToast } = useToast();
  const [reportType, setReportType] = useState('monthly-cost');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-31');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const selectedReport = REPORT_TYPES.find(r => r.id === reportType);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedReport(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      setGeneratedReport({
        type: reportType,
        label: selectedReport?.label,
        dateRange: `${startDate} to ${endDate}`,
        generatedAt: new Date().toISOString(),
        summary: {
          totalRecords: 156,
          totalCost: 88500,
          providers: 3,
          departments: 4
        }
      });

      addToast(`${selectedReport?.label} generated successfully`, 'success');
    } catch {
      addToast('Failed to generate report', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCsv = () => {
    if (!generatedReport) {
      addToast('Generate a report first', 'warning');
      return;
    }

    const csvContent = [
      'Report Type,Date Range,Total Cost,Total Records',
      `${generatedReport.label},${generatedReport.dateRange},88500,156`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cloudcostx-${reportType}-${startDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    addToast('CSV report downloaded', 'success');
  };

  const handleExportPdf = async () => {
    if (!generatedReport) {
      addToast('Please generate a report first.', 'warning');
      return;
    }
    try {
      addToast('Compiling PDF report on FinOps engine...', 'info', 2000);
      const response = await downloadReportPdf(reportType, `${startDate}_to_${endDate}`);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CloudCostX_${reportType}_Report.pdf`);
      link.click();
      URL.revokeObjectURL(url);
      
      addToast('PDF report downloaded successfully', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to compile PDF report. Please verify connection to backend.', 'error');
    }
  };

  return (
    <div className="space-y-6 select-none">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Reports & Analytics</h2>
        <p className="text-xs text-slate-500 font-medium">Generate and export FinOps reports for stakeholders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <FileBarChart className="w-4 h-4 text-indigo-400" />
              Report Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2" htmlFor="reportType">
                  Report Type
                </label>
                <div className="relative">
                  <select
                    id="reportType"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full appearance-none px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {REPORT_TYPES.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                {selectedReport && (
                  <p className="text-xs text-slate-500 mt-1.5">{selectedReport.description}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      aria-label="Start date"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      aria-label="End date"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700/50 text-white rounded-lg text-sm font-bold transition-all"
              >
                {isGenerating ? 'Generating Report...' : 'Generate Report'}
              </button>
            </div>
          </div>

          {/* Export Actions */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Export Options</h3>
            <div className="space-y-2">
              <button
                onClick={handleExportCsv}
                className="w-full flex items-center gap-3 px-4 py-2.5 border border-slate-800 hover:border-emerald-500/30 hover:bg-emerald-500/5 rounded-lg text-sm text-slate-300 transition-all"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Download CSV
              </button>
              <button
                onClick={handleExportPdf}
                className="w-full flex items-center gap-3 px-4 py-2.5 border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/5 rounded-lg text-sm text-slate-300 transition-all"
              >
                <FileText className="w-4 h-4 text-rose-400" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2">
          {isGenerating ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 flex items-center justify-center">
              <LoadingSpinner message="Compiling report data..." />
            </div>
          ) : generatedReport ? (
            <div className="space-y-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{generatedReport.label}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {generatedReport.dateRange}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Generated
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Total Cost</p>
                    <p className="text-lg font-bold text-indigo-400 mt-1">₹{generatedReport.summary.totalCost.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Records</p>
                    <p className="text-lg font-bold text-slate-200 mt-1">{generatedReport.summary.totalRecords}</p>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Providers</p>
                    <p className="text-lg font-bold text-slate-200 mt-1">{generatedReport.summary.providers}</p>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Departments</p>
                    <p className="text-lg font-bold text-slate-200 mt-1">{generatedReport.summary.departments}</p>
                  </div>
                </div>
              </div>

              <ChartCard title="Report Preview" subtitle="Sample visualization for selected report type">
                <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                  Report data visualization — connect to backend API for live charts
                </div>
              </ChartCard>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center">
              <FileBarChart className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-slate-300 mb-1">No Report Generated</h3>
              <p className="text-xs text-slate-500">Select a report type and date range, then click Generate Report</p>
            </div>
          )}
        </div>
      </div>

      {/* Available Report Types Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3">Available Report Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {REPORT_TYPES.map(r => (
            <button
              key={r.id}
              onClick={() => setReportType(r.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                reportType === r.id
                  ? 'bg-indigo-600/10 border-indigo-500/30'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <p className="text-sm font-bold text-slate-200">{r.label}</p>
              <p className="text-xs text-slate-500 mt-1">{r.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
