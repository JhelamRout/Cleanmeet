import React, { useState } from 'react';
import { SocialDrive, UserProfile, AwardedBadge } from '../types';
import {
  X,
  Award,
  Share2,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  HeartHandshake,
  Download,
} from 'lucide-react';

interface BadgeCertificateModalProps {
  drive: SocialDrive;
  currentUser: UserProfile;
  badge?: AwardedBadge;
  onClose: () => void;
}

export const BadgeCertificateModal: React.FC<BadgeCertificateModalProps> = ({
  drive,
  currentUser,
  badge,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const hoursLogged = drive.actualWorkHours || drive.targetHours || 3.5;
  const credentialId =
    badge?.credentialId || `CM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const badgeTitle =
    badge?.badgeTitle ||
    (drive.category === 'tree_planting'
      ? 'Urban Planter Star (Gold)'
      : drive.category === 'plastic_cleanup'
      ? 'Eco Warrior Gold (Plastic Clearance)'
      : 'Community Service Champion');

  const shareText = `I just contributed ${hoursLogged} hours of local social work on "${drive.title}" via CleanMeet! My verified community badge is issued. #CleanMeet #ClimateAction #CommunityService`;

  // Official LinkedIn Add-to-Profile URL
  const linkedInAddUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
    badgeTitle
  )}&organizationName=${encodeURIComponent(
    'CleanMeet Community Action Network'
  )}&issueYear=2026&issueMonth=9&certUrl=${encodeURIComponent(
    window.location.href
  )}&certId=${encodeURIComponent(credentialId)}`;

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(window.location.href)}`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    shareText + ' ' + window.location.href
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `CleanMeet Verified Community Service Badge: ${badgeTitle} awarded to ${currentUser.name} | Credential ID: ${credentialId}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-[6px_6px_0px_#10b981] border-2 border-stone-950 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-stone-950 flex items-center justify-between bg-emerald-400 text-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-950 text-emerald-400 border-2 border-stone-950 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black font-display text-stone-950">
                Verified Community Service Badge
              </h3>
              <p className="text-xs text-stone-900 font-sans font-medium">Official Social Work Achievement Certificate</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-900 hover:text-stone-950 hover:bg-emerald-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Display Card */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#faf9f5]">
          <div className="relative rounded-3xl p-6 sm:p-8 bg-white border-2 border-stone-950 shadow-[4px_4px_0px_#000] text-stone-950 overflow-hidden">
            {/* Header / Seal */}
            <div className="flex items-center justify-between border-b-2 border-stone-200 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-400 text-stone-950 border-2 border-stone-950 flex items-center justify-center font-bold text-sm shadow-2xs">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black tracking-wider uppercase text-emerald-900 font-display">
                    CleanMeet Community Action
                  </span>
                  <div className="text-[10px] text-stone-500 font-mono-code">National Volunteer Recognition Registry</div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block font-mono-code">
                  Credential ID
                </span>
                <span className="font-mono-code text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  {credentialId}
                </span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-3 py-2">
              <span className="text-[10px] uppercase tracking-widest font-extrabold font-mono-code text-stone-400">
                ★ This is proudly awarded to ★
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight font-display">
                {currentUser.name}
              </h2>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-400 text-stone-950 border-2 border-stone-950 font-black font-display text-xs sm:text-sm shadow-[2px_2px_0px_#000] sticker-badge">
                <Award className="w-4 h-4 text-stone-950" />
                <span>{badgeTitle}</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed pt-1 font-sans">
                In recognition of dedicated community social work on{' '}
                <strong className="text-stone-950 font-display">"{drive.title}"</strong>, successfully completing verified site restoration and public waste remediation.
              </p>
            </div>

            {/* Impact Details Grid */}
            <div className="grid grid-cols-3 gap-2 py-4 my-3 border-y-2 border-stone-200 text-center font-sans">
              <div className="p-2.5 rounded-2xl bg-stone-50 border-2 border-stone-200">
                <span className="text-[10px] uppercase font-bold font-mono-code text-stone-400 block">Hours Served</span>
                <span className="text-base font-black font-mono-code text-emerald-800">{hoursLogged} hrs</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-stone-50 border-2 border-stone-200">
                <span className="text-[10px] uppercase font-bold font-mono-code text-stone-400 block">Schedule</span>
                <span className="text-xs font-extrabold text-stone-800 font-display">Daytime Verified</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-stone-50 border-2 border-stone-200">
                <span className="text-[10px] uppercase font-bold font-mono-code text-stone-400 block">Safety Protocol</span>
                <span className="text-xs font-extrabold text-emerald-800 font-display">Women Safety ✓</span>
              </div>
            </div>

            {/* Footer with Signatures & Visual Proof Thumbs */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <div className="flex items-center gap-2">
                {drive.beforePhotoUrl && (
                  <img
                    src={drive.beforePhotoUrl}
                    alt="Before"
                    className="w-11 h-11 rounded-xl object-cover border-2 border-stone-950 shadow-2xs"
                    title="Verified Before Condition"
                  />
                )}
                {drive.afterPhotoUrl && (
                  <img
                    src={drive.afterPhotoUrl}
                    alt="After"
                    className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-500 shadow-[2px_2px_0px_#10b981]"
                    title="Verified Clean Transformation"
                  />
                )}
                <div className="text-[10px] text-stone-500 leading-tight font-sans">
                  <span className="font-extrabold font-display text-stone-900 block">Verified Photo Evidence</span>
                  <span className="font-mono-code">Issued on {drive.date || 'September 2026'}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-950 font-black font-mono-code text-xs bg-emerald-100 border border-emerald-400 px-3 py-1.5 rounded-xl shadow-2xs sticker-badge">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Digitally Authenticated</span>
              </div>
            </div>
          </div>

          {/* Social Sharing & LinkedIn Export Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-black font-display text-stone-950 uppercase tracking-wider">
              Share to Profile & Social Networks
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Add to LinkedIn Button */}
              <a
                href={linkedInAddUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0077b5] hover:bg-[#006097] text-white text-xs sm:text-sm font-black font-display border-2 border-stone-950 shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>Add to LinkedIn Profile</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              {/* Copy Credential Verification */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white border-2 border-stone-950 hover:bg-stone-50 text-stone-900 text-xs sm:text-sm font-black font-display shadow-[2px_2px_0px_#000] active:translate-y-0.5 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied Credential!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-600" />
                    <span>Copy Verification Info</span>
                  </>
                )}
              </button>
            </div>

            {/* Other Socials */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-xl bg-white border-2 border-stone-200 hover:border-stone-950 text-stone-900 text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5 text-stone-600" />
                <span>Share on X</span>
              </a>

              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-xl bg-white border-2 border-stone-200 hover:border-stone-950 text-stone-900 text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Share on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-stone-950 bg-white flex items-center justify-between">
          <span className="text-xs text-stone-500 font-mono-code">
            Logged in your verified volunteer dashboard
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-stone-950 hover:bg-emerald-400 hover:text-stone-950 text-white text-xs font-black font-display border-2 border-stone-950 shadow-[2px_2px_0px_#10b981] active:translate-y-0.5 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
