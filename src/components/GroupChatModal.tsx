import React, { useState, useEffect, useRef } from 'react';
import { SocialDrive, UserProfile, ChatMessage, GroupChatRoom } from '../types';
import {
  getActiveGroupChats,
  sendMessageToDriveChat,
  isDriveChatActive,
} from '../utils/chatManager';
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  Clock,
  Users,
  AlertCircle,
  Sparkles,
  Lock,
  Archive,
  CheckCheck,
  UserCheck,
  MapPin,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface GroupChatModalProps {
  drive: SocialDrive;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenInternalVault?: () => void;
}

export const GroupChatModal: React.FC<GroupChatModalProps> = ({
  drive,
  currentUser,
  isOpen,
  onClose,
  onOpenInternalVault,
}) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRetired, setIsRetired] = useState(drive.status === 'completed');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat for this drive
  const loadChat = () => {
    const isCompleted = drive.status === 'completed';
    setIsRetired(isCompleted);

    if (isCompleted) {
      // Completed drives have their live chat removed from user interface
      setMessages([]);
      return;
    }

    const activeChats = getActiveGroupChats();
    const currentChat = activeChats[drive.id];
    if (currentChat) {
      setMessages([...currentChat.messages]);
    } else {
      setMessages([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadChat();
    }
  }, [isOpen, drive.id, drive.status]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && !isRetired) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isRetired]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isRetired) return;

    const userRole =
      drive.organizer.id === currentUser.id
        ? 'Organizer & Lead'
        : currentUser.name === drive.womenSafety.safetyLeadName
        ? 'Women Safety Lead'
        : 'Volunteer';

    const updated = sendMessageToDriveChat(
      drive.id,
      currentUser,
      inputText.trim(),
      userRole
    );

    if (updated) {
      setMessages([...updated.messages]);
      setInputText('');
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isRetired) return;
    setInputText(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-stone-950/60 backdrop-blur-xs transition-all duration-200">
      <div className="bg-white w-full sm:w-[490px] h-[90vh] sm:h-[670px] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-[6px_6px_0px_#10b981] border-2 border-stone-950 flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-right duration-200 font-sans">
        
        {/* Chat Header */}
        <div className="p-4 border-b-2 border-stone-950 bg-stone-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-emerald-400 text-stone-950 flex items-center justify-center shadow-xs font-black border border-stone-900">
                <MessageSquare className="w-5 h-5" />
              </div>
              {!isRetired && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-stone-950 rounded-full animate-ping" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-white font-display line-clamp-1 max-w-[240px]">
                  {drive.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                {!isRetired ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold font-mono-code text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>LIVE SQUAD CHAT ({drive.volunteersJoined.length} members)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono-code text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3 text-stone-400" />
                    <span>SEALED IN DATABASE</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safety & Protocol Banner */}
        {!isRetired ? (
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-[11px] text-emerald-950 flex items-center justify-between gap-2 shrink-0 font-sans">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                Safety Lead: <strong className="font-display font-bold">{drive.womenSafety.safetyLeadName}</strong> ({drive.womenSafety.safetyLeadContact})
              </span>
            </div>
            <span className="text-[10px] text-stone-950 font-black font-mono-code bg-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400 shrink-0 sticker-badge">
              Daylight
            </span>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border-b-2 border-amber-200 text-xs text-amber-950 flex items-start gap-2 shrink-0">
            <Archive className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold font-display">Chat Removed & Sealed into Internal Storage</div>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed font-sans">
                Per CleanMeet safety compliance, once social work is Completed, the squad chat is deleted from the public view and locked into the internal non-profit audit database.
              </p>
            </div>
          </div>
        )}

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fdfcf9]">
          {isRetired ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 border-2 border-stone-300 text-stone-700 flex items-center justify-center shadow-xs">
                <Lock className="w-8 h-8 text-stone-500" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="text-base font-black text-stone-900 font-display">
                  Work Completed — Live Chat Sealed
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  The social work initiative is officially completed. Group chat has been permanently removed from user access and archived into the internal vault.
                </p>
              </div>

              {onOpenInternalVault && (
                <button
                  type="button"
                  onClick={onOpenInternalVault}
                  className="mt-2 text-xs font-bold px-4 py-2.5 rounded-2xl bg-stone-950 text-white hover:bg-stone-800 shadow-[2px_2px_0px_#10b981] flex items-center gap-2 transition-all font-display border-2 border-stone-950"
                >
                  <Archive className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Inspect Internal Vault</span>
                </button>
              )}
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-stone-400">
              <MessageSquare className="w-10 h-10 text-stone-300" />
              <p className="text-xs font-medium font-sans">No messages yet. Say hi to coordinate meeting at the spot!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUser.id;
              const isSystem = msg.isSystemNotice;

              if (isSystem) {
                return (
                  <div
                    key={msg.id}
                    className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 text-[11px] space-y-1 my-2 shadow-xs"
                  >
                    <div className="flex items-center gap-1.5 font-black text-emerald-900 font-display">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{msg.senderName}</span>
                      <span className="text-[10px] text-emerald-700 font-mono-code font-normal ml-auto">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-emerald-900 leading-relaxed font-medium font-sans">
                      {msg.text}
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    isCurrentUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isCurrentUser && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-xl object-cover shrink-0 mt-0.5 border border-stone-300 shadow-xs"
                    />
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 text-xs shadow-xs ${
                      isCurrentUser
                        ? 'bg-stone-950 text-white rounded-tr-xs border border-emerald-500/30'
                        : 'bg-white border-2 border-stone-200 text-stone-900 rounded-tl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-black text-[11px] font-display truncate ${
                            isCurrentUser ? 'text-emerald-300' : 'text-stone-950'
                          }`}
                        >
                          {isCurrentUser ? 'You' : msg.senderName}
                        </span>
                        {msg.senderRole && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold font-mono-code uppercase tracking-wider ${
                              isCurrentUser
                                ? 'bg-white/10 text-emerald-300'
                                : 'bg-stone-100 text-stone-700 border border-stone-200'
                            }`}
                          >
                            {msg.senderRole}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[9px] font-mono-code ${
                          isCurrentUser ? 'text-stone-400' : 'text-stone-400'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap break-words font-medium font-sans">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions & Input (Hidden if Completed / Retired) */}
        {!isRetired ? (
          <div className="p-3.5 border-t-2 border-stone-200 bg-white space-y-2.5 shrink-0">
            {/* Quick action chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              <button
                type="button"
                onClick={() => handleQuickPrompt("I've arrived at the spot!")}
                className="shrink-0 px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold border border-stone-200 transition-colors font-mono-code"
              >
                📍 Arrived at spot
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Bringing extra trash bags & gloves!')}
                className="shrink-0 px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold border border-stone-200 transition-colors font-mono-code"
              >
                🧤 Bringing extra kits
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Safety buddy check-in: ready to start!')}
                className="shrink-0 px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold border border-stone-200 transition-colors font-mono-code"
              >
                🛡️ Safety check-in
              </button>
            </div>

            {/* Input row */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a coordination message..."
                className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border-2 border-stone-300 focus:outline-hidden focus:border-stone-950 font-medium bg-stone-50 focus:bg-white font-sans"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`p-3 rounded-2xl text-stone-950 border-2 border-stone-950 font-black shadow-[2px_2px_0px_#000] transition-all ${
                  inputText.trim()
                    ? 'bg-emerald-400 hover:bg-emerald-300 active:translate-y-0.5'
                    : 'bg-stone-200 text-stone-400 border-stone-300 shadow-none cursor-not-allowed'
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1 font-mono-code">
              <Lock className="w-3 h-3 text-stone-400" />
              <span>
                Chat auto-seals into internal vault as soon as work is marked Done.
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t-2 border-stone-200 bg-stone-100 text-center text-xs text-stone-500 font-mono-code">
            Chat inputs disabled — work officially completed.
          </div>
        )}
      </div>
    </div>
  );
};
