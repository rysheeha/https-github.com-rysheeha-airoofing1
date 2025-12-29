
import React from 'react';
// Fix: Import ProcessedFile from types
import { ProcessedFile } from '../types';

interface WelcomeScreenProps {
  onQuickStart: (text: string, files: ProcessedFile[]) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onQuickStart }) => {
  const suggestions = [
    { title: "Extract Estimate Facts", desc: "Upload an Xactimate PDF and ask for a gap analysis.", icon: "📄" },
    { title: "Draft Reinspection Letter", desc: "Draft a message to carrier for missing items like drip edge.", icon: "📧" },
    { title: "Homeowner Summary", desc: "Explain why we need a supplement in plain English.", icon: "🏠" },
    { title: "IRC Code Compliance", desc: "Identify IRC R8/R9 violations in a denial letter.", icon: "⚖️" }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white overflow-y-auto">
      <div className="max-w-3xl w-full text-center space-y-12">
        <div className="space-y-4">
          <div className="w-24 h-24 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-white text-4xl font-black shadow-2xl animate-pulse">
            M
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Megan</h1>
          <p className="text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
            Your Insurance Restoration Claims Conduit. Carrier-ready documentation,IRC expertise, and homeowner transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onQuickStart(`Help me ${s.title.toLowerCase()}. ${s.desc}`, [])}
              className="text-left p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all group hover:shadow-lg"
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <h3 className="font-bold text-slate-800 group-hover:text-blue-700">{s.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
            </button>
          ))}
        </div>

        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 inline-block">
          <p className="text-sm text-blue-700 font-medium">
            "Upload any claim PDFs. Tell me Carrier, Claim #, and what you want next. I’ll extract the facts and draft ready-to-use messages."
          </p>
        </div>
      </div>
    </div>
  );
};
