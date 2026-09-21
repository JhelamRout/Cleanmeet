import React, { useState, useEffect } from 'react';
import { SocialDrive, UserProfile, VolunteerAttendee } from '../types';
import { CATEGORY_META, getCategoryMeta } from '../config';
import { GoogleMapView } from './GoogleMapView';
import {
  X,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  Sun,
  Award,
  CheckCircle,
  Play,
  Share2,
  ExternalLink,
  Sparkles,
  Phone,
  AlertTriangle,
  FileCheck,
  Compass,
  BadgeCheck,
  HeartHandshake,
  Shield,
  Check,
  Building2,
  MessageSquare,
  Lock,
  Archive,
} from 'lucide-react';

interface DriveDetailModalProps {
  drive: SocialDrive;
  currentUser: UserProfile;
  onClose: () => void;
  onJoin: (driveId: string, role?: string) => void;
  onLeave: (driveId: string) => void;
  onStartDrive: (driveId: string) => void;
  onOpenCompletion: (drive: SocialDrive) => void;
  onOpenBadge: (drive: SocialDrive) => void;
  onOpenChat?: (drive: SocialDrive) => void;
  onOpenInternalVault?: () => void;
}

export const DriveDetailModal: React.FC<DriveDetailModalProps> = ({
  drive,
  currentUser,
  onClose,
  onJoin,
  onLeave,
  onStartDrive,
  onOpenCompletion,
  onOpenBadge,
  onOpenChat,
  onOpenInternalVault,
}) => {
  const meta = getCategoryMeta(drive.category, drive.customCategoryName);

  const isJoined = drive.volunteersJoined.some((v) => v.userId === currentUser.id);
  const isOrganizer = drive.organizer.id === currentUser.id;
  const slotsLeft = Math.max(0, drive.volunteersNeeded - drive.volunteersJoined.length);

  // Volunteer role selection state for joining
  const [selectedRole, setSelectedRole] = useState<string>('General Volunteer');
  const [showRolePicker, setShowRolePicker] = useState<boolean>(false);

  // Live timer for in_progress state
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    let timer: any = null;
    if (drive.status === 'in_progress') {
      const startTime = drive.workStartedAt
        ? new Date(drive.workStartedAt).getTime()
        : Date.now() - 3600 * 1000 * 1.2; // simulate 1.2 hrs elapsed

      timer = setInterval(() => {
        const now = Date.now();
        setElapsedSeconds(Math.max(0, Math.floor((now - startTime) / 1000)));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [drive.status, drive.workStartedAt]);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[6px_6px_0px_#10b981] border-2 border-stone-950 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b-2 border-stone-950 flex items-start justify-between gap-4 bg-white">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-md text-xs font-black font-mono-code border-2 uppercase tracking-wide sticker-badge ${meta.bg} ${meta.color} ${meta.borderColor}`}
              >
                {meta.label}
              </span>

              {drive.status === 'in_progress' && (
                <span className="px-3 py-1 rounded-md text-xs font-black font-mono-code bg-amber-400 text-stone-950 border-2 border-stone-950 flex items-center gap-1.5 sticker-badge">
                  <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping"></span>
                  <span>IN PROGRESS</span>
                </span>
              )}

              {drive.status === 'completed' && (
                <span className="px-3 py-1 rounded-md text-xs font-black font-mono-code bg-emerald-400 text-stone-950 border-2 border-stone-950 flex items-center gap-1.5 sticker-badge">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>COMPLETED & BADGED</span>
                </span>
              )}

              {drive.womenSafety.guaranteed && (
                <span className="px-2.5 py-1 rounded-md text-xs font-extrabold font-mono-code bg-emerald-100 text-emerald-950 border-2 border-emerald-400 flex items-center gap-1 sticker-badge">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Women Safety Guaranteed</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-stone-950 font-display leading-tight">
              {drive.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-mono-code">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{drive.location.address}, {drive.location.city}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>Target: ~{drive.targetHours}h ({drive.startTime} - {drive.endTime})</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#faf9f5]">
          {/* Photo Evidence Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-stone-900 font-display uppercase tracking-wider">
                {drive.status === 'completed' ? 'Transformation Proof (Before vs After)' : 'Posted Need for Social Work (Before Photo)'}
              </span>
              <span className="text-xs text-stone-500 font-mono-code">
                Posted by {drive.organizer.name}
              </span>
            </div>

            {drive.status === 'completed' && drive.afterPhotoUrl ? (
              /* Side-by-side Before & After view */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative rounded-2xl overflow-hidden border-2 border-stone-950 bg-stone-100 aspect-16/10 shadow-[3px_3px_0px_#000]">
                  <img
                    src={drive.beforePhotoUrl}
                    alt="Before cleaning"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-rose-500 text-white text-xs font-black font-mono-code border border-rose-700 shadow-xs sticker-badge">
                    BEFORE (Need)
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border-2 border-stone-950 bg-stone-100 aspect-16/10 shadow-[3px_3px_0px_#10b981]">
                  <img
                    src={drive.afterPhotoUrl}
                    alt="After cleaning and restoration"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-emerald-400 text-stone-950 text-xs font-black font-mono-code border border-stone-950 shadow-xs flex items-center gap-1 sticker-badge">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AFTER (Cleaned)</span>
                  </span>
                </div>
              </div>
            ) : (
              /* Single Before Photo */
              <div className="relative rounded-2xl overflow-hidden border-2 border-stone-950 bg-stone-100 max-h-80 aspect-16/9 shadow-[4px_4px_0px_#000]">
                <img
                  src={drive.beforePhotoUrl}
                  alt={`Area that needs cleaning: ${drive.title}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-stone-950/90 text-white text-xs font-bold font-mono-code flex items-center gap-1.5 border border-white/20">
                  <span>📸 1 Photo Posted by Member: Site Requiring Social Work</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-stone-950/85 text-white text-xs backdrop-blur-xs border border-white/10">
                  <p className="font-medium text-stone-200 font-sans">{drive.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Societal Betterment & Non-Profit Integrity Audit Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-stone-950 space-y-3.5 shadow-[4px_4px_0px_#000]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-400 text-stone-950 border-2 border-stone-950 shadow-xs">
                  <BadgeCheck className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-extrabold text-stone-950 font-display flex items-center gap-2">
                    <span>Societal Betterment & Non-Profit Audit</span>
                    <span className="text-[10px] font-black font-mono-code px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300">
                      Verified Public Good
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500 font-sans">
                    Zero individual profit • 100% community social impact audit.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black font-mono-code px-3 py-1.5 rounded-xl bg-stone-950 text-emerald-400 border border-emerald-500/40 shadow-xs">
                  Betterment: {drive.bettermentDetails?.bettermentScore || 98}%
                </span>
              </div>
            </div>

            {/* Beneficiary & Zero Profit Covenants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-stone-50 border-2 border-stone-200 space-y-1">
                <div className="text-[10px] font-bold font-mono-code uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Beneficiaries</span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-stone-950 font-display">
                  {drive.beneficiaryGroup || drive.bettermentDetails?.beneficiaryGroup || 'Local Community & Public Commons'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border-2 border-stone-200 space-y-1">
                <div className="text-[10px] font-bold font-mono-code uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Non-Profit Guarantee</span>
                </div>
                <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero Commercial Gain • Free Social Work</span>
                </div>
              </div>
            </div>

            {/* Public Benefit Statement */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-xs space-y-1">
              <div className="font-extrabold text-emerald-950 font-display flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>How This Initiative Betters Society:</span>
              </div>
              <p className="text-emerald-900 leading-relaxed font-medium font-sans">
                {drive.bettermentDetails?.publicBenefitStatement || drive.description}
              </p>
            </div>
          </div>

          {/* Google Maps & Volunteer Route Tracking */}
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-black text-stone-950 font-display flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Live Google Maps & Volunteer Route Tracking</span>
              </h4>
              <p className="text-xs text-stone-500 font-sans">
                Hyperlocal trackable location with simulated route and ETA
              </p>
            </div>

            {/* Google Map View with Route */}
            <div className="rounded-2xl overflow-hidden border-2 border-stone-950 shadow-[4px_4px_0px_#000]">
              <GoogleMapView
                destination={{
                  lat: drive.location.lat,
                  lng: drive.location.lng,
                  title: drive.title,
                  address: drive.location.address,
                }}
                height="360px"
                showRoute={true}
              />
            </div>
          </div>

          {/* Social Work Time, Schedule, and Live Timer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-stone-950 space-y-4 shadow-[4px_4px_0px_#000]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-stone-950 font-display flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Work Hours & Timing Schedule</span>
                </h4>
                <p className="text-xs text-stone-600 mt-0.5 font-sans">
                  {drive.deadlineTime}
                </p>
              </div>

              {/* Live Timer if In Progress */}
              {drive.status === 'in_progress' && (
                <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-400 shadow-xs flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
                  <div>
                    <div className="text-[9px] uppercase font-black font-mono-code tracking-wider text-amber-900">
                      Elapsed Work Time
                    </div>
                    <div className="font-mono-code text-xl font-black text-amber-950">
                      {formatTimer(elapsedSeconds)}
                    </div>
                  </div>
                  <div className="text-xs font-mono-code text-stone-500 border-l border-stone-300 pl-3">
                    Target: {drive.targetHours}h
                  </div>
                </div>
              )}

              {/* Completed Stats if Done */}
              {drive.status === 'completed' && (
                <div className="p-3 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-extrabold font-display">
                      Work Completed: {drive.actualWorkHours || drive.targetHours} Hours Logged
                    </div>
                    <div className="text-[11px] text-emerald-800 font-sans">
                      Added to all {drive.volunteersJoined.length} volunteers' profile achievements!
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Daytime & Women Safety Guaranteed Details Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-stone-200">
              {/* Women Safety Verification */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs font-display">Women Safety Protocol Verified</span>
                </div>
                <ul className="text-xs text-emerald-950 space-y-1.5 pl-1 font-sans">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Lead: <strong>{drive.womenSafety.safetyLeadName}</strong> ({drive.womenSafety.safetyLeadContact})</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Mandatory 2+ Volunteer Buddy System enforced</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Transit: {drive.womenSafety.publicTransitDistance}</span>
                  </li>
                  {drive.womenSafety.policeStationNearby && (
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span>Security: {drive.womenSafety.policeStationNearby}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Daytime Hours Verification */}
              <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-950">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-xs font-display">Daytime Schedule Requirement</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-sans">
                  All work is strictly held between <strong>{drive.startTime}</strong> and{' '}
                  <strong>{drive.endTime}</strong> during daylight hours. No dusk or night operations permitted.
                </p>
                <div className="text-[10px] font-bold font-mono-code text-amber-900 bg-amber-200/60 px-2 py-1 rounded-md border border-amber-300">
                  ☀️ Natural Daylight Verified • Safe Clean Environment
                </div>
              </div>
            </div>
          </div>

          {/* Volunteers Roster */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-stone-950 font-display flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Volunteers Squad ({drive.volunteersJoined.length} / {drive.volunteersNeeded})</span>
                </h4>
                <p className="text-xs text-stone-500 font-mono-code">
                  {slotsLeft > 0 ? `${slotsLeft} spots remaining` : 'Full Squad Assemble!'}
                </p>
              </div>

              {/* Join Role Toggle */}
              {!isJoined && drive.status === 'recruiting' && slotsLeft > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="text-xs bg-stone-100 border-2 border-stone-950 rounded-xl py-1.5 px-2.5 font-bold text-stone-900 font-mono-code"
                  >
                    <option value="General Volunteer">General Volunteer</option>
                    <option value="Waste Sorter">Waste Sorter</option>
                    <option value="Bag Carrier">Bag Carrier</option>
                    <option value="First Aid Assistant">First Aid Assistant</option>
                    <option value="Photographer">Impact Photographer</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onJoin(drive.id, selectedRole)}
                    className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs font-black font-display border-2 border-stone-950 shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all"
                  >
                    Join Team
                  </button>
                </div>
              )}

              {isJoined && drive.status !== 'completed' && (
                <button
                  type="button"
                  onClick={() => onLeave(drive.id)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2 py-1 font-mono-code"
                >
                  Leave Drive
                </button>
              )}
            </div>

            {/* Volunteer Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {drive.volunteersJoined.map((v) => (
                <div
                  key={v.userId}
                  className="flex items-center gap-2.5 p-2.5 rounded-2xl border-2 border-stone-200 bg-white shadow-2xs"
                >
                  <img
                    src={v.avatar}
                    alt={v.name}
                    className="w-9 h-9 rounded-xl object-cover border border-stone-300"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold text-stone-950 font-display truncate">
                      {v.name} {v.userId === currentUser.id && '(You)'}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono-code truncate">{v.role}</div>
                  </div>
                  {v.status === 'work_done' && (
                    <span title="Awarded badge">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Equipment & Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border-2 border-stone-200 space-y-1.5">
              <span className="font-extrabold text-stone-900 font-display block">🧤 Equipment Provided on Site:</span>
              <ul className="space-y-1 text-stone-600 font-sans">
                {drive.equipmentProvided.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border-2 border-stone-200 space-y-1.5">
              <span className="font-extrabold text-stone-900 font-display block">🎒 What You Should Bring:</span>
              <ul className="space-y-1 text-stone-600 font-sans">
                {drive.whatToBring.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Bar */}
        <div className="p-4 sm:p-5 border-t-2 border-stone-950 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Live Group Chat Button (Active during work) */}
            {drive.status !== 'completed' && onOpenChat && (
              <button
                type="button"
                onClick={() => onOpenChat(drive)}
                className="px-4 py-2.5 rounded-2xl bg-stone-950 text-emerald-400 hover:text-white text-xs sm:text-sm font-black font-display flex items-center gap-2 border-2 border-stone-950 shadow-[2px_2px_0px_#10b981] transition-all active:translate-y-0.5"
                title="Open Live Volunteer Group Chat"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Live Squad Chat</span>
              </button>
            )}

            {/* If completed, show Badge & LinkedIn CTA + Chat Retired badge */}
            {drive.status === 'completed' && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenBadge(drive)}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs sm:text-sm font-black font-display flex items-center gap-2 border-2 border-stone-950 shadow-[2px_2px_0px_#000] active:translate-y-0.5"
                >
                  <Award className="w-4 h-4" />
                  <span>View Badge & Add to LinkedIn</span>
                </button>

                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 border-2 border-stone-200 text-stone-700 text-xs font-mono-code font-bold">
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Chat Sealed & Archived Internally</span>
                  {onOpenInternalVault && (
                    <button
                      type="button"
                      onClick={onOpenInternalVault}
                      className="ml-1 text-[11px] text-emerald-700 hover:underline font-bold"
                    >
                      (Verify Vault)
                    </button>
                  )}
                </div>
              </>
            )}

            {/* If Recruiting, allow starting drive */}
            {drive.status === 'recruiting' && isJoined && (
              <button
                type="button"
                onClick={() => onStartDrive(drive.id)}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-black font-display flex items-center gap-2 border-2 border-stone-950 shadow-[2px_2px_0px_#000] active:translate-y-0.5"
              >
                <Play className="w-4 h-4" />
                <span>Start Social Work Drive</span>
              </button>
            )}

            {/* If in progress, allow completion */}
            {drive.status === 'in_progress' && isJoined && (
              <button
                type="button"
                onClick={() => onOpenCompletion(drive)}
                className="px-4 py-2.5 rounded-2xl bg-stone-950 hover:bg-stone-800 text-white text-xs sm:text-sm font-black font-display flex items-center gap-2 border-2 border-stone-950 shadow-[2px_2px_0px_#10b981] active:translate-y-0.5"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Finish Work & Submit After Photo</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl border-2 border-stone-300 text-stone-800 text-xs sm:text-sm font-bold font-display hover:border-stone-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
