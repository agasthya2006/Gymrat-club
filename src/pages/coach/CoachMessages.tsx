// src/pages/coach/CoachMessages.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { MessageSquare, Send, User, CheckCircle2 } from 'lucide-react';

export const CoachMessages: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [activePartnerId, setActivePartnerId] = useState('usr-member-1');
  const [partnerName, setPartnerName] = useState('Marcus "Titan" Vance');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const loadMessages = () => {
    if (user && activePartnerId) {
      api.getMessages(user.id, activePartnerId).then(res => {
        setMessages(res || []);
      }).catch(err => console.error(err));
    }
  };

  useEffect(() => {
    loadMessages();
  }, [user, activePartnerId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;
    setIsSending(true);

    try {
      const newMsg = await api.sendMessage(user.id, activePartnerId, content.trim());
      setMessages(prev => [...prev, newMsg]);
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
          OPERATIONAL COMMS CHANNEL
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          ATHLETE MESSAGING TERMINAL
        </h1>
        <p className="text-xs text-zinc-400">
          Direct communication channel with your assigned athletes for cues, adjustments, and telemetry feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] bg-[#14151C] border border-[#27272A] rounded-xl overflow-hidden">
        {/* Left Column: Athlete Channels */}
        <div className="border-r border-[#27272A] p-4 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
              ACTIVE ATHLETE CHANNELS
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActivePartnerId('usr-member-1');
                  setPartnerName('Marcus "Titan" Vance');
                }}
                className={`w-full p-3 rounded-lg text-left font-mono text-xs flex items-center justify-between transition-all ${
                  activePartnerId === 'usr-member-1'
                    ? 'bg-[#E1601B]/20 border border-[#E1601B] text-white'
                    : 'bg-[#0D0D11] border border-[#27272A] text-zinc-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-bold">Marcus "Titan" Vance</div>
                  <div className="text-[10px] text-zinc-500">GRC-ATH-001</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#E1601B]" />
              </button>

              <button
                onClick={() => {
                  setActivePartnerId('usr-member-3');
                  setPartnerName('Carlos Morales');
                }}
                className={`w-full p-3 rounded-lg text-left font-mono text-xs flex items-center justify-between transition-all ${
                  activePartnerId === 'usr-member-3'
                    ? 'bg-[#E1601B]/20 border border-[#E1601B] text-white'
                    : 'bg-[#0D0D11] border border-[#27272A] text-zinc-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-bold">Carlos Morales</div>
                  <div className="text-[10px] text-zinc-500">GRC-ATH-003</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Message Feed */}
        <div className="md:col-span-2 flex flex-col justify-between p-6">
          <div className="pb-3 border-b border-[#27272A] flex items-center justify-between">
            <div>
              <div className="font-display text-lg font-bold uppercase text-white">
                {partnerName}
              </div>
              <div className="text-[10px] font-mono text-[#E1601B]">SECURE 1-ON-1 ENCRYPTED LINE</div>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 font-mono text-xs">
            {messages.map(m => {
              const isMine = m.sender_id === user?.id;
              return (
                <div key={m.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className="text-[9px] text-zinc-500 mb-1">
                    {m.sender_name} • {new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div
                    className={`max-w-md p-3.5 rounded-xl font-sans text-xs leading-relaxed ${
                      isMine
                        ? 'bg-[#E1601B] text-black font-medium'
                        : 'bg-[#0D0D11] border border-[#27272A] text-zinc-200'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="pt-3 border-t border-[#27272A] flex gap-2">
            <input
              type="text"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Transmit technical cue or instruction..."
              className="flex-1 bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-2 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-wider text-xs rounded transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>TRANSMIT</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
