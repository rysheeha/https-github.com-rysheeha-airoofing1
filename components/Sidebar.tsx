
import React from 'react';
import { OperatingMode, ClaimMetadata } from '../types';

interface SidebarProps {
  metadata: ClaimMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<ClaimMetadata>>;
  mode: OperatingMode;
  setMode: (mode: OperatingMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ metadata, setMetadata, mode, setMode }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  return (
    <aside className="w-80 bg-slate-900 text-white flex flex-col border-r border-slate-800 shadow-2xl z-10">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          XPRO ELITE
        </h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-tighter">Exterior Builders Portal</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <section>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Operating Mode</label>
          <div className="space-y-2">
            {Object.values(OperatingMode).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 border ${
                  mode === m 
                  ? 'bg-blue-600 border-blue-500 shadow-lg text-white' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:border-slate-600'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Claim Details</label>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Carrier</label>
              <input
                name="carrier"
                value={metadata.carrier}
                onChange={handleChange}
                placeholder="Insurance Co."
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Claim #</label>
              <input
                name="claimNumber"
                value={metadata.claimNumber}
                onChange={handleChange}
                placeholder="XXXX-YYYY-ZZ"
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Property Address</label>
              <input
                name="address"
                value={metadata.address}
                onChange={handleChange}
                placeholder="123 Builder St..."
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Date of Loss</label>
              <input
                type="date"
                name="dateOfLoss"
                value={metadata.dateOfLoss}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Adjuster</label>
              <input
                name="adjuster"
                value={metadata.adjuster}
                onChange={handleChange}
                placeholder="Adjuster Name"
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Goal</label>
              <select
                name="nextStep"
                value={metadata.nextStep}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option>Initial Claim Submission</option>
                <option>Reinspection Request</option>
                <option>Supplement Submission</option>
                <option>Denial Response</option>
                <option>Matching Issue/ITEL</option>
                <option>Recoverable Depreciation</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 text-center italic">
        Authorized use for XPRO ELITE internal staff only.
      </div>
    </aside>
  );
};
