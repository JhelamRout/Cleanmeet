import React from 'react';
import { SocialDrive, UserProfile } from '../types';
import { CATEGORY_META, getCategoryMeta } from '../config';
import { calculateDistanceKm } from '../utils/geo';
import {
  MapPin,
  Users,
  Clock,
  ShieldCheck,
  Sun,
  ArrowRight,
  CheckCircle,
  Navigation,
  Compass,
  BadgeCheck,
  HeartHandshake,
  MessageSquare,
  Lock,
} from 'lucide-react';

interface DriveCardProps {
  drive: SocialDrive;
  currentUser: UserProfile;
  onSelectDrive: (drive: SocialDrive) => void;
  onQuickJoin: (driveId: string) => void;
  onOpenChat?: (drive: SocialDrive) => void;
}

export const DriveCard: React.FC<DriveCardProps> = ({
  drive,
  currentUser,
  onSelectDrive,
  onQuickJoin,
  onOpenChat,
}) => {
  const isJoined = drive.volunteersJoined.some((v) => v.userId === currentUser.id);
  const slotsLeft = Math.max(0, drive.volunteersNeeded - drive.volunteersJoined.length);
  const percentFilled = Math.min(
    100,
    Math.round((drive.volunteersJoined.length / drive.volunteersNeeded) * 100)
  );

  const userCoords = currentUser.locationCoords || {
    lat: 19.0596,
    lng: 72.8295,
  };

  const distanceKm = calculateDistanceKm(
    userCoords.lat,
    userCoords.lng,
    drive.location.lat,
    drive.location.lng
  );

  const userRadius = currentUser.searchRadiusKm || 20;
  const isWithinRadius = distanceKm <= userRadius;

  const meta = getCategoryMeta(drive.category, drive.customCategoryName);

  return (
    <div className="group bg-white rounded-3xl border-2 border-stone-900/10 hover:border-stone-950 transition-all duration-300 overflow-hidden flex flex-col aesthetic-card">
      {/* 1 Photo Posted by Creator showing place needing cleaning */}
      <div className="relative aspect-16/10 w-full bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onSelectDrive(drive)}>
        <img
          src={drive.beforePhotoUrl}
          alt={`Place needing work: ${drive.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Category Pill */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold font-display backdrop-blur-md shadow-xs border ${meta.bg} ${meta.color} ${meta.borderColor} sticker-badge`}
          >
            <span>{meta.label}</span>
          </span>

          {/* Status Badge */}
          {drive.status === 'in_progress' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black font-mono-code bg-amber-400 text-stone-950 shadow-xs border border-stone-900 sticker-badge animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>LIVE NOW</span>
            </span>
          ) : drive.status === 'completed' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black font-mono-code bg-emerald-400 text-stone-950 shadow-xs border border-stone-900 sticker-badge">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>DONE & BADGED</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono-code bg-white/95 backdrop-blur-xs text-stone-900 shadow-xs border border-stone-200">
              <span>{slotsLeft} slots open</span>
            </span>
          )}
        </div>

        {/* Photo Evidence Stamp (Mandatory 1 Photo requirement) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-xs text-[10px] font-mono-code font-bold text-emerald-300 mb-1 border border-white/10">
              📸 1 PHOTO EVIDENCE POSTED
            </div>
            <p className="text-xs text-stone-200 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-xs">{drive.location.landmark || drive.location.address}</span>
            </p>
          </div>

          {/* Quick Route button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectDrive(drive);
            }}
            className="p-2 rounded-xl bg-white hover:bg-emerald-400 text-stone-950 shadow-md transition-all hover:scale-105 active:scale-95 border border-stone-900/20"
            title="Track route on Google Maps"
          >
            <Navigation className="w-4 h-4 text-stone-950" />
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Proximity & Distance Badge */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold font-mono-code px-2.5 py-0.5 rounded-full border ${
                isWithinRadius
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                  : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              <Compass className="w-3 h-3 text-emerald-600" />
              <span>{distanceKm} km away</span>
              {isWithinRadius && (
                <span className="text-[10px] text-emerald-700 font-semibold">• IN ZONE</span>
              )}
            </span>

            {isWithinRadius && (
              <span className="text-[10px] font-black font-mono-code uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                Ready to Join
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectDrive(drive)}
            className="font-extrabold text-stone-950 text-base sm:text-lg leading-snug group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2 font-display"
          >
            {drive.title}
          </h3>

          {/* Non-Profit & Societal Betterment Audit Badge */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-900 border border-stone-200 font-mono-code font-bold">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Zero Cap • {drive.bettermentDetails?.bettermentScore || 98}% Public Good</span>
            </span>

            {drive.beneficiaryGroup && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50/70 text-emerald-900 border border-emerald-200/60 font-semibold truncate max-w-[200px]">
                <HeartHandshake className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">For {drive.beneficiaryGroup}</span>
              </span>
            )}
          </div>

          {/* Description snippet */}
          <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed font-sans">
            {drive.description}
          </p>

          {/* Key Constraints & Commitments: Women Safety & Daytime */}
          <div className="mt-3.5 grid grid-cols-2 gap-2">
            {/* Women Safety Guaranteed */}
            {drive.womenSafety.guaranteed && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-[11px] leading-tight font-bold">
                  <span>Safe Squad</span>
                  <div className="text-[10px] text-emerald-700 font-normal">
                    Verified Lead
                  </div>
                </div>
              </div>
            )}

            {/* Daytime Scheduled */}
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
              <Sun className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-[11px] leading-tight font-bold">
                <span>Daylight Only</span>
                <div className="text-[10px] text-amber-800 font-normal font-mono-code">
                  {drive.startTime}-{drive.endTime}
                </div>
              </div>
            </div>
          </div>

          {/* Duration and Deadline */}
          <div className="mt-3 text-xs text-stone-600 flex items-center justify-between border-t border-stone-100 pt-2.5 font-sans">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-stone-700">~{drive.targetHours}h commitment</span>
            </div>
            <span className="text-[11px] text-stone-500 font-mono-code">
              {drive.deadlineTime}
            </span>
          </div>

          {/* Volunteers Needed Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-stone-800 flex items-center gap-1 font-sans">
                <Users className="w-3.5 h-3.5 text-stone-500" />
                <span>{drive.volunteersJoined.length}/{drive.volunteersNeeded} volunteers</span>
              </span>
              <span className="text-[11px] font-extrabold font-mono-code text-emerald-700">
                {percentFilled >= 100 ? 'TEAM FULL' : `${slotsLeft} LEFT`}
              </span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full transition-all duration-300"
                style={{ width: `${percentFilled}%` }}
              ></div>
            </div>

            {/* Volunteer Avatars Stack */}
            <div className="flex items-center justify-between mt-2.5">
              <div className="flex -space-x-2 overflow-hidden">
                {drive.volunteersJoined.slice(0, 4).map((vol) => (
                  <img
                    key={vol.userId}
                    className="inline-block h-6 w-6 rounded-lg ring-2 ring-white object-cover shadow-xs"
                    src={vol.avatar}
                    alt={vol.name}
                    title={`${vol.name} (${vol.role})`}
                  />
                ))}
                {drive.volunteersJoined.length > 4 && (
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-lg bg-stone-900 ring-2 ring-white text-[10px] font-extrabold font-mono-code text-white">
                    +{drive.volunteersJoined.length - 4}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-500 font-medium">
                Lead: <strong className="text-stone-800">{drive.organizer.name.split(' ')[0]}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectDrive(drive)}
            className="flex-1 py-2.5 px-3 rounded-2xl border-2 border-stone-200 hover:border-stone-900 hover:bg-stone-50 text-xs font-bold text-stone-900 flex items-center justify-center gap-1.5 transition-all font-display"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Map & Info</span>
          </button>

          {/* Group Chat Button - Active during work, removed upon completion */}
          {drive.status !== 'completed' && onOpenChat && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat(drive);
              }}
              className="py-2.5 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs font-extrabold flex items-center justify-center gap-1 transition-all font-display shadow-xs"
              title="Open Live Volunteer Group Chat"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>Chat</span>
            </button>
          )}

          {drive.status !== 'completed' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickJoin(drive.id);
              }}
              disabled={isJoined || percentFilled >= 100}
              className={`py-2.5 px-4 rounded-2xl text-xs font-extrabold font-display flex items-center justify-center gap-1 transition-all ${
                isJoined
                  ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-300 cursor-default'
                  : percentFilled >= 100
                  ? 'bg-stone-100 text-stone-400 border-2 border-stone-200 cursor-not-allowed'
                  : 'bg-stone-950 hover:bg-emerald-500 hover:text-stone-950 text-white shadow-[2px_2px_0px_#10b981] active:translate-y-0.5 border-2 border-stone-950'
              }`}
            >
              {isJoined ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Joined</span>
                </>
              ) : (
                <>
                  <span>Join Squad</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}

          {drive.status === 'completed' && (
            <div className="flex items-center gap-2">
              <span
                title="Live group chat was removed upon work completion and archived into internal database"
                className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono-code font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-2 rounded-xl"
              >
                <Lock className="w-3 h-3 text-stone-400" />
                <span>Chat Sealed</span>
              </span>

              <button
                type="button"
                onClick={() => onSelectDrive(drive)}
                className="py-2.5 px-3.5 rounded-2xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold font-display flex items-center gap-1 shadow-xs"
              >
                <span>Badges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
