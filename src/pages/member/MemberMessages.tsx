// src/pages/member/MemberMessages.tsx
import React, { useState, useEffect, useRef } from 'react';
import { demoStore } from '../../demo/mockStore';
import { mockMessageService } from '../../demo/mockServices';
import { MessageSquare, Send, User, CheckCircle2, Shield, Phone, Video } from 'lucide-react';

export const MemberMessages: React.FC = () => {
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    return () => unsub();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [storeState.messages]);

  const { member, messages, coaches } = storeState;
  const assignedCoach = coaches.find(c => c.name === member.trainer) || coaches[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputValue.trim();
    if (!clean) return;

    setIsSending(true);
    setInputValue('');
    await mockMessageService.sendMessage(clean);
    setIsSending(false);
  };

  return (
    <div className="space-y-6 select-none max-w-4xl">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.25em] font-bold block mb-1">
          TACTICAL COMMS TERMINAL
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          DIRECT COACH COMMS
        </h1>
        <p className="text-xs text-zinc-400">
          Encrypted, real-time consultation with your dedicated master trainer {assignedCoach.name}.
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
        {/* Chat Header Bar */}
        <div className="p-4 sm:p-5 bg-[#0D0D11] border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#FF5500] bg-zinc-900 shadow-[0_0_10px_rgba(255,85,0,0.3)]">
              <img
                src={assignedCoach.avatar_url}
                alt={assignedCoach.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0D0D11] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold uppercase text-white tracking-wide">
                  {assignedCoach.name}
                </h2>
                <span className="px-2 py-0.5 bg-[#FF5500] text-black font-mono text-[9px] font-black uppercase rounded">
                  ASSIGNED COACH
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <span className="text-emerald-400 font-bold">● ACTIVE NOW</span>
                <span>•</span>
                <span>{assignedCoach.specialization}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 bg-[#070709] border border-zinc-800 px-3 py-1 rounded-lg">
              256-BIT ENCRYPTED
            </span>
          </div>
        </div>

        {/* Message History Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#070709]/80 font-mono text-xs">
          {/* Security Notice */}
          <div className="text-center py-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest bg-zinc-900/60 border border-zinc-800 px-3 py-1 rounded-full">
              DIRECT ATHLETE-COACH ENCRYPTED CHANNEL INITIALIZED
            </span>
          </div>

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                <span className="font-bold">{msg.isMe ? 'YOU (ARJUN MEHTA)' : msg.sender.toUpperCase()}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[80%] sm:max-w-md p-3.5 rounded-2xl leading-relaxed text-sm ${
                  msg.isMe
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#FF7728] text-white font-medium rounded-tr-none shadow-[0_0_15px_rgba(255,85,0,0.25)]'
                    : 'bg-[#14151C] border border-[#27272A] text-zinc-200 rounded-tl-none font-sans'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-[#0D0D11] border-t border-[#27272A] flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={`Message Coach ${assignedCoach.name.split(' ')[0]}...`}
            className="flex-1 bg-[#14151C] border border-[#27272A] focus:border-[#FF5500] rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="px-5 py-3 bg-[#FF5500] hover:bg-[#ff661a] disabled:opacity-40 text-black font-display text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <span>SEND</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default MemberMessages;
