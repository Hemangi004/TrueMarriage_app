import React from 'react';
import { X, CheckCircle2, Clock, Calendar, Sparkles } from 'lucide-react';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const roadmapItems = [
    {
      quarter: 'Phase 1 - Live Now',
      status: 'completed',
      title: 'Core Meetups & Matrimonial Biodata Suite',
      items: [
        'Interactive 24-step conversational profile builder',
        'Direct PDF & HD Image export with customizable themes',
        'Smart AI Profile Summary generation with Ollama integration',
        'Mobile & Phone verification with OTP security'
      ]
    },
    {
      quarter: 'Phase 2 - Upcoming',
      status: 'in-progress',
      title: 'Community Events & RSVP Engine',
      items: [
        'One-click RSVP for virtual and in-person matrimonial meetups',
        'Organizer attendee management dashboard',
        'Direct email broadcasts to group and event attendees',
        'Private profile sharing links with passcode protection'
      ]
    },
    {
      quarter: 'Phase 3 - Roadmap',
      status: 'upcoming',
      title: 'Match Intelligence & Video Introductions',
      items: [
        'AI-driven compatibility scoring based on partner preferences',
        'Short 30-second verified video introduction reels',
        'Community group discussions and topic channels'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#ff4b72] via-[#8b5cf6] to-[#6366f1]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#1e1b4b]">Product Roadmap</h3>
            <p className="text-xs text-gray-500 font-medium">What we've built and what's coming next</p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {roadmapItems.map((milestone, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                milestone.status === 'completed'
                  ? 'bg-purple-50/50 border-purple-200'
                  : milestone.status === 'in-progress'
                  ? 'bg-pink-50/40 border-pink-200'
                  : 'bg-gray-50/70 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff4b72]">
                  {milestone.quarter}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                    milestone.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : milestone.status === 'in-progress'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {milestone.status === 'completed' ? (
                    <>
                      <CheckCircle2 size={12} />
                      <span>Completed</span>
                    </>
                  ) : milestone.status === 'in-progress' ? (
                    <>
                      <Clock size={12} />
                      <span>In Development</span>
                    </>
                  ) : (
                    <>
                      <Calendar size={12} />
                      <span>Planned</span>
                    </>
                  )}
                </span>
              </div>

              <h4 className="text-base font-bold text-gray-900 mb-3">{milestone.title}</h4>

              <ul className="space-y-2">
                {milestone.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4b72] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
