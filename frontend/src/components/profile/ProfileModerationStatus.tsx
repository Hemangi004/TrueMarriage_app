import React from 'react';
import type { ProfileModerationStatus as ModerationStatusType } from '../../types/adminProfile';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileEdit,
  Globe,
  Lock,
  ExternalLink,
} from 'lucide-react';

interface ProfileModerationStatusProps {
  status?: ModerationStatusType | string | null;
  rejectionReason?: string | null;
  shareableUrl?: string | null;
  onEditClick?: () => void;
  onResubmitClick?: () => void;
}

export const ProfileModerationStatusComponent: React.FC<ProfileModerationStatusProps> = ({
  status = 'DRAFT',
  rejectionReason,
  shareableUrl,
  onEditClick,
  onResubmitClick,
}) => {
  const currentStatus = (status || 'DRAFT').toUpperCase() as ModerationStatusType;

  if (currentStatus === 'APPROVED') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-900 text-sm">Profile Approved</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                PUBLICLY VISIBLE
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium pt-0.5">
              Your profile has been reviewed and approved by administrators. Other members can now view your biodata.
            </p>
          </div>
        </div>

        {shareableUrl && (
          <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between gap-2 text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-600" /> Live Share Link:
            </span>
            <a
              href={shareableUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1 truncate"
            >
              {shareableUrl} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    );
  }

  if (currentStatus === 'SUBMITTED' || currentStatus === 'UNDER_REVIEW') {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-900 text-sm">Profile Under Review</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-300">
                IN MODERATION QUEUE
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium pt-0.5">
              Your profile has been submitted and is currently being reviewed by our administration team.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-purple-200/80 flex items-center gap-2 text-[11px] text-purple-900 font-medium">
          <Lock className="w-3.5 h-3.5 text-purple-700" />
          <span>Public access is temporarily suspended while moderation review is in progress.</span>
        </div>
      </div>
    );
  }

  if (currentStatus === 'CHANGES_REQUESTED') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-900 text-sm">Changes Required</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                ACTION NEEDED
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium pt-0.5">
              An administrator reviewed your profile and requested modifications before it can be approved.
            </p>
          </div>
        </div>

        {rejectionReason && (
          <div className="p-3 bg-amber-100/60 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium space-y-1">
            <p className="font-bold flex items-center gap-1 text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-700" /> Administrator Feedback:
            </p>
            <p className="pl-5 italic text-slate-800">"{rejectionReason}"</p>
          </div>
        )}

        <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between gap-2">
          <span className="text-[11px] text-amber-800 font-medium">
            Please update your profile details according to the feedback above and re-submit.
          </span>
          <button
            onClick={onEditClick || onResubmitClick}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
          >
            <FileEdit className="w-3.5 h-3.5" /> Update Profile
          </button>
        </div>
      </div>
    );
  }

  if (currentStatus === 'REJECTED') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-900 text-sm">Profile Needs Corrections</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                REJECTED
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium pt-0.5">
              Your profile submission was rejected during administrative moderation review.
            </p>
          </div>
        </div>

        {rejectionReason && (
          <div className="p-3 bg-rose-100/60 border border-rose-200 rounded-xl text-xs text-rose-900 font-medium space-y-1">
            <p className="font-bold flex items-center gap-1 text-rose-950">
              <AlertCircle className="w-4 h-4 text-rose-700" /> Rejection Reason:
            </p>
            <p className="pl-5 italic text-slate-800">"{rejectionReason}"</p>
          </div>
        )}

        <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between gap-2">
          <span className="text-[11px] text-rose-800 font-medium">
            Review the reason above, make necessary updates, and re-submit your profile.
          </span>
          <button
            onClick={onEditClick || onResubmitClick}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
          >
            <FileEdit className="w-3.5 h-3.5" /> Edit & Resubmit
          </button>
        </div>
      </div>
    );
  }

  // Default DRAFT State
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0">
          <FileEdit className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-slate-900 text-sm">Profile Draft</h4>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold border border-slate-300">
              NOT SUBMITTED
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium pt-0.5">
            Your profile is currently in draft mode. Complete all required fields and submit it for review when ready.
          </p>
        </div>
      </div>
    </div>
  );
};
