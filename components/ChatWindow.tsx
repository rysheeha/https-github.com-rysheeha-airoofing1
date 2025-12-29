
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ProcessedFile } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSend: (text: string, files: ProcessedFile[]) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSend }) => {
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<ProcessedFile[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: ProcessedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(file);
      });
      newFiles.push({ name: file.name, type: file.type, base64 });
    }
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleSend = () => {
    if (!input.trim() && selectedFiles.length === 0) return;
    onSend(input, selectedFiles);
    setInput('');
    setSelectedFiles([]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 prose prose-slate prose-sm'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.text}
              </div>
              {msg.role === 'model' && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                   <button 
                    onClick={() => navigator.clipboard.writeText(msg.text)}
                    className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest transition-colors"
                   >
                     Copy to Clipboard
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="max-w-[150px] truncate">{f.name}</span>
                <button 
                  onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                  className="hover:text-red-600 ml-1 transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-4 items-end max-w-5xl mx-auto">
          <div className="flex-1 bg-slate-100 rounded-2xl p-2 flex items-end border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask Megan about a claim, or describe a situation..."
              rows={Math.min(5, input.split('\n').length || 1)}
              className="flex-1 bg-transparent border-none outline-none p-3 text-sm text-slate-800 resize-none min-h-[44px]"
            />
            <div className="flex items-center gap-1 pr-2 pb-1.5">
              <label className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-full cursor-pointer transition-all shadow-sm">
                <input type="file" multiple onChange={handleFileChange} className="hidden" accept=".pdf" />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </label>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && selectedFiles.length === 0)}
            className="h-[52px] px-6 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center gap-2 group"
          >
            <span>Megan, GO</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
