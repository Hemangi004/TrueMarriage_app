import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { AdminUser, UserStatus } from '../../types/admin';
import { getUserDetailApi } from '../../services/adminUserService';
import { UserAvatar } from './UserAvatar';
import {
  X,
  User as UserIcon,
  Mail,
  Shield,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Ban,
  Lock,
  UserCheck,
  UserX,
  Loader2,
  GraduationCap,
  Home,
  MapPin,
  Sparkles,
  Heart,
  Phone,
  Image as ImageIcon,
  FileCode,
  Maximize2,
  Copy,
  Check,
  Globe,
  Compass,
} from 'lucide-react';

interface UserDetailDrawerProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onActionClick: (user: AdminUser, action: 'block' | 'unblock' | 'activate' | 'deactivate') => void;
}

type DrawerTab = 'biodata' | 'photos' | 'account' | 'raw';

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  userId,
  isOpen,
  onClose,
  onActionClick,
}) => {
  const { user: currentAdmin } = useAuth();
  const [targetUser, setTargetUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DrawerTab>('biodata');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      setError(null);
      setActiveTab('biodata');
      getUserDetailApi(userId)
        .then((data) => {
          setTargetUser(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load user details');
          setLoading(false);
        });
    } else {
      setTargetUser(null);
      setPreviewImage(null);
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const isSelf = currentAdmin?.id === targetUser?.id;
  const p: Record<string, any> = targetUser?.profile_data || {};

  // Extract all photos
  const allPhotos: { url: string; label: string }[] = [];
  if (targetUser?.profile_picture_url) {
    allPhotos.push({ url: targetUser.profile_picture_url, label: 'Primary Profile Picture' });
  } else if (p.profilePictureUrl || p.photoUrl || p.image || p.photo) {
    allPhotos.push({
      url: p.profilePictureUrl || p.photoUrl || p.image || p.photo,
      label: 'Primary Profile Picture',
    });
  }

  const galleryList = targetUser?.gallery_pictures || p.galleryPictures || p.photos || [];
  if (Array.isArray(galleryList)) {
    galleryList.forEach((pic, idx) => {
      const url = typeof pic === 'string' ? pic : pic?.url || pic?.photoUrl;
      if (url && !allPhotos.some((item) => item.url === url)) {
        allPhotos.push({ url, label: `Gallery Photo #${idx + 1}` });
      }
    });
  }

  if (p.familyPhotoUrl && !allPhotos.some((item) => item.url === p.familyPhotoUrl)) {
    allPhotos.push({ url: p.familyPhotoUrl, label: 'Family Photo' });
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(targetUser, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusBadge = (status?: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 inline-flex items-center gap-1">
            <Ban className="w-3.5 h-3.5" /> BLOCKED
          </span>
        );
      case 'DEACTIVATED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 inline-flex items-center gap-1">
            <UserX className="w-3.5 h-3.5" /> DEACTIVATED
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> PENDING VERIFICATION
          </span>
        );
      default:
        return null;
    }
  };

  const DetailRow: React.FC<{ label: string; value?: any; isTag?: boolean }> = ({
    label,
    value,
    isTag = false,
  }) => {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return null;
    }
    const displayVal = Array.isArray(value) ? value.join(', ') : String(value);
    return (
      <div className="py-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-100 last:border-b-0 text-xs">
        <span className="text-slate-500 font-medium shrink-0 sm:w-1/3">{label}</span>
        {isTag ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-[11px] self-start sm:self-auto">
            {displayVal}
          </span>
        ) : (
          <span className="text-slate-900 font-semibold text-right sm:text-right break-words flex-1">
            {displayVal}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl sm:max-w-3xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 bg-white text-slate-900 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center text-[#F01472] shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-base text-slate-900 truncate">
                  {targetUser?.full_name || 'User Account Detail'}
                </h3>
                <p className="text-[11px] font-mono text-slate-500 truncate">
                  {targetUser?.profile_id ? `Profile: ${targetUser.profile_id}` : targetUser?.id}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          {targetUser && !loading && (
            <div className="flex items-center px-4 sm:px-6 bg-slate-50 border-b border-slate-200 shrink-0 gap-1 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('biodata')}
                className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'biodata'
                    ? 'border-[#F01472] text-[#F01472] font-bold bg-white/60'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Biodata Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'photos'
                    ? 'border-[#F01472] text-[#F01472] font-bold bg-white/60'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos ({allPhotos.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('account')}
                className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'account'
                    ? 'border-[#F01472] text-[#F01472] font-bold bg-white/60'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Account Governance</span>
              </button>

              <button
                onClick={() => setActiveTab('raw')}
                className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'raw'
                    ? 'border-[#F01472] text-[#F01472] font-bold bg-white/60'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Raw JSON</span>
              </button>
            </div>
          )}

          {/* Drawer Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#F01472]" />
                <p className="text-sm font-semibold">Loading complete user profile and photos...</p>
              </div>
            ) : error ? (
              <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
                <p className="text-sm font-bold text-rose-900">{error}</p>
              </div>
            ) : targetUser ? (
              <>
                {/* Profile Top Snapshot Card */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <UserAvatar
                      photoUrl={targetUser.profile_picture_url}
                      name={targetUser.full_name || targetUser.email}
                      size="lg"
                    />
                    <div className="min-w-0 space-y-1">
                      <h4 className="font-extrabold text-lg text-slate-900 truncate">
                        {p.fullName || p.name || targetUser.full_name || 'Unnamed User'}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{targetUser.email}</span>
                      </p>
                      {(p.contactNumber || p.phone || targetUser.phone) && (
                        <p className="text-xs text-slate-500 font-mono truncate flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{p.contactNumber || p.phone || targetUser.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                    {targetUser.profile_id && (
                      <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-mono font-bold border border-purple-200">
                        {targetUser.profile_id}
                      </span>
                    )}
                    {statusBadge(targetUser.status)}
                  </div>
                </div>

                {/* TAB 1: BIODATA PROFILE */}
                {activeTab === 'biodata' && (
                  <div className="space-y-6">
                    {/* Key Quick Highlights Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-medium block uppercase">Age / Gender</span>
                        <span className="text-xs font-bold text-slate-800">
                          {p.age || (p.dob ? `${p.dob}` : '—')} • {p.gender || '—'}
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-medium block uppercase">Height</span>
                        <span className="text-xs font-bold text-slate-800">
                          {p.height || (p.heightCm ? `${p.heightCm} cm` : '—')}
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-medium block uppercase">Religion / Caste</span>
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {[p.religion, p.caste].filter(Boolean).join(', ') || '—'}
                        </span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-medium block uppercase">Location</span>
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {p.currentCity || p.city || p.nativePlace || '—'}
                        </span>
                      </div>
                    </div>

                    {/* About / Bio Note */}
                    {(p.aboutMe || p.bio || p.professionalSummary) && (
                      <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-1.5">
                        <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> About Candidate
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed italic">
                          "{p.aboutMe || p.bio || p.professionalSummary}"
                        </p>
                      </div>
                    )}

                    {/* Section 1: Personal & Physical Details */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <UserIcon className="w-4 h-4 text-[#F01472]" />
                        <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                          Personal & Physical Attributes
                        </h5>
                      </div>
                      <div className="divide-y divide-slate-100">
                        <DetailRow label="Full Name" value={p.fullName || p.name || targetUser.full_name} />
                        <DetailRow label="Gender" value={p.gender} isTag />
                        <DetailRow label="Date of Birth" value={p.dob} />
                        <DetailRow label="Age" value={p.age ? `${p.age} years` : null} />
                        <DetailRow label="Time of Birth" value={p.timeOfBirth} />
                        <DetailRow label="Place of Birth" value={p.placeOfBirth} />
                        <DetailRow label="Marital Status" value={p.maritalStatus} isTag />
                        <DetailRow label="Height" value={p.height || (p.heightCm ? `${p.heightCm} cm` : null)} />
                        <DetailRow label="Weight" value={p.weight || (p.weightKg ? `${p.weightKg} kg` : null)} />
                        <DetailRow label="Blood Group" value={p.bloodGroup} isTag />
                        <DetailRow label="Complexion" value={p.complexion} />
                        <DetailRow label="Mother Tongue" value={p.motherTongue} />
                        <DetailRow label="Languages Known" value={p.languagesKnown || p.languages} />
                        <DetailRow label="Nationality" value={p.nationality} />
                      </div>
                    </div>

                    {/* Section 2: Education & Career */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                          Education & Professional Career
                        </h5>
                      </div>
                      <div className="divide-y divide-slate-100">
                        <DetailRow label="Highest Qualification" value={p.education || p.highestEducation || p.qualification} isTag />
                        <DetailRow label="Degree" value={p.degree} />
                        <DetailRow label="College / University" value={p.college || p.university} />
                        <DetailRow label="Occupation / Profession" value={p.occupation || p.profession} isTag />
                        <DetailRow label="Designation" value={p.designation} />
                        <DetailRow label="Employer / Company" value={p.company || p.employer} />
                        <DetailRow label="Annual Income" value={p.annualIncome || p.income || p.salaryRange} isTag />
                        <DetailRow label="Work Mode / Location" value={p.workMode || p.workLocation} />
                        <DetailRow label="Employment Type" value={p.employmentType} />
                        <DetailRow label="Total Experience" value={p.experienceYears ? `${p.experienceYears} Years` : null} />
                        <DetailRow label="Office Address" value={p.officeAddress} />
                        <DetailRow label="Business Details" value={p.businessDetails} />
                        <DetailRow label="LinkedIn Profile" value={p.linkedInUrl} />
                      </div>
                    </div>

                    {/* Section 3: Family Details */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <Home className="w-4 h-4 text-emerald-600" />
                        <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                          Family Background & Relations
                        </h5>
                      </div>
                      <div className="divide-y divide-slate-100">
                        <DetailRow label="Father's Name" value={p.fatherName} />
                        <DetailRow label="Father's Occupation" value={p.fatherOccupation} />
                        <DetailRow label="Mother's Name" value={p.motherName} />
                        <DetailRow label="Mother's Occupation" value={p.motherOccupation} />
                        <DetailRow
                          label="Brothers"
                          value={p.brotherCount !== undefined ? `${p.brotherCount} (${p.brotherDetails || 'None'})` : p.brothers}
                        />
                        <DetailRow
                          label="Sisters"
                          value={p.sisterCount !== undefined ? `${p.sisterCount} (${p.sisterDetails || 'None'})` : p.sisters}
                        />
                        <DetailRow label="Maternal Uncle (Mama)" value={p.maternalUncle} />
                        <DetailRow label="Family Type" value={p.familyType} isTag />
                        <DetailRow label="Family Values" value={p.familyValues} isTag />
                        <DetailRow label="Native Place" value={p.nativePlace} />
                        <DetailRow label="Family Location" value={p.familyLocation} />
                        <DetailRow label="Family Background Notes" value={p.familyBackground} />
                      </div>
                    </div>

                    {/* Section 4: Religious & Astrological Details */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <Compass className="w-4 h-4 text-amber-600" />
                        <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                          Religious & Horoscope (Kundali) Details
                        </h5>
                      </div>
                      <div className="divide-y divide-slate-100">
                        <DetailRow label="Religion" value={p.religion} isTag />
                        <DetailRow label="Caste" value={p.caste} isTag />
                        <DetailRow label="Sub-Caste" value={p.subCaste} />
                        <DetailRow label="Gotra" value={p.gotra || p.gothra} />
                        <DetailRow label="Kuldevata" value={p.kuldevata} />
                        <DetailRow label="Rashi (Moon Sign)" value={p.rashi} isTag />
                        <DetailRow label="Nakshatra" value={p.nakshatra} isTag />
                        <DetailRow label="Gan" value={p.gan} />
                        <DetailRow label="Nadi" value={p.nadi} />
                        <DetailRow label="Manglik Status" value={p.manglik} isTag />
                      </div>
                    </div>

                    {/* Section 5: Location & Contact Information */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <MapPin className="w-4 h-4 text-rose-600" />
                        <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                          Location & Contact Coordinates
                        </h5>
                      </div>
                      <div className="divide-y divide-slate-100">
                        <DetailRow label="Current City" value={p.currentCity || p.city} />
                        <DetailRow label="Current State" value={p.state} />
                        <DetailRow label="Current Address" value={p.currentAddress || p.address} />
                        <DetailRow label="Permanent Address" value={p.permanentAddress} />
                        <DetailRow label="Pincode" value={p.pincode} />
                        <DetailRow label="Primary Phone" value={p.contactNumber || p.phone || targetUser.phone} />
                        <DetailRow label="Registered Email" value={targetUser.email} />
                      </div>
                    </div>

                    {/* Section 6: Lifestyle & Habits */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <Heart className="w-4 h-4 text-pink-600" />
                        <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                          Lifestyle, Habits & Hobbies
                        </h5>
                      </div>
                      <div className="divide-y divide-slate-100">
                        <DetailRow label="Diet Preference" value={p.diet} isTag />
                        <DetailRow label="Smoking Habit" value={p.smoking} isTag />
                        <DetailRow label="Drinking Habit" value={p.drinking} isTag />
                        <DetailRow label="Hobbies & Interests" value={p.hobbies || p.interests} />
                        <DetailRow label="Fitness / Workout" value={p.fitness} />
                      </div>
                    </div>

                    {/* Section 7: Partner Expectations */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                          Partner Expectations & Preferences
                        </h5>
                      </div>
                      <div className="divide-y divide-slate-100">
                        <DetailRow
                          label="Expected Age"
                          value={
                            p.expectedAgeMin && p.expectedAgeMax
                              ? `${p.expectedAgeMin} - ${p.expectedAgeMax} years`
                              : p.expectedAge
                          }
                        />
                        <DetailRow
                          label="Expected Height"
                          value={
                            p.expectedHeightMin && p.expectedHeightMax
                              ? `${p.expectedHeightMin} - ${p.expectedHeightMax}`
                              : p.expectedHeight
                          }
                        />
                        <DetailRow label="Expected Education" value={p.expectedEducation} />
                        <DetailRow label="Expected Profession" value={p.expectedProfession} />
                        <DetailRow label="Expected Location" value={p.expectedLocation} />
                        <DetailRow label="Expected Religion" value={p.expectedReligion} />
                        <DetailRow label="Expected Caste" value={p.expectedCaste} />
                        <DetailRow label="Other Preferences" value={p.otherPreferences || p.partnerExpectations} />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: PHOTOS & MEDIA */}
                {activeTab === 'photos' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                          Uploaded Photos & Gallery Media
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          High-resolution view of user's uploaded portrait and gallery images.
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                        {allPhotos.length} Total
                      </span>
                    </div>

                    {allPhotos.length === 0 ? (
                      <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs font-bold text-slate-600">No profile photos uploaded</p>
                        <p className="text-[11px] text-slate-400">The user has not yet uploaded any pictures to their profile.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {allPhotos.map((photo, idx) => (
                          <div
                            key={idx}
                            className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/5] shadow-2xs hover:shadow-md transition cursor-pointer"
                            onClick={() => setPreviewImage(photo.url)}
                          >
                            <img
                              src={photo.url}
                              alt={photo.label}
                              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-2.5">
                              <span className="text-[10px] font-bold text-white truncate max-w-[80%]">
                                {photo.label}
                              </span>
                              <Maximize2 className="w-3.5 h-3.5 text-white shrink-0" />
                            </div>
                            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/70 text-white text-[9px] font-mono">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: ACCOUNT GOVERNANCE */}
                {activeTab === 'account' && (
                  <div className="space-y-6">
                    {/* Safeguard Notice for self */}
                    {isSelf && (
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold flex items-center gap-2">
                        <Lock className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>This is your active administrator account. Self-modification is disabled.</span>
                      </div>
                    )}

                    {/* Metadata Box */}
                    <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 text-xs shadow-2xs">
                      <div className="p-3.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-slate-400" /> Account UUID
                        </span>
                        <span className="font-mono text-slate-800 text-[11px] font-bold select-all">
                          {targetUser.id}
                        </span>
                      </div>

                      {targetUser.profile_id && (
                        <div className="p-3.5 flex items-center justify-between">
                          <span className="text-slate-500 font-medium flex items-center gap-2">
                            <Shield className="w-4 h-4 text-slate-400" /> Profile ID (TRUE-xxx)
                          </span>
                          <span className="font-mono text-purple-700 text-[11px] font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 select-all">
                            {targetUser.profile_id}
                          </span>
                        </div>
                      )}

                      {targetUser.biodata_slug && (
                        <div className="p-3.5 flex items-center justify-between">
                          <span className="text-slate-500 font-medium flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-400" /> Public Slug
                          </span>
                          <span className="font-mono text-slate-700 text-[11px]">
                            /p/{targetUser.biodata_slug}
                          </span>
                        </div>
                      )}

                      <div className="p-3.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400" /> Email Verification
                        </span>
                        <span className="font-bold">
                          {targetUser.is_email_verified ? (
                            <span className="text-emerald-700 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                          ) : (
                            <span className="text-amber-600 flex items-center gap-1 font-bold">
                              <Clock className="w-3.5 h-3.5" /> Unverified
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="p-3.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" /> Account Created
                        </span>
                        <span className="font-semibold text-slate-800 font-mono text-[11px]">
                          {new Date(targetUser.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-3.5 flex items-center justify-between">
                        <span className="text-slate-500 font-medium flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" /> Last Activity
                        </span>
                        <span className="font-semibold text-slate-800 font-mono text-[11px]">
                          {targetUser.last_login_at
                            ? new Date(targetUser.last_login_at).toLocaleString()
                            : 'Never'}
                        </span>
                      </div>
                    </div>

                    {/* Status Management Actions */}
                    <div className="space-y-3 pt-2">
                      <h5 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">
                        Administrative State Controls
                      </h5>

                      <div className="space-y-2">
                        {targetUser.status === 'ACTIVE' && !isSelf && (
                          <>
                            <button
                              onClick={() => onActionClick(targetUser, 'block')}
                              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                            >
                              <Ban className="w-4 h-4" /> Block User Account
                            </button>
                            <button
                              onClick={() => onActionClick(targetUser, 'deactivate')}
                              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                            >
                              <UserX className="w-4 h-4" /> Deactivate Account
                            </button>
                          </>
                        )}

                        {targetUser.status === 'BLOCKED' && (
                          <button
                            onClick={() => onActionClick(targetUser, 'unblock')}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                          >
                            <UserCheck className="w-4 h-4" /> Unblock & Restore Account
                          </button>
                        )}

                        {targetUser.status === 'DEACTIVATED' && (
                          <button
                            onClick={() => onActionClick(targetUser, 'activate')}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                          >
                            <UserCheck className="w-4 h-4" /> Reactivate Account
                          </button>
                        )}

                        {targetUser.status === 'PENDING_VERIFICATION' && (
                          <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                            Account is pending email verification. Status cannot be modified manually.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: RAW JSON DATA */}
                {activeTab === 'raw' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Raw User & Profile JSON Payload
                      </span>
                      <button
                        onClick={handleCopyJson}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-800 overflow-x-auto max-h-[500px]">
                      {JSON.stringify(targetUser, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Photo Zoom Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/90 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center">
            <img
              src={previewImage}
              alt="Photo preview"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-slate-700"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 p-2 rounded-full bg-white text-slate-900 shadow-xl hover:bg-slate-100 transition cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
