
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { OperatingMode, ClaimMetadata, ChatMessage, ProcessedFile } from './types';
import { gemini } from './services/geminiService';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { WelcomeScreen } from './components/WelcomeScreen';

const App: React.FC = () => {
  const [metadata, setMetadata] = useState<ClaimMetadata>({
    carrier: '',
    claimNumber: '',
    address: '',
    dateOfLoss: '',
    adjuster: '',
    nextStep: 'Initial Submission'
  });

  const [mode, setMode] = useState<OperatingMode>(OperatingMode.MODE_C);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeMegan = async () => {
    setIsLoading(true);
    try {
      await gemini.initializeChat(mode, metadata);
      setIsInitialized(true);
    } catch (error) {
      console.error("Initialization failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string, files: ProcessedFile[]) => {
    if (!isInitialized) await initializeMegan();
    
    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await gemini.sendMessage(text, files);
      const modelMsg: ChatMessage = { role: 'model', text: response || 'No response generated.' };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error processing that request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: OperatingMode) => {
    setMode(newMode);
    setIsInitialized(false); // Force re-init with new mode instructions
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden">
      <Sidebar 
        metadata={metadata} 
        setMetadata={setMetadata} 
        mode={mode} 
        setMode={handleModeChange} 
      />
      
      <main className="flex-1 flex flex-col relative">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
              M
            </div>
            <div>
              <h1 className="font-bold text-slate-800 tracking-tight">Megan</h1>
              <p className="text-xs text-blue-600 font-medium uppercase tracking-widest">Restoration Claims Conduit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
              {mode.split(' — ')[0]}
            </span>
          </div>
        </header>

        {messages.length === 0 ? (
          <WelcomeScreen onQuickStart={handleSendMessage} />
        ) : (
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading} 
            onSend={handleSendMessage} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
