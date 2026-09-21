import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Video,
  Play,
  Sparkles,
  Copy,
  Check,
  Share2,
  FileText,
  Flame,
  Target,
  Eye,
  Film,
  Clapperboard,
  Send,
  X,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  ShieldCheck,
  CheckCircle,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { SocialDrive } from '../types';

interface YouTubeMarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
  featuredDrive?: SocialDrive;
}

export const YouTubeMarketingModal: React.FC<YouTubeMarketingModalProps> = ({
  isOpen,
  onClose,
  featuredDrive
}) => {
  const [activeTab, setActiveTab] = useState<'shorts' | 'longform' | 'thumbnails' | 'seo' | 'outreach' | 'teleprompter'>('shorts');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedShortIndex, setSelectedShortIndex] = useState(0);

  // Teleprompter state
  const [isPrompterRunning, setIsPrompterRunning] = useState(false);
  const [prompterSpeed, setPrompterSpeed] = useState(2);
  const [prompterScrollTop, setPrompterScrollTop] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPrompterRunning) {
      interval = setInterval(() => {
        setPrompterScrollTop((prev) => prev + prompterSpeed);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPrompterRunning, prompterSpeed]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const SHORTS_SCRIPTS = [
    {
      id: 'short-1',
      title: '🔥 The "1 Photo" Viral Loop (30 Seconds)',
      hookStyle: 'Curiosity Gap / Pattern Interrupt',
      estimatedLength: '30s',
      viralRating: '9.8 / 10',
      description: 'The highest-performing TikTok/Shorts format: showing a disgustingly dirty public spot, posting 1 photo, and showing strangers arriving.',
      beats: [
        {
          timestamp: '0:00 - 0:03',
          visual: 'Extreme close-up of repulsive plastic waste piling up on a sidewalk or park bench. Dramatic zoom out.',
          onScreenText: 'WHAT HAPPENS IF YOU POST 1 PHOTO HERE? 📸',
          voiceover: 'Most people walk past this every single day and complain on Twitter. We did something different.'
        },
        {
          timestamp: '0:03 - 0:08',
          visual: 'Show phone screen opening CleanMeet, snapping 1 photo, setting 2 hour daylight limit, and hitting "Post".',
          onScreenText: 'Post 1 Photo • Zero Profit • Live Map 📍',
          voiceover: 'We posted one photo on CleanMeet. No corporate sponsors, no login paywalls—just genuine mutual aid.'
        },
        {
          timestamp: '0:08 - 0:18',
          visual: 'Fast montage: ping sounds on squad chat. Strangers showing up with gloves, picking up waste, laughing, timelapse of bags filling.',
          onScreenText: '11 STRANGERS ASSEMBLED IN 45 MINS ⚡',
          voiceover: 'Within 45 minutes, 11 complete strangers showed up through the live GPS radar. Two hours later? 140kg of trash gone.'
        },
        {
          timestamp: '0:18 - 0:26',
          visual: 'Satisfying BEFORE vs AFTER wipe transition. Sparkling clean grass/beach. High fives. Showing the certified LinkedIn badge on phone.',
          onScreenText: 'BEFORE ➡️ AFTER (100% VERIFIED) ✨',
          voiceover: 'Look at this transformation! Everyone got an official verified community service badge on their phone for their LinkedIn.'
        },
        {
          timestamp: '0:26 - 0:30',
          visual: 'Point to screen: CleanMeet app URL on screen with animated arrow.',
          onScreenText: 'LINK IN BIO / PINNED COMMENT 🔗',
          voiceover: 'Stop scrolling and squad up in your city. Link is pinned in the comments—see what needs cleaning near you!'
        }
      ]
    },
    {
      id: 'short-2',
      title: '⚡ "Dating Apps Are Dead, Cleanup Apps Are In" (20 Seconds)',
      hookStyle: 'Gen Z Relatability / Counter-Intuitive',
      estimatedLength: '20s',
      viralRating: '9.5 / 10',
      description: 'Humorous, culture-driven hook appealing to students and Gen Z craving authentic third places and real-life connections.',
      beats: [
        {
          timestamp: '0:00 - 0:04',
          visual: 'Creator talking to camera holding trash grabber: "Stop swiping on dating apps. Here is where the real ones meet."',
          onScreenText: 'DATING APPS ❌ CLEANMEET SQUAD ✅',
          voiceover: 'If you want to meet people who actually touch grass, delete Tinder and download CleanMeet.'
        },
        {
          timestamp: '0:04 - 0:11',
          visual: 'Quick cuts of energetic Gen Z volunteers smiling, sorting bottles, playing music on a portable speaker while cleaning.',
          onScreenText: 'VIBES ARE UNMATCHED 🎶🧹',
          voiceover: 'Someone in my area posted 1 photo of an abandoned park. An hour later we had an entire squad blasting music and fixing it up.'
        },
        {
          timestamp: '0:11 - 0:20',
          visual: 'Showing the Women Safety buddy badge & sealed group chat. Sunset high-fives.',
          onScreenText: 'SAFE • DAYLIGHT • VERIFIED BADGES 🛡️',
          voiceover: 'It is daylight-only, women safety guaranteed, and you get certified volunteer hours for your resume. Try it in your city!'
        }
      ]
    },
    {
      id: 'short-3',
      title: '🏆 The 60-Minute City Transformation Speedrun (45 Seconds)',
      hookStyle: 'MrBeast / Challenge Format',
      estimatedLength: '45s',
      viralRating: '9.9 / 10',
      description: 'Fast-paced gamified format with a ticking on-screen timer counting down from 60 minutes.',
      beats: [
        {
          timestamp: '0:00 - 0:05',
          visual: 'Giant stopwatch graphic on screen: 60:00. Creator points to an overgrown, trash-strewn canal bank.',
          onScreenText: 'CAN 15 STRANGERS FIX THIS IN 60 MINS? ⏱️',
          voiceover: 'Can 15 strangers completely restore this neglected canal in under 60 minutes using only this app? Timer starts NOW.'
        },
        {
          timestamp: '0:05 - 0:18',
          visual: 'Rapid-fire split screen: GPS tracking pins moving on Google Maps. Volunteers arriving on bikes and foot.',
          onScreenText: 'LIVE GPS SQUAD ASSEMBLE 🗺️🚴',
          voiceover: 'CleanMeet routed everyone within a 15km radius. We divided into teams: heavy debris, plastic recyclables, and weeding.'
        },
        {
          timestamp: '0:18 - 0:35',
          visual: 'Super-satisfying timelapse scrubbing. Bags stacking up. Trash can being painted or restored.',
          onScreenText: '30 MINS LEFT • 40 BAGS FILLED 🗑️',
          voiceover: 'At 30 minutes, local residents started bringing us lemonade. We filled 48 bags and diverted 80% to local recycling.'
        },
        {
          timestamp: '0:35 - 0:45',
          visual: 'Timer buzzer hits 00:00! Stunning cinematic drone or high-angle shot of the spotless park. The squad celebrating.',
          onScreenText: 'MISSION COMPLETE! WHO IS NEXT? 🌟',
          voiceover: 'Times up! Spot is 100% clean. Start your own cleanup in your neighborhood right now—link pinned below.'
        }
      ]
    }
  ];

  const LONG_FORM_DOC = {
    title: "I Spent 24 Hours Cleaning The Dirtiest Spots in Our City Using Only CleanMeet",
    targetDuration: "12 - 16 minutes",
    targetAudience: "Gen Z, wholesome content fans (Yes Theory / Ryan Trahan / HopeCore), environmentalists",
    projectedCTR: "12% - 16%",
    outline: [
      {
        phase: "Act 1: The Frustration & The Experiment (0:00 - 2:30)",
        content: "Show the real problem in your city: litter on beaches, parks, or school areas. Introduce the premise: instead of waiting for city hall, can regular people mobilize using a single-purpose open app with zero corporate ads? Set the 24-hour stakes."
      },
      {
        phase: "Act 2: Posting Drive #1 & First Strangers Arriving (2:30 - 6:00)",
        content: "Live walk-through of posting 1 photo on CleanMeet. Waiting with anticipation. The first stranger arrives: interview them! Why did they come? Show the live group chat and how the buddy system works. The first victory."
      },
      {
        phase: "Act 3: Scaling Up - The Giant Challenge (6:00 - 10:30)",
        content: "Pick a notoriously messy landmark (e.g. neglected riverbank or bridge). Post a call for 20+ volunteers. Fast-paced, heartwarming teamwork montage. Overcoming an unexpected hurdle (e.g. huge tires or bulky trash needing city coordination)."
      },
      {
        phase: "Act 4: Completion, Badging & Archival (10:30 - 13:00)",
        content: "Uploading the mandatory After photo. Show how the chat automatically seals itself to prevent spam. Showing volunteers receiving their authenticated certificates on their phones. Real emotional reactions."
      },
      {
        phase: "Act 5: The Ripple Effect & Community Call to Action (13:00 - 15:00)",
        content: "Final cinematic before-and-after comparison. Recap total hours and weight cleared. Announce the #CleanMeetChallenge: challenge your viewers and 3 other creators to post 1 drive in their hometown."
      }
    ]
  };

  const HIGH_CTR_TITLES = [
    "I Spent 24 Hours Cleaning The Most Ignored Places in My City",
    "We Cleaned 500kg of Trash With Complete Strangers (CleanMeet App)",
    "Why Gen Z is Ditching Social Media For Cleanup Squads",
    "I Posted 1 Photo of a Dirty Beach and 30 People Showed Up 🤯",
    "Can 1 App Actually Fix Our Cities? (Tested For 7 Days)",
    "We Transformed The Dirtiest Park in 2 Hours (Before & After Satisfying)",
    "Stop Comaining Online: Here's How We Cleaned Our Whole Neighborhood"
  ];

  const YOUTUBE_DESCRIPTION = `We put a free mutual-aid app called CleanMeet to the ultimate test: we posted photos of neglected, trash-covered spots in our city to see if complete strangers would actually show up to clean them with us. 

What happened next genuinely restored our faith in humanity.

👉 Try CleanMeet in your city (100% Free, Zero Profit, Daylight Only):
https://cleanmeet.org

⏱️ CHAPTERS / TIMESTAMPS:
0:00 - The Dirtiest Spot in the City
1:15 - How CleanMeet Works (Posting 1 Photo)
3:20 - The First Volunteers Show Up!
6:10 - Massive 2-Hour Cleanup Montage (Satisfying)
9:45 - The Before vs After Transformation
11:30 - Getting Our Verified Social Work Badges
13:10 - The #CleanMeetChallenge (You're Tagged!)

🛡️ ABOUT CLEANMEET:
CleanMeet is an open, non-profit community platform where anyone can post 1 photo of an area needing social work, assemble nearby volunteers within a 50km radar, coordinate safely with women safety buddies, and earn verifiable LinkedIn community certificates.

#CleanMeet #CleanTok #HopeCore #Volunteer #CommunityAction #MutualAid #GenZAction`;

  const YOUTUBE_TAGS = "cleanmeet, cleanup app, beach cleanup, neighborhood cleanup, satisfying cleaning, gen z social impact, mutual aid, volunteer work, before and after cleaning, trashtag, clean up community, college volunteer hours, linkedin volunteer badge, women safety volunteer, city cleanup challenge, yes theory, hopecore";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-[8px_8px_0px_#ef4444] border-2 border-stone-950 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b-2 border-stone-950 flex items-center justify-between bg-stone-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ff0000] text-white flex items-center justify-center border-2 border-white/20 shadow-[2px_2px_0px_#fff]">
              <Youtube className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                  YouTube Creator & Marketing Launch Kit
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black font-mono-code bg-red-500 text-white uppercase tracking-wider sticker-badge">
                  Viral Playbook
                </span>
              </div>
              <p className="text-xs text-stone-300 font-sans mt-0.5">
                Turn CleanMeet into a viral YouTube sensation with copy-paste Shorts scripts, thumbnail concepts, and documentary arcs.
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-2 bg-[#f4f2ea] border-b-2 border-stone-950 overflow-x-auto no-scrollbar text-xs font-black font-display">
          {[
            { id: 'shorts', label: '⚡ Viral Shorts Scripts (15-45s)', icon: Flame },
            { id: 'longform', label: '🎬 Long-Form Video Arc', icon: Film },
            { id: 'thumbnails', label: '🖼️ Thumbnail Concepts', icon: Eye },
            { id: 'seo', label: '🏷️ SEO, Titles & Tags', icon: TrendingUp },
            { id: 'outreach', label: '🤝 Creator Collab Pitch', icon: Send },
            { id: 'teleprompter', label: '🎙️ Live Teleprompter', icon: Clapperboard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all border-2 ${
                  isActive
                    ? 'bg-stone-950 text-white border-stone-950 shadow-[2px_2px_0px_#ef4444]'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#faf9f5]">
          
          {/* TAB 1: SHORTS & REELS SCRIPTS */}
          {activeTab === 'shorts' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border-2 border-stone-950 shadow-[3px_3px_0px_#000]">
                <div>
                  <h3 className="text-base font-black font-display text-stone-950">
                    Proven YouTube Shorts Frameworks
                  </h3>
                  <p className="text-xs text-stone-500 font-sans">
                    Engineered for high completion rate, instant visual hooks in the first 2 seconds, and high comment engagement.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {SHORTS_SCRIPTS.map((script, idx) => (
                    <button
                      key={script.id}
                      type="button"
                      onClick={() => setSelectedShortIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black font-mono-code border-2 transition-all ${
                        selectedShortIndex === idx
                          ? 'bg-[#ff0000] text-white border-stone-950 shadow-xs'
                          : 'bg-stone-100 text-stone-700 border-stone-300 hover:border-stone-900'
                      }`}
                    >
                      Script #{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Script Card */}
              {(() => {
                const current = SHORTS_SCRIPTS[selectedShortIndex];
                return (
                  <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-stone-950 shadow-[4px_4px_0px_#000] space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-stone-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-900 border border-red-300 text-[10px] font-black font-mono-code uppercase sticker-badge">
                            Hook: {current.hookStyle}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-300 text-[10px] font-bold font-mono-code">
                            ⏱️ {current.estimatedLength}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold font-mono-code">
                            ⭐ Viral Potential: {current.viralRating}
                          </span>
                        </div>
                        <h4 className="text-lg font-black font-display text-stone-950">
                          {current.title}
                        </h4>
                        <p className="text-xs text-stone-600 font-sans mt-0.5">
                          {current.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const fullScript = current.beats
                            .map((b) => `[${b.timestamp}]\n🎬 VISUAL: ${b.visual}\n📱 TEXT: ${b.onScreenText}\n🗣️ AUDIO: "${b.voiceover}"`)
                            .join('\n\n');
                          handleCopy(fullScript, `short-${selectedShortIndex}`);
                        }}
                        className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-emerald-400 hover:text-stone-950 text-white text-xs font-black font-display flex items-center gap-1.5 border-2 border-stone-950 shadow-[2px_2px_0px_#10b981] active:translate-y-0.5 transition-all"
                      >
                        {copiedKey === `short-${selectedShortIndex}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Script Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Full Script</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Scene-by-Scene Timeline Breakdown */}
                    <div className="space-y-4">
                      {current.beats.map((beat, bIdx) => (
                        <div
                          key={bIdx}
                          className="p-4 rounded-2xl bg-[#faf9f5] border-2 border-stone-200 hover:border-stone-950 transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-md bg-stone-950 text-white font-mono-code text-[11px] font-black">
                              {beat.timestamp}
                            </span>
                            <span className="text-[11px] font-black font-mono-code text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                              SCENE {bIdx + 1}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            {/* Visual Direction */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-black font-mono-code uppercase text-stone-400 block">
                                🎬 Camera / Visual Direction
                              </span>
                              <p className="text-stone-800 font-sans leading-relaxed">
                                {beat.visual}
                              </p>
                            </div>

                            {/* On-screen Caption Text */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-black font-mono-code uppercase text-stone-400 block">
                                📱 Bold On-Screen Caption
                              </span>
                              <div className="p-2 rounded-xl bg-white border border-stone-300 font-display font-black text-stone-950 text-xs shadow-2xs">
                                {beat.onScreenText}
                              </div>
                            </div>

                            {/* Voiceover Speech */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-black font-mono-code uppercase text-emerald-700 block">
                                🗣️ Spoken Voiceover
                              </span>
                              <p className="text-stone-900 font-medium font-sans italic bg-emerald-50/60 p-2 rounded-xl border border-emerald-200">
                                "{beat.voiceover}"
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Filming Tips Card */}
                    <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start gap-3 text-xs text-amber-950">
                      <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="font-sans space-y-1">
                        <span className="font-extrabold font-display block">Pro YouTube Shorts Filming Tips:</span>
                        <p className="text-amber-900 leading-relaxed">
                          • Keep the first 3 seconds loud and visual: start mid-action scooping up a cup or pointing a camera at the mess.<br />
                          • Use trending TikTok/YouTube sounds (e.g. upbeat phonk or wholesome indie lofi).<br />
                          • Put the CleanMeet app download link in the pinned comment and say "Link pinned below!".
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 2: LONG-FORM VIDEO BLUEPRINT */}
          {activeTab === 'longform' && (
            <div className="space-y-6">
              <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-stone-950 shadow-[4px_4px_0px_#000] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-100 pb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-900 border border-red-300 text-[10px] font-black font-mono-code uppercase sticker-badge">
                      Documentary / Challenge Masterclass
                    </span>
                    <h3 className="text-xl font-black font-display text-stone-950 mt-1">
                      {LONG_FORM_DOC.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-stone-500 font-mono-code mt-1">
                      <span>Target: {LONG_FORM_DOC.targetDuration}</span>
                      <span>•</span>
                      <span>Target CTR: {LONG_FORM_DOC.projectedCTR}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const text = LONG_FORM_DOC.outline
                        .map((o) => `${o.phase}\n${o.content}`)
                        .join('\n\n');
                      handleCopy(text, 'longform-doc');
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-emerald-400 hover:text-stone-950 text-white text-xs font-black font-display flex items-center gap-1.5 border-2 border-stone-950 shadow-[2px_2px_0px_#10b981] active:translate-y-0.5 transition-all"
                  >
                    {copiedKey === 'longform-doc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'longform-doc' ? 'Copied Outline!' : 'Copy Outline'}</span>
                  </button>
                </div>

                {/* 5-Act Breakdown */}
                <div className="space-y-3 pt-2">
                  {LONG_FORM_DOC.outline.map((act, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-4 rounded-2xl bg-[#faf9f5] border-2 border-stone-200 hover:border-stone-950 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black font-display text-stone-950">
                          {act.phase}
                        </h4>
                        <span className="text-[10px] font-black font-mono-code text-stone-400">
                          STEP 0{aIdx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 font-sans leading-relaxed">
                        {act.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Viral Retention Hooks Checklist */}
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2">
                  <h4 className="text-xs font-extrabold font-display text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Key Video Retention Elements:</span>
                  </h4>
                  <ul className="text-xs text-emerald-950 space-y-1 pl-4 list-disc font-sans">
                    <li><strong>B-Roll Timelapse:</strong> Set up a tripod or phone propped up on a rock recording an unbroken timelapse of the cleaning. This is high-satisfaction gold on YouTube.</li>
                    <li><strong>Mini-Interviews:</strong> Give the mic to volunteers who showed up. Ask "Why did you come here on a Saturday?" Real vulnerability creates viral loyalty.</li>
                    <li><strong>The Reveal Moment:</strong> Stand in the exact same camera angle before and after to create a cinematic split screen wipe.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THUMBNAIL CONCEPTS */}
          {activeTab === 'thumbnails' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white border-2 border-stone-950 shadow-[3px_3px_0px_#000]">
                <h3 className="text-base font-black font-display text-stone-950">
                  High-Clickthrough (CTR) Thumbnail Blueprints
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  The thumbnail drives 80% of your initial impression clicks. Here are 2 tested layout wireframes designed for maximum curiosity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Concept 1: Split Screen Shock */}
                <div className="p-5 rounded-3xl bg-white border-2 border-stone-950 shadow-[4px_4px_0px_#000] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-stone-950 text-white font-mono-code text-[10px] font-black">
                      CONCEPT A: THE SPLIT SHOCK
                    </span>
                    <span className="text-xs font-mono-code font-bold text-emerald-700">Estimated CTR: 14.5%</span>
                  </div>

                  {/* Thumbnail Mock Visual */}
                  <div className="relative aspect-16/9 rounded-2xl overflow-hidden border-2 border-stone-950 shadow-xs bg-stone-900 flex">
                    {/* Left half: Disgusting trash */}
                    <div className="w-1/2 relative bg-rose-950/80 p-3 flex flex-col justify-between border-r-4 border-yellow-400">
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px] font-mono-code w-max">
                        BEFORE 🤢
                      </span>
                      <div className="text-center text-stone-300 text-[11px] font-bold">
                        (Filthy plastic canal)
                      </div>
                      <div className="text-[10px] text-white/50">Trash piled high</div>
                    </div>

                    {/* Right half: Sparkling clean */}
                    <div className="w-1/2 relative bg-emerald-950/80 p-3 flex flex-col justify-between">
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-stone-950 font-black text-[10px] font-mono-code w-max">
                        2 HOURS LATER ✨
                      </span>
                      <div className="text-center text-emerald-300 text-[11px] font-bold">
                        (Spotless green park)
                      </div>
                      <div className="text-[10px] text-white/50">Squad celebrating</div>
                    </div>

                    {/* Giant Center Sticker Text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="bg-yellow-400 text-stone-950 px-3 py-1 rounded-xl font-black font-display text-sm sm:text-base border-2 border-stone-950 shadow-[3px_3px_0px_#000] rotate-[-4deg]">
                        WE ACTUALLY FIXED IT?! 😱
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 text-stone-600 font-sans">
                    <strong className="text-stone-900 block font-display">How to shoot this thumbnail:</strong>
                    <p>Take photo #1 of the polluted spot before touching anything. Take photo #2 from the exact same position when finished. Add bold yellow text with a heavy black outline.</p>
                  </div>
                </div>

                {/* Concept 2: The Mobile App Hook */}
                <div className="p-5 rounded-3xl bg-white border-2 border-stone-950 shadow-[4px_4px_0px_#000] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-stone-950 text-white font-mono-code text-[10px] font-black">
                      CONCEPT B: THE APP IN HAND
                    </span>
                    <span className="text-xs font-mono-code font-bold text-emerald-700">Estimated CTR: 12.8%</span>
                  </div>

                  {/* Thumbnail Mock Visual */}
                  <div className="relative aspect-16/9 rounded-2xl overflow-hidden border-2 border-stone-950 shadow-xs bg-stone-950 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-400 text-stone-950 font-black font-mono-code text-xs border border-stone-900 shadow-xs">
                        📍 1 PHOTO POSTED
                      </span>
                      <span className="text-xl">👇</span>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="inline-block bg-white text-stone-950 px-3 py-1 rounded-xl font-black font-display text-base border-2 border-stone-950 shadow-[3px_3px_0px_#10b981]">
                        14 STRANGERS ASSEMBLE!
                      </div>
                      <p className="text-[10px] text-stone-300 font-mono-code">CleanMeet Live Radar</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono-code">
                      <span>CleanMeet.org</span>
                      <span>Daylight Mutual Aid</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 text-stone-600 font-sans">
                    <strong className="text-stone-900 block font-display">How to shoot this thumbnail:</strong>
                    <p>Hold a smartphone in the foreground displaying the CleanMeet app with the dirty park blurred in the background. High contrast, saturated colors.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO, TITLES & TAGS */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* High CTR Titles */}
              <div className="p-5 rounded-3xl bg-white border-2 border-stone-950 shadow-[4px_4px_0px_#000] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black font-display text-stone-950 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    <span>Tested High-CTR Video Title Options</span>
                  </h3>
                  <span className="text-[10px] font-bold font-mono-code text-stone-400">Click to copy</span>
                </div>

                <div className="space-y-2">
                  {HIGH_CTR_TITLES.map((title, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-3 rounded-xl bg-stone-50 border-2 border-stone-200 hover:border-stone-950 flex items-center justify-between gap-3 group transition-all"
                    >
                      <span className="text-xs font-bold font-display text-stone-900 group-hover:text-red-600">
                        {title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(title, `title-${tIdx}`)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-[11px] font-mono-code font-bold text-stone-700 shrink-0"
                      >
                        {copiedKey === `title-${tIdx}` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* YouTube Description Template */}
              <div className="p-5 rounded-3xl bg-white border-2 border-stone-950 shadow-[4px_4px_0px_#000] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black font-display text-stone-950">
                      Optimized YouTube Video Description & Timestamps
                    </h3>
                    <p className="text-xs text-stone-500 font-sans">
                      Includes links, algorithmic keywords, timestamps, and hashtags.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(YOUTUBE_DESCRIPTION, 'yt-desc')}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-950 hover:bg-emerald-400 hover:text-stone-950 text-white text-xs font-black font-display flex items-center gap-1.5 border-2 border-stone-950 shadow-[2px_2px_0px_#10b981]"
                  >
                    {copiedKey === 'yt-desc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'yt-desc' ? 'Copied Description!' : 'Copy Description'}</span>
                  </button>
                </div>

                <textarea
                  readOnly
                  rows={8}
                  value={YOUTUBE_DESCRIPTION}
                  className="w-full text-xs font-mono-code p-3.5 rounded-2xl bg-stone-50 border-2 border-stone-200 text-stone-800 focus:outline-hidden"
                />
              </div>

              {/* Video Tags */}
              <div className="p-5 rounded-3xl bg-white border-2 border-stone-950 shadow-[4px_4px_0px_#000] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black font-display text-stone-950">
                    High-Volume Algorithm Tags (Comma-Separated)
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleCopy(YOUTUBE_TAGS, 'yt-tags')}
                    className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-stone-950 hover:bg-stone-100 text-stone-900 text-xs font-black font-display flex items-center gap-1.5 shadow-xs"
                  >
                    {copiedKey === 'yt-tags' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'yt-tags' ? 'Copied Tags!' : 'Copy Tags'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-mono-code text-stone-700">
                  {YOUTUBE_TAGS}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CREATOR OUTREACH & CHALLENGE */}
          {activeTab === 'outreach' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-white border-2 border-stone-950 shadow-[4px_4px_0px_#000] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3">
                  <div>
                    <h3 className="text-base font-black font-display text-stone-950">
                      Creator Cold Outreach DM / Email Pitch
                    </h3>
                    <p className="text-xs text-stone-500 font-sans">
                      Send this to local city YouTubers, college vloggers, or environmental creators to collab on a video.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const dmText = `Hey [Creator Name]! Love your videos on [City/Topic].

Quick question: Have you seen what people are doing with CleanMeet in [City Name]? 

Basically, instead of complaining about trash online, anyone snaps 1 photo, and nearby volunteers get an alert on their phone radar to clean it up together in daylight. Zero corporate ads, 100% mutual aid.

We're organizing a video challenge this Saturday to clean [Location Name] in under 60 minutes with 20 strangers. Would love to feature you or have you lead the squad! Can send over the private group link if interested!`;
                      handleCopy(dmText, 'collab-pitch');
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-emerald-400 hover:text-stone-950 text-white text-xs font-black font-display flex items-center gap-1.5 border-2 border-stone-950 shadow-[2px_2px_0px_#10b981]"
                  >
                    {copiedKey === 'collab-pitch' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'collab-pitch' ? 'Copied DM Pitch!' : 'Copy DM Pitch'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 text-xs text-stone-800 space-y-2 font-sans">
                  <p className="font-bold text-stone-950">Subject: Collab: 20 strangers cleaning [Location] in 60 mins?</p>
                  <p>Hey [Creator Name]! Love your videos on [City/Topic].</p>
                  <p>Quick question: Have you seen what people are doing with CleanMeet in [City Name]? Basically, instead of complaining about trash online, anyone snaps 1 photo, and nearby volunteers get an alert on their phone radar to clean it up together in daylight. Zero corporate ads, 100% mutual aid.</p>
                  <p>We're organizing a video challenge this Saturday to clean [Location Name] in under 60 minutes with 20 strangers. Would love to feature you or have you lead the squad! Can send over the private group link if interested!</p>
                </div>
              </div>

              {/* The #CleanMeetChallenge Framework */}
              <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-300 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <h4 className="text-base font-black font-display text-emerald-950">
                    The #CleanMeetChallenge Viral Loop
                  </h4>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed font-sans">
                  To turn this into a nationwide movement on YouTube:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-1">
                    <span className="font-black font-mono-code text-stone-950 block">RULE 1: Post 1 Photo</span>
                    <p className="text-stone-600 font-sans">Every creator must post 1 photo of an actual spot needing help in their neighborhood.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-1">
                    <span className="font-black font-mono-code text-stone-950 block">RULE 2: Squad Up & Film</span>
                    <p className="text-stone-600 font-sans">Assemble at least 3 volunteers, clean during daylight, and record the transformation.</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-1">
                    <span className="font-black font-mono-code text-stone-950 block">RULE 3: Tag 3 Creators</span>
                    <p className="text-stone-600 font-sans">At the end of the video, tag 3 other YouTubers to beat your time or trash weight!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LIVE TELEPROMPTER / REHEARSAL */}
          {activeTab === 'teleprompter' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-white border-2 border-stone-950 shadow-[4px_4px_0px_#000] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-100 pb-3">
                  <div>
                    <h3 className="text-base font-black font-display text-stone-950">
                      Live Teleprompter / Creator Practice Stage
                    </h3>
                    <p className="text-xs text-stone-500 font-sans">
                      Practice recording your YouTube Shorts script on your webcam or phone with auto-scroll.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-stone-600">
                      <span>Speed:</span>
                      <button
                        type="button"
                        onClick={() => setPrompterSpeed((s) => Math.max(1, s - 1))}
                        className="w-6 h-6 rounded bg-stone-200 text-stone-900 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span>{prompterSpeed}x</span>
                      <button
                        type="button"
                        onClick={() => setPrompterSpeed((s) => Math.min(5, s + 1))}
                        className="w-6 h-6 rounded bg-stone-200 text-stone-900 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPrompterRunning((r) => !r)}
                      className={`px-4 py-2 rounded-xl text-xs font-black font-display flex items-center gap-1.5 border-2 border-stone-950 transition-all ${
                        isPrompterRunning
                          ? 'bg-amber-400 text-stone-950 shadow-xs'
                          : 'bg-emerald-400 text-stone-950 shadow-[2px_2px_0px_#000]'
                      }`}
                    >
                      {isPrompterRunning ? 'Pause Prompter' : 'Start Prompter ▶'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPrompterScrollTop(0)}
                      className="px-3 py-2 rounded-xl bg-stone-100 border border-stone-300 text-xs font-bold text-stone-700"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Teleprompter Screen */}
                <div
                  className="relative h-80 rounded-2xl bg-stone-950 text-white p-6 sm:p-8 overflow-hidden border-2 border-stone-950 flex flex-col justify-start"
                >
                  <div
                    style={{ transform: `translateY(-${prompterScrollTop}px)`, transition: 'transform 0.05s linear' }}
                    className="space-y-8 max-w-2xl mx-auto text-center"
                  >
                    <div className="text-red-400 font-mono-code text-xs uppercase tracking-widest font-black">
                      🔴 3... 2... 1... ACTION!
                    </div>

                    <p className="text-xl sm:text-2xl font-black font-display leading-relaxed text-yellow-300">
                      "Most people walk past this filth every single day and complain on Twitter. We did something different."
                    </p>

                    <p className="text-lg sm:text-xl font-bold font-sans text-stone-200 leading-relaxed">
                      "We posted ONE photo on CleanMeet. No corporate sponsors, no paywalls—just genuine mutual aid."
                    </p>

                    <p className="text-xl sm:text-2xl font-black font-display text-emerald-400 leading-relaxed">
                      "Within 45 minutes, 11 complete strangers showed up through the live GPS radar!"
                    </p>

                    <p className="text-lg sm:text-xl font-bold font-sans text-stone-200 leading-relaxed">
                      "Two hours later? 140 kilograms of trash completely gone. Look at this before and after!"
                    </p>

                    <p className="text-xl sm:text-2xl font-black font-display text-white leading-relaxed">
                      "Stop scrolling and squad up in your city. The link is pinned in the comments—see what needs cleaning near you right now!"
                    </p>

                    <div className="py-12 text-emerald-400 font-mono-code text-sm font-black">
                      ✦ END OF SCRIPT • SMASH SUBSCRIBE & SHARE ✦
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-stone-950 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono-code text-stone-500">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>Ready for YouTube, Shorts, TikTok & Reels</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-2xl bg-stone-950 hover:bg-emerald-400 hover:text-stone-950 text-white text-xs sm:text-sm font-black font-display border-2 border-stone-950 shadow-[2px_2px_0px_#10b981] active:translate-y-0.5 transition-all"
            >
              Back to CleanMeet App
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
