import React, { useState } from 'react';
import { InternalArchivedChatRecord } from '../types';
import { getInternalArchivedChatVault } from '../utils/chatManager';
import {
  X,
  Database,
  Lock,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Key,
} from 'lucide-react';

interface InternalChatVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InternalChatVaultModal: React.FC<InternalChatVaultModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [records, setRecords] = useState<InternalArchivedChatRecord[]>(() =>
    getInternalArchivedChatVault()
  );
  const [selectedRecord, setSelectedRecord] = useState<InternalArchivedChatRecord | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = records.filter(
    (r) =>
      r.driveTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.driveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.internalAuditHash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[6px_6px_0px_#10b981] border-2 border-stone-950 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b-2 border-stone-950 bg-stone-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-400 text-stone-950 flex items-center justify-center shadow-xs font-black border border-stone-900">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-display">
                  Internal Database Chat Archival Vault
                </h3>
                <span className="text-[10px] font-black font-mono-code px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 uppercase tracking-wider sticker-badge">
                  <Lock className="w-3 h-3" />
                  <span>Sealed from Public UI</span>
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5 font-sans">
                Live squad chat vanishes from user view on completion and is archived here internally for NGO non-profit compliance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Regulatory Banner */}
        <div className="p-3.5 bg-amber-50 border-b-2 border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed font-sans">
            <strong className="font-display font-bold">Internal Storage Compliance:</strong> The moment work is officially marked Completed, group chat is completely removed from the user interface. Transcripts are stored internally for audit and non-profit safety verification, not accessible to regular users.
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#faf9f5]">
          
          {/* Records List */}
          <div className="md:col-span-1 space-y-3 border-r-2 border-stone-200 pr-0 md:pr-4">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border-2 border-stone-200 bg-white focus:border-stone-950 font-sans"
              />
            </div>

            <div className="text-[11px] font-bold font-mono-code uppercase tracking-wider text-stone-500 flex items-center justify-between">
              <span>Archived Vaults ({filtered.length})</span>
            </div>

            {filtered.length === 0 ? (
              <div className="p-6 text-center text-stone-400 text-xs space-y-2 font-sans">
                <Database className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="font-semibold text-stone-600">No completed drive chats archived yet.</p>
                <p className="text-[10px] text-stone-400">
                  Complete any social work drive using the "Complete Work" button to witness automatic UI chat removal & internal archival.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((record) => {
                  const isSelected = selectedRecord?.driveId === record.driveId;
                  return (
                    <button
                      key={record.driveId}
                      type="button"
                      onClick={() => setSelectedRecord(record)}
                      className={`w-full text-left p-3 rounded-2xl border-2 text-xs transition-all space-y-1 ${
                        isSelected
                          ? 'border-stone-950 bg-stone-950 text-white shadow-[2px_2px_0px_#10b981]'
                          : 'border-stone-200 bg-white hover:border-stone-900 text-stone-900'
                      }`}
                    >
                      <div className="font-extrabold font-display line-clamp-1">{record.driveTitle}</div>
                      <div className={`text-[10px] flex items-center justify-between font-mono-code ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        <span>{record.totalMessagesCount} messages</span>
                        <span>{new Date(record.closedAt).toLocaleDateString()}</span>
                      </div>
                      <div className={`text-[9px] font-mono-code truncate ${isSelected ? 'text-emerald-300' : 'text-stone-400'}`}>
                        {record.internalAuditHash}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Record Detail View */}
          <div className="md:col-span-2 space-y-4">
            {selectedRecord ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border-2 border-stone-200 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono-code text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-bold border border-emerald-300">
                      {selectedRecord.internalAuditHash}
                    </span>
                    <span className="text-[10px] text-stone-500 flex items-center gap-1 font-mono-code">
                      <Clock className="w-3 h-3" />
                      <span>Closed: {new Date(selectedRecord.closedAt).toLocaleString()}</span>
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-stone-950 font-display">
                    {selectedRecord.driveTitle}
                  </h4>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono-code">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                      <div className="text-[10px] text-stone-400 font-bold uppercase">Messages</div>
                      <div className="text-sm font-black text-stone-900">
                        {selectedRecord.totalMessagesCount}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                      <div className="text-[10px] text-stone-400 font-bold uppercase">Participants</div>
                      <div className="text-sm font-black text-stone-900">
                        {selectedRecord.participantsCount}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                      <div className="text-[10px] text-stone-400 font-bold uppercase">User UI Access</div>
                      <div className="text-xs font-black text-rose-600">
                        Removed (0)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sealed Transcript Inspection */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-stone-800 flex items-center justify-between font-display">
                    <span>Internal Audit Transcript</span>
                    <span className="text-[10px] text-stone-500 font-mono-code font-normal">
                      Stored in compliance table (unexposed to user)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-950 text-stone-200 font-mono-code text-xs max-h-72 overflow-y-auto space-y-2.5 border-2 border-stone-900 shadow-inner">
                    {selectedRecord.encryptedTranscriptPayload.map((msg) => (
                      <div key={msg.id} className="border-b border-stone-800 pb-2 last:border-0">
                        <div className="flex items-center justify-between text-[10px] text-stone-400 mb-0.5">
                          <span className="text-emerald-400 font-bold">
                            {msg.senderName} ({msg.senderRole || 'Member'})
                          </span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-stone-300 font-sans text-xs">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-stone-400">
                <FileText className="w-12 h-12 text-stone-300" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-stone-700 font-display">Select an Internal Record</h4>
                  <p className="text-xs max-w-sm text-stone-400 font-sans">
                    Select an archived drive from the left panel to verify its sealed transcript and database audit hash.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CleanMeet Data Archival & Non-Profit Integrity Standard</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold font-display shadow-[2px_2px_0px_#10b981] border-2 border-stone-950 transition-all"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
