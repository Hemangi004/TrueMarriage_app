import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBiodata } from '../../context/BiodataContext';
import { WizardHeader } from './WizardHeader';
import { WizardFooter } from './WizardFooter';
import { QuestionCard } from './QuestionCard';
import { ChooseLanguageScreen } from './ChooseLanguageScreen';

// Question components — 28-field matrimonial biodata wizard
import { QFullName } from '../questions/QFullName';
import { QDobAge } from '../questions/QDobAge';
import { QBirthDetails } from '../questions/QBirthDetails';      // timeOfBirth + birthPlace
import { QReligion } from '../questions/QReligion';
import { QCaste } from '../questions/QCaste';
import { QAstroDetails } from '../questions/QAstroDetails';      // kuldevata, gotra, rashi, nakshatra, gan, nadi
import { QHeight } from '../questions/QHeight';
import { QComplexion } from '../questions/QComplexion';
import { QBloodGroup } from '../questions/QBloodGroup';
import { QEducation } from '../questions/QEducation';
import { QOccupation } from '../questions/QOccupation';           // occupation + income
import { QFamilyDetails } from '../questions/QFamilyDetails';    // fatherName, motherName, siblings
import { QRelationsDetails } from '../questions/QRelationsDetails'; // maternalUncle + relations
import { QCurrentAddress } from '../questions/QCurrentAddress';
import { QPhoneOtp } from '../questions/QPhoneOtp';
import { QPhotoUpload } from '../questions/QPhotoUpload';
import { QBiodataSummary } from '../questions/QBiodataSummary';
import { QMaritalGotra } from '../questions/QMaritalGotra';
import { QLanguages } from '../questions/QLanguages';
import { QLifestyleHobbies } from '../questions/QLifestyleHobbies';
import { QPartnerPreferences } from '../questions/QPartnerPreferences';

// Extra legacy (still used for non-critical flow)
import { QGender } from '../questions/QGender';
import { QAddressToggle } from '../questions/QAddressToggle';
import { QPermanentAddress } from '../questions/QPermanentAddress';
import { QEmailOtp } from '../questions/QEmailOtp';

/**
 * WIZARD QUESTION MAP (21 biodata fields):
 *
 *  Q1  — fullName          → QFullName
 *  Q2  — gender            → QGender
 *  Q3  — dateOfBirth       → QDobAge
 *  Q4  — timeOfBirth       → QBirthDetails (birthPlace also here)
 *  Q5  — religion          → QReligion
 *  Q6  — caste             → QCaste
 *  Q7  — kuldevata + gotra + rashi + nakshatra + gan + nadi → QAstroDetails
 *  Q8  — height            → QHeight
 *  Q9  — complexion        → QComplexion
 *  Q10 — bloodGroup        → QBloodGroup
 *  Q11 — education         → QEducation
 *  Q12 — occupation + income → QOccupation
 *  Q13 — fatherName + fatherOccupation + motherName + sister + brother → QFamilyDetails
 *  Q14 — maternalUncle + relations → QRelationsDetails
 *  Q15 — address           → QCurrentAddress
 *  Q16 — address same?     → QAddressToggle
 *  Q17 — permanentAddress  → QPermanentAddress
 *  Q18 — mobileNumber      → QPhoneOtp
 *  Q19 — email             → QEmailOtp
 *  Q20 — profilePhoto      → QPhotoUpload
 *  Q21 — maritalStatus + nativePlace → QMaritalGotra
 *  Q22 — languagesKnown    → QLanguages
 *  Q23 — lifestyle + hobbies → QLifestyleHobbies
 *  Q24 — partner preferences → QPartnerPreferences
 *  Q25 — AI summary + template selection → QBiodataSummary
 */
export const TOTAL_WIZARD_QUESTIONS = 25;

