import React, { useState } from 'react';
import { SocialDrive, UserProfile } from '../types';
import { SAMPLE_AFTER_PHOTOS } from '../data/mockData';
import confetti from 'canvas-confetti';
import {
  X,
  Upload,
  Sparkles,
  Award,
  Clock,
  Trash2,
  CheckCircle,
  Trees,
  Check,
  Archive,
} from 'lucide-react';

interface CompletionModalProps {
  drive: SocialDrive;
  currentUser: UserProfile;
  onClose: () => void;
  onCompleteDrive: (
    driveId: string,
    afterPhotoUrl: string,
    actualHours: number,
    notes: string,
    impact: { plasticKg: number; bagsFilled: number; treesPlanted: number }
  ) => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  drive,
  currentUser,
  onClose,
  onCompleteDrive,
}) => {
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string>(SAMPLE_AFTER_PHOTOS[0].url);
  const [actualHours, setActualHours] = useState<number>(drive.targetHours || 3.5);
  const [plasticKg, setPlasticKg] = useState<number>(38);
  const [bagsFilled, setBagsFilled] = useState<number>(14);
  const [treesPlanted, setTreesPlanted] = useState<number>(drive.category === 'tree_planting' ? 40 : 0);
  const [notes, setNotes] = useState<string>(
    'The team achieved a total transformation! All single-use plastics and debris cleared, area left pristine and secured.'
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setAfterPhotoUrl(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // ignore
    }

    onCompleteDrive(drive.id, afterPhotoUrl, actualHours, notes, {
      plasticKg,
      bagsFilled,
      treesPlanted,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-[6px_6px_0px_#10b981] border-2 border-stone-950 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b-2 border-stone-950 flex items-center justify-between bg-emerald-400 text-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-stone-950 text-emerald-400 flex items-center justify-center shadow-xs border-2 border-stone-950">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display text-stone-950">
                Complete Social Work & Issue Badges
              </h2>
              <p className="text-xs text-stone-900 font-sans font-medium">
                Upload verified proof photos, credit volunteer hours & seal squad chat.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-900 hover:text-stone-950 hover:bg-emerald-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFinish} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#faf9f5]">
          {/* After Photo Proof Section */}
          <div className="space-y-3 p-4 rounded-2xl bg-white border-2 border-stone-950 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-black font-display text-stone-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>After Cleaning Photo Proof (Mandatory)</span>
                </label>
                <p className="text-xs text-stone-500 font-sans">
                  Visual proof showing the transformed public area.
                </p>
              </div>
              <span className="text-[10px] font-black font-mono-code px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 sticker-badge">
                Clean Proof
              </span>
            </div>

            {/* Photo preview */}
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden border-2 border-stone-950 bg-stone-200 shadow-xs">
              <img
                src={afterPhotoUrl}
                alt="Cleaned area"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-emerald-400 text-stone-950 text-xs font-black font-mono-code border border-stone-950 shadow-xs flex items-center gap-1 sticker-badge">
                <Check className="w-3.5 h-3.5" />
                <span>Restored & Clean</span>
              </div>
            </div>

            {/* Upload or Preset Selection */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-stone-100 border-2 border-stone-950 hover:bg-stone-200 text-stone-900 text-xs font-bold font-display cursor-pointer shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Upload After Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-stone-400 font-mono-code">or quick sample:</span>

              <div className="flex items-center gap-2">
                {SAMPLE_AFTER_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAfterPhotoUrl(sample.url)}
                    className={`shrink-0 w-12 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                      afterPhotoUrl === sample.url ? 'border-stone-950 shadow-[2px_2px_0px_#10b981] scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={sample.url} alt={sample.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actual Work Hours */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
            <label className="text-xs font-extrabold font-display text-amber-950 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Actual Hours Spent on Social Work</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                value={actualHours}
                onChange={(e) => setActualHours(parseFloat(e.target.value) || 1)}
                className="w-24 text-base font-black px-3 py-1.5 rounded-xl border-2 border-amber-400 bg-white font-mono-code"
              />
              <span className="text-xs text-amber-950 font-medium font-sans">
                Hours credited to all volunteers' community service profile records.
              </span>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border-2 border-stone-200">
              <span className="text-[11px] font-bold font-mono-code text-stone-700 flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Plastic Cleared (kg)</span>
              </span>
              <input
                type="number"
                value={plasticKg}
                onChange={(e) => setPlasticKg(Number(e.target.value))}
                className="w-full text-sm font-black font-mono-code px-2.5 py-1.5 rounded-xl border-2 border-stone-300 mt-1"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-white border-2 border-stone-200">
              <span className="text-[11px] font-bold font-mono-code text-stone-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Bags Collected</span>
              </span>
              <input
                type="number"
                value={bagsFilled}
                onChange={(e) => setBagsFilled(Number(e.target.value))}
                className="w-full text-sm font-black font-mono-code px-2.5 py-1.5 rounded-xl border-2 border-stone-300 mt-1"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-white border-2 border-stone-200">
              <span className="text-[11px] font-bold font-mono-code text-stone-700 flex items-center gap-1">
                <Trees className="w-3.5 h-3.5 text-emerald-600" />
                <span>Trees Planted</span>
              </span>
              <input
                type="number"
                value={treesPlanted}
                onChange={(e) => setTreesPlanted(Number(e.target.value))}
                className="w-full text-sm font-black font-mono-code px-2.5 py-1.5 rounded-xl border-2 border-stone-300 mt-1"
              />
            </div>
          </div>

          {/* Summary Notes */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold font-display text-stone-800">Completion Summary Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border-2 border-stone-300 focus:border-stone-950 font-sans"
            />
          </div>

          {/* Badge Preview Callout */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400 text-stone-950 border-2 border-stone-950 flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs text-emerald-950 font-sans">
              <span className="font-extrabold font-display block">Verifiable Digital Badges will be generated</span>
              <span>
                All {drive.volunteersJoined.length} registered volunteers will receive an authenticated certificate with 1-click LinkedIn export.
              </span>
            </div>
          </div>

          {/* Group Chat Automatic Retirement & Archival Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start gap-2.5 text-xs text-amber-950">
            <Archive className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="font-sans">
              <span className="font-extrabold font-display block">Live Squad Chat Retirement & Vault Archival:</span>
              <span className="text-[11px] text-amber-900 leading-relaxed">
                As soon as work is officially confirmed Completed, the live group chat is completely removed from the user interface and archived into internal database storage (not available to users).
              </span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 border-t-2 border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border-2 border-stone-300 text-stone-800 text-xs font-bold font-display hover:border-stone-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-stone-950 hover:bg-emerald-400 hover:text-stone-950 text-white text-xs sm:text-sm font-black font-display shadow-[2px_2px_0px_#10b981] border-2 border-stone-950 flex items-center gap-2 active:translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Confirm Completion & Award Badges</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