export const ConversationalWizard: React.FC = () => {
  const { isAuthenticated, isLoading, user, openLogin } = useAuth();
  const { wizardCompleted, questionIndex } = useBiodata();
  const navigate = useNavigate();
  const location = useLocation();

  const isProfileCompleted = Boolean(wizardCompleted || user?.is_profile_completed);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const fullPath = location.pathname + (location.search || '');
      sessionStorage.setItem('tm_post_login_redirect', fullPath);
      openLogin();
      navigate('/', { replace: true });
    } else if (isProfileCompleted && user?.role !== 'ADMIN') {
      // Option A: If a completed user accesses /wizard, redirect them to the discovery page
      navigate('/discover', { replace: true });
    }
  }, [isLoading, isAuthenticated, isProfileCompleted, user?.role, openLogin, navigate, location.pathname, location.search]);

  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean>(() => {
    try {
      if (questionIndex > 1) return true;
      return sessionStorage.getItem('tm_wizard_lang_selected') === 'true';
    } catch {
      return false;
    }
  });

  const handleBackToLanguageSelect = () => {
    try {
      sessionStorage.removeItem('tm_wizard_lang_selected');
    } catch {}
    setHasSelectedLanguage(false);
  };

  if (isLoading || !isAuthenticated || (isProfileCompleted && user?.role !== 'ADMIN')) {
    return null;
  }

  if (!hasSelectedLanguage) {
    return (
      <ChooseLanguageScreen
        onContinue={() => setHasSelectedLanguage(true)}
      />
    );
  }

  const renderQuestion = () => {
    switch (questionIndex) {
      // ── PERSONAL INFO ──
      case 1:
        return (
          <QuestionCard
            title="What's your full name?"
            subtitle="Enter your official name as it will appear on the biodata."
          >
            <QFullName />
          </QuestionCard>
        );
      case 2:
        return (
          <QuestionCard
            title="Select your gender"
            subtitle="Who is this biodata being created for?"
          >
            <QGender />
          </QuestionCard>
        );
      case 3:
        return (
          <QuestionCard
            title="When were you born?"
            subtitle="Your date of birth — age is auto-calculated."
          >
            <QDobAge />
          </QuestionCard>
        );
      case 4:
        return (
          <QuestionCard
            title="Time & Place of Birth"
            subtitle="Used for horoscope matching and kundali."
          >
            <QBirthDetails />
          </QuestionCard>
        );

      // ── RELIGION & COMMUNITY ──
      case 5:
        return (
          <QuestionCard
            title="What is your religion?"
            subtitle="Select or search your religion."
          >
            <QReligion />
          </QuestionCard>
        );
      case 6:
        return (
          <QuestionCard
            title="What's your caste & sub-caste?"
            subtitle="Specify your community or select from suggestions."
          >
            <QCaste />
          </QuestionCard>
        );

      // ── ASTRO / HOROSCOPE ──
      case 7:
        return (
          <QuestionCard
            title="Astrological Details"
            subtitle="Kuldevata, Gotra, Rashi, Nakshatra, Gan & Nadi."
          >
            <QAstroDetails />
          </QuestionCard>
        );

      // ── PHYSICAL ──
      case 8:
        return (
          <QuestionCard
            title="What's your height?"
            subtitle="Use the slider or quick pills to select."
          >
            <QHeight />
          </QuestionCard>
        );
      case 9:
        return (
          <QuestionCard
            title="What's your complexion?"
            subtitle="Select the option that best describes your skin tone."
          >
            <QComplexion />
          </QuestionCard>
        );
      case 10:
        return (
          <QuestionCard
            title="What's your blood group?"
            subtitle="Tap to select your blood group."
          >
            <QBloodGroup />
          </QuestionCard>
        );

      // ── EDUCATION & CAREER ──
      case 11:
        return (
          <QuestionCard
            title="What's your educational background?"
            subtitle="Add your degrees, colleges, and passing years."
          >
            <QEducation />
          </QuestionCard>
        );
      case 12:
        return (
          <QuestionCard
            title="What do you do for work?"
            subtitle="Tell us your occupation and annual income."
          >
            <QOccupation />
          </QuestionCard>
        );

      // ── FAMILY ──
      case 13:
        return (
          <QuestionCard
            title="Tell us about your family"
            subtitle="Parents' names, occupations, and siblings."
          >
            <QFamilyDetails />
          </QuestionCard>
        );
      case 14:
        return (
          <QuestionCard
            title="Maternal Uncle & Relatives"
            subtitle="Add your mama's name and notable family connections."
          >
            <QRelationsDetails />
          </QuestionCard>
        );

      // ── CONTACT ──
      case 15:
        return (
          <QuestionCard
            title="What's your current address?"
            subtitle="Where are you currently residing?"
          >
            <QCurrentAddress />
          </QuestionCard>
        );
      case 16:
        return (
          <QuestionCard
            title="Is Permanent Address same?"
            subtitle="Toggle 'Yes' to skip permanent address details."
          >
            <QAddressToggle />
          </QuestionCard>
        );
      case 17:
        return (
          <QuestionCard
            title="What's your permanent address?"
            subtitle="Specify your ancestral or permanent family residence."
          >
            <QPermanentAddress />
          </QuestionCard>
        );
      case 18:
        return (
          <QuestionCard
            title="What's your mobile number?"
            subtitle="Verify via OTP to get a trusted verification badge."
          >
            <QPhoneOtp />
          </QuestionCard>
        );
      case 19:
        return (
          <QuestionCard
            title="What's your email address?"
            subtitle="Receive your completed PDF biodata & match updates."
          >
            <QEmailOtp />
          </QuestionCard>
        );

      // ── PHOTO ──
      case 20:
        return (
          <QuestionCard
            title="Upload your profile photo"
            subtitle="Profiles with photos get 5x more responses."
          >
            <QPhotoUpload />
          </QuestionCard>
        );

      // ── SUMMARY & TEMPLATE ──
      case 21:
        return (
          <QuestionCard title="Marital Status" subtitle="Select your marital status.">
            <QMaritalGotra />
          </QuestionCard>
        );
      case 22:
        return (
          <QuestionCard title="Languages Known" subtitle="Which languages can you speak or read?">
            <QLanguages />
          </QuestionCard>
        );
      case 23:
        return (
          <QuestionCard title="Lifestyle & Hobbies" subtitle="Your diet, habits, and what you love to do.">
            <QLifestyleHobbies />
          </QuestionCard>
        );
      case 24:
        return (
          <QuestionCard title="Partner Preferences" subtitle="What are you looking for in a life partner?">
            <QPartnerPreferences />
          </QuestionCard>
        );
      case 25:
        return (
          <QuestionCard
            title="Step 1 — AI Bio Generator"
            subtitle="Craft a compelling matrimonial bio, then pick your template."
            isFullWidth={true}
          >
            <QBiodataSummary />
          </QuestionCard>
        );

      default:
        return (
          <QuestionCard title="What's your full name?">
            <QFullName />
          </QuestionCard>
        );
    }
  };

  return (
    <div className="wizard-scope min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-rose-50/60 via-white to-pink-50/80 pb-24 overflow-x-hidden">
      {/* Top Header */}
      <WizardHeader />

      {/* Center Question Card — pulled up to prevent bottom viewport cutoff */}
      <main className="flex-1 flex flex-col items-center justify-start w-full pt-1 sm:pt-2">
        {renderQuestion()}
      </main>

      {/* Sticky Bottom Bar */}
      <WizardFooter onBackToLanguageSelect={handleBackToLanguageSelect} />
    </div>
  );
};
