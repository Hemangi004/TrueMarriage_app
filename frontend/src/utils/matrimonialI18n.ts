/**
 * Matrimonial Multilingual Translation Dictionary & Engine
 * Provides instant, culturally accurate translations for all 28 biodata field labels,
 * section titles, deity shlokas, and common values across Indian and Global languages.
 */

import { getCachedIndicTransliteration } from '../services/indicTransliterationService';

export interface MatrimonialDictionary {
  // Titles & Sections
  title: string;
  aboutMe: string;
  personalDetails: string;
  familyDetails: string;
  contactDetails: string;
  horoscopeDetails: string;
  partnerExpectations: string;

  // 28 Core Biodata Field Labels
  fullName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  religion: string;
  caste: string;
  subCaste: string;
  kuldevata: string;
  gotra: string;
  rashi: string;
  nakshatra: string;
  gan: string;
  nadi: string;
  height: string;
  weight: string;
  complexion: string;
  bloodGroup: string;
  maritalStatus: string;
  motherTongue: string;
  education: string;
  occupation: string;
  companyName: string;
  annualIncome: string;
  workLocation: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brothers: string;
  sisters: string;
  maternalUncle: string;
  relations: string;
  nativePlace: string;
  familyType: string;
  address: string;
  mobileNumber: string;
  contactNo?: string;
  email: string;

  // Common Header Shloka & Profile Link
  deityShloka: string;
  profileLink?: string;
}

export const MATRIMONIAL_TRANSLATIONS: Record<string, MatrimonialDictionary> = {
  // English (Default)
  en: {
    title: 'Matrimonial Biodata',
    aboutMe: 'About Me',
    personalDetails: 'Personal Details',
    familyDetails: 'Family Details',
    contactDetails: 'Contact Details',
    horoscopeDetails: 'Horoscope Details',
    partnerExpectations: 'Partner Expectations',

    fullName: 'Full Name',
    dateOfBirth: 'Date of Birth',
    timeOfBirth: 'Time of Birth',
    placeOfBirth: 'Place of Birth',
    religion: 'Religion',
    caste: 'Caste',
    subCaste: 'Sub-Caste',
    kuldevata: 'Kuldevata',
    gotra: 'Gotra',
    rashi: 'Rashi',
    nakshatra: 'Nakshatra',
    gan: 'Gan',
    nadi: 'Nadi',
    height: 'Height',
    weight: 'Weight',
    complexion: 'Complexion',
    bloodGroup: 'Blood Group',
    maritalStatus: 'Marital Status',
    motherTongue: 'Mother Tongue',
    education: 'Education',
    occupation: 'Occupation',
    companyName: 'Company Name',
    annualIncome: 'Annual Income',
    workLocation: 'Work Location',
    fatherName: "Father's Name",
    fatherOccupation: "Father's Occupation",
    motherName: "Mother's Name",
    motherOccupation: "Mother's Occupation",
    brothers: 'Brothers',
    sisters: 'Sisters',
    maternalUncle: 'Maternal Uncle',
    relations: 'Relations',
    nativePlace: 'Native Place',
    familyType: 'Family Type',
    address: 'Address',
    mobileNumber: 'Mobile Number',
    contactNo: 'Contact No',
    email: 'Email ID',
    deityShloka: '|| Shree Ganeshay Namah ||',
    profileLink: 'Details Profile Link',
  },

  // Marathi (मराठी)
  mr: {
    title: 'बायोडाटा',
    aboutMe: 'माझ्याबद्दल',
    personalDetails: 'वैयक्तिक माहिती',
    familyDetails: 'कौटुंबिक माहिती',
    contactDetails: 'संपर्क माहिती',
    horoscopeDetails: 'कुंडली माहिती',
    partnerExpectations: 'अपेक्षित स्थळ',

    fullName: 'नाव',
    dateOfBirth: 'जन्म तारीख',
    timeOfBirth: 'जन्म वेळ',
    placeOfBirth: 'जन्म स्थळ',
    religion: 'धर्म',
    caste: 'जात',
    subCaste: 'पोटजात',
    kuldevata: 'कुलदैवत',
    gotra: 'गोत्र',
    rashi: 'राशी',
    nakshatra: 'नक्षत्र',
    gan: 'गण',
    nadi: 'नाडी',
    height: 'उंची',
    weight: 'वजन',
    complexion: 'वर्ण',
    bloodGroup: 'रक्तगट',
    maritalStatus: 'वैवाहिक स्थिती',
    motherTongue: 'मातृभाषा',
    education: 'शिक्षण',
    occupation: 'नोकरी/व्यवसाय',
    companyName: 'कंपनीचे नाव',
    annualIncome: 'वेतन/उत्पन्न',
    workLocation: 'कार्यस्थळ',
    fatherName: 'वडिलांचे नाव',
    fatherOccupation: 'वडिलांचा व्यवसाय',
    motherName: 'आईचे नाव',
    motherOccupation: 'आईचा व्यवसाय',
    brothers: 'भाऊ',
    sisters: 'बहीण',
    maternalUncle: 'मामा',
    relations: 'नातेसंबंध',
    nativePlace: 'मूळ गाव',
    familyType: 'कुटुंब प्रकार',
    address: 'पत्ता',
    mobileNumber: 'मो.नं.',
    contactNo: 'संपर्क क्रमांक',
    email: 'ईमेल',
    deityShloka: '॥ श्री गणेशाय नमः ॥',
    profileLink: 'सविस्तर प्रोफाइल लिंक',
  },

  // Hindi (हिन्दी)
  hi: {
    title: 'बायोडाटा',
    aboutMe: 'मेरे बारे में',
    personalDetails: 'व्यक्तिगत विवरण',
    familyDetails: 'पारिवारिक विवरण',
    contactDetails: 'संपर्क विवरण',
    horoscopeDetails: 'कुंडली विवरण',
    partnerExpectations: 'जीवनसाथी की अपेक्षाएं',

    fullName: 'पूरा नाम',
    dateOfBirth: 'जन्म तिथि',
    timeOfBirth: 'जन्म समय',
    placeOfBirth: 'जन्म स्थान',
    religion: 'धर्म',
    caste: 'जाति',
    subCaste: 'उपजाति',
    kuldevata: 'कुलदेवता',
    gotra: 'गोत्र',
    rashi: 'राशि',
    nakshatra: 'नक्षत्र',
    gan: 'गण',
    nadi: 'नाड़ी',
    height: 'ऊंचाई',
    weight: 'वजन',
    complexion: 'रंग-रूप',
    bloodGroup: 'रक्त समूह',
    maritalStatus: 'वैवाहिक स्थिति',
    motherTongue: 'मातृभाषा',
    education: 'शिक्षा',
    occupation: 'व्यवसाय',
    companyName: 'कंपनी का नाम',
    annualIncome: 'वार्षिक आय',
    workLocation: 'कार्यस्थल',
    fatherName: 'पिता का नाम',
    fatherOccupation: 'पिता का व्यवसाय',
    motherName: 'माता का नाम',
    motherOccupation: 'माता का व्यवसाय',
    brothers: 'भाई',
    sisters: 'बहन',
    maternalUncle: 'मामाजी',
    relations: 'रिश्तेदार',
    nativePlace: 'मूल निवास',
    familyType: 'परिवार का प्रकार',
    address: 'पता',
    mobileNumber: 'मोबाइल नंबर',
    contactNo: 'संपर्क नंबर',
    email: 'ईमेल',
    deityShloka: '॥ श्री गणेशाय नमः ॥',
    profileLink: 'विवरण प्रोफाइल लिंक',
  },

  // Gujarati (ગુજરાતી)
  gu: {
    title: 'લગ્ન બાયોડેટા (જીવન પરિચય)',
    aboutMe: 'મારા વિશે',
    personalDetails: 'વ્યક્તિગત વિગતો',
    familyDetails: 'કૌટુંબિક વિગતો',
    contactDetails: 'સંપર્ક વિગતો',
    horoscopeDetails: 'કુંડળી વિગતો',
    partnerExpectations: 'અપેક્ષિત જીવનસાથી',

    fullName: 'પૂરું નામ',
    dateOfBirth: 'જન્મ તારીખ',
    timeOfBirth: 'જન્મ સમય',
    placeOfBirth: 'જન્મ સ્થળ',
    religion: 'ધર્મ',
    caste: 'જ્ઞાતિ',
    subCaste: 'પેટા જ્ઞાતિ',
    kuldevata: 'કુળદેવતા',
    gotra: 'ગોત્ર',
    rashi: 'રાશિ',
    nakshatra: 'નક્ષત્ર',
    gan: 'ગણ',
    nadi: 'નાડી',
    height: 'ઊંચાઈ',
    weight: 'વજન',
    complexion: 'વર્ણ',
    bloodGroup: 'બ્લડ ગ્રુપ',
    maritalStatus: 'વૈવાહિક સ્થિતિ',
    motherTongue: 'માતૃભાષા',
    education: 'શિક્ષણ',
    occupation: 'નોકરી/વ્યવસાય',
    companyName: 'કંપનીનું નામ',
    annualIncome: 'વાર્ષિક આવક',
    workLocation: 'કામનું સ્થળ',
    fatherName: 'પિતાનું નામ',
    fatherOccupation: 'પિતાનો વ્યવસાય',
    motherName: 'માતાનું નામ',
    motherOccupation: 'માતાનો વ્યવસાય',
    brothers: 'ભાઈ',
    sisters: 'બહેન',
    maternalUncle: 'મોસાળ/મામા',
    relations: 'સંબંધીઓ',
    nativePlace: 'વતન',
    familyType: 'કુટુંબ પ્રકાર',
    address: 'સરनाમું',
    mobileNumber: 'મોબાઇલ નંબર',
    contactNo: 'સંપર્ક નંબર',
    email: 'ઇમેઇલ',
    deityShloka: '|| શ્રી ગણેશાય નમઃ ||',
    profileLink: 'વિગતવાર પ્રોફાઇલ લિંક',
  },

  // Bengali (বাংলা)
  bn: {
    title: 'বিবাহের বায়োডাটা',
    aboutMe: 'আমার সম্পর্কে',
    personalDetails: 'ব্যক্তিগত বিবরণ',
    familyDetails: 'পারিবারিক বিবরণ',
    contactDetails: 'যোগাযোগের বিবরণ',
    horoscopeDetails: 'কুষ্ঠি বিবরণ',
    partnerExpectations: 'প্রত্যাশিত পাত্র/পাত্রী',

    fullName: 'পূর্ণ নাম',
    dateOfBirth: 'জন্ম তারিখ',
    timeOfBirth: 'জন্ম সময়',
    placeOfBirth: 'জন্ম স্থান',
    religion: 'ধর্ম',
    caste: 'জাতি',
    subCaste: 'উপজাতি',
    kuldevata: 'কুলদেবতা',
    gotra: 'গোত্র',
    rashi: 'রাশি',
    nakshatra: 'নক্ষত্র',
    gan: 'গণ',
    nadi: 'নাড়ী',
    height: 'উচ্চতা',
    weight: 'ওজন',
    complexion: 'গায়ের রং',
    bloodGroup: 'রক্তের গ্রুপ',
    maritalStatus: 'বৈবাহিক অবস্থা',
    motherTongue: 'মাতৃভাষা',
    education: 'শিক্ষাগত যোগ্যতা',
    occupation: 'পেশা/চাকরি',
    companyName: 'প্রতিষ্ঠানের নাম',
    annualIncome: 'বার্ষিক আয়',
    workLocation: 'কাজের স্থান',
    fatherName: 'পিতার নাম',
    fatherOccupation: 'পিতার পেশা',
    motherName: 'মাতার নাম',
    motherOccupation: 'মাতার পেশা',
    brothers: 'ভাই',
    sisters: 'বোন',
    maternalUncle: 'মামার নাম',
    relations: 'আত্মীয়স্বজন',
    nativePlace: 'আদি নিবাস',
    familyType: 'পরিবারের ধরন',
    address: 'স্থায়ী ঠিকানা',
    mobileNumber: 'মোবাইল নম্বর',
    email: 'ইমেল',
    deityShloka: '|| শ্রী গণেশায় নমঃ ||',
    profileLink: 'বিস্তারিত প্রোফাইল লিঙ্ক',
  },

  // Tamil (தமிழ்)
  ta: {
    title: 'திருமண விவரக்குறிப்பு (பயோடேட்டா)',
    aboutMe: 'என்னை பற்றி',
    personalDetails: 'தனிப்பட்ட விவரங்கள்',
    familyDetails: 'குடும்ப விவரங்கள்',
    contactDetails: 'தொடர்பு விவரங்கள்',
    horoscopeDetails: 'ஜாதக விவரங்கள்',
    partnerExpectations: 'எதிர்பார்ப்புகள்',

    fullName: 'முழு பெயர்',
    dateOfBirth: 'பிறந்த தேதி',
    timeOfBirth: 'பிறந்த நேரம்',
    placeOfBirth: 'பிறந்த இடம்',
    religion: 'மதம்',
    caste: 'சாதி',
    subCaste: 'உபசாதி',
    kuldevata: 'குலதெய்வம்',
    gotra: 'கோத்திரம்',
    rashi: 'ராசி',
    nakshatra: 'நட்சத்திரம்',
    gan: 'கணம்',
    nadi: 'நாடி',
    height: 'உயரம்',
    weight: 'எடை',
    complexion: 'தோல் நிறம்',
    bloodGroup: 'இரத்த வகை',
    maritalStatus: 'திருமண நிலை',
    motherTongue: 'தாய்மொழி',
    education: 'கல்வித்தகுதி',
    occupation: 'தொழில்/வேலை',
    companyName: 'நிறுவனத்தின் பெயர்',
    annualIncome: 'வருமானம்',
    workLocation: 'பணிபுரியும் இடம்',
    fatherName: 'தந்தையின் பெயர்',
    fatherOccupation: 'தந்தை தொழில்',
    motherName: 'தாயின் பெயர்',
    motherOccupation: 'தாய் தொழில்',
    brothers: 'சகோதரர்கள்',
    sisters: 'சகோதரிகள்',
    maternalUncle: 'தாய்மாமன்',
    relations: 'உறவினர்கள்',
    nativePlace: 'சொந்த ஊர்',
    familyType: 'குடும்ப வகை',
    address: 'முகவரி',
    mobileNumber: 'அலைபேசி எண்',
    email: 'மின்னஞ்சல்',
    deityShloka: '|| ஸ்ரீ விநாயகர் துணை ||',
    profileLink: 'விவரங்கள் சுயவிவர இணைப்பு',
  },

  // Telugu (తెలుగు)
  te: {
    title: 'వివాహ పరిచయ పత్రం (బయోడేటా)',
    aboutMe: 'నా గురించి',
    personalDetails: 'వ్యక్తిగత వివరాలు',
    familyDetails: 'కుటుంబ వివరాలు',
    contactDetails: 'సంప్రదింపు వివరాలు',
    horoscopeDetails: 'జాతక వివరాలు',
    partnerExpectations: 'ఆశించే లక్షణాలు',

    fullName: 'పూర్తి పేరు',
    dateOfBirth: 'పుట్టిన తేదీ',
    timeOfBirth: 'పుట్టిన సమయం',
    placeOfBirth: 'పుట్టిన స్థలం',
    religion: 'మతం',
    caste: 'కులం',
    subCaste: 'ఉపకులం',
    kuldevata: 'కులదైవం',
    gotra: 'గోత్రం',
    rashi: 'రాశి',
    nakshatra: 'నక్షత్రం',
    gan: 'గణం',
    nadi: 'నాడి',
    height: 'ఎత్తు',
    weight: 'బరువు',
    complexion: 'వర్ణం',
    bloodGroup: 'రక్త వర్గం',
    maritalStatus: 'వైవాహిక స్థితి',
    motherTongue: 'మాతృభాష',
    education: 'విద్యార్హత',
    occupation: 'ఉద్యోగం',
    companyName: 'సంస్థ పేరు',
    annualIncome: 'వార్షિક ఆదాయం',
    workLocation: 'పనిచేసే ప్రదేశం',
    fatherName: 'తండ్రి పేరు',
    fatherOccupation: 'తండ్రి ఉద్యోగం',
    motherName: 'తల్లి పేరు',
    motherOccupation: 'తల్లి ఉద్యోగం',
    brothers: 'సోదరులు',
    sisters: 'సోదరీమణులు',
    maternalUncle: 'మేనమామ',
    relations: 'బంధువులు',
    nativePlace: 'స్వస్థలం',
    familyType: 'కుటుంబ రకం',
    address: 'చిరునామా',
    mobileNumber: 'మొబైల్ సంఖ్య',
    email: 'ఈమెయిల్',
    deityShloka: '|| శ్రీ గణేశాయ నమః ||',
    profileLink: 'వివరాల ప్రొఫైల్ లింక్',
  },

  // Kannada (ಕನ್ನಡ)
  kn: {
    title: 'ವಿವಾಹ ಪರಿಚಯ ಪತ್ರಿಕೆ (ಬಯೋಡೇಟಾ)',
    aboutMe: 'ನನ್ನ ಬಗ್ಗೆ',
    personalDetails: 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು',
    familyDetails: 'ಕುಟುಂಬದ ವಿವರಗಳು',
    contactDetails: 'ಸಂಪರ್ಕ ವಿವರಗಳು',
    horoscopeDetails: 'ಜಾತಕ ವಿವರಗಳು',
    partnerExpectations: 'ಅಪೇಕ್ಷಿತ ಸಂಗಾತಿ',

    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    dateOfBirth: 'ಜನ್ಮ ದಿನಾಂಕ',
    timeOfBirth: 'ಜನ್ಮ ಸಮಯ',
    placeOfBirth: 'ಜನ್ಮ ಸ್ಥಳ',
    religion: 'ಧರ್ಮ',
    caste: 'ಜಾತಿ',
    subCaste: 'ಉಪಜಾತಿ',
    kuldevata: 'ಕುಲದೇವತೆ',
    gotra: 'ಗೋತ್ರ',
    rashi: 'ರಾಶಿ',
    nakshatra: 'ನಕ್ಷತ್ರ',
    gan: 'ಗಣ',
    nadi: 'ನಾಡಿ',
    height: 'ಎತ್ತರ',
    weight: 'ತೂಕ',
    complexion: 'ಮೈಬಣ್ಣ',
    bloodGroup: 'ರಕ್ತದ ಗುಂಪು',
    maritalStatus: 'ವೈವಾಹಿಕ ಸ್ಥಿತಿ',
    motherTongue: 'ಮಾತೃಭಾಷೆ',
    education: 'ವಿದ್ಯಾಭ್ಯಾಸ',
    occupation: 'ಉದ್ಯೋಗ',
    companyName: 'ಸಂಸ್ಥೆಯ ಹೆಸರು',
    annualIncome: 'ವಾರ್ಷಿಕ ಆದಾಯ',
    workLocation: 'ಕೆಲಸದ ಸ್ಥಳ',
    fatherName: 'ತಂದೆಯ ಹೆಸರು',
    fatherOccupation: 'ತಂದೆಯ ಉದ್ಯೋಗ',
    motherName: 'ತಾಯಿಯ ಹೆಸರು',
    motherOccupation: 'ತಾಯಿಯ ಉದ್ಯೋಗ',
    brothers: 'ಸಹೋದರರು',
    sisters: 'ಸಹೋದರಿಯರು',
    maternalUncle: 'ಮಾವನ ಹೆಸರು',
    relations: 'ಸಂಬಂಧಿಕರು',
    nativePlace: 'ಸ್ವಂತ ಊರು',
    familyType: 'ಕುಟುಂಬದ ಪ್ರಕಾರ',
    address: 'ವಿಳಾಸ',
    mobileNumber: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    contactNo: 'ಸಂಪರ್ಕ ಸಂಖ್ಯೆ',
    email: 'ಇಮೇಲ್',
    deityShloka: '|| ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ||',
    profileLink: 'ವಿವರಗಳ ಪ್ರೊಫೈಲ್ ಲಿಂಕ್',
  },

  // Punjabi (ਪੰਜਾਬੀ)
  pa: {
    title: 'ਵਿਆਹ ਦਾ ਬਾਇਓਡਾਟਾ',
    aboutMe: 'ਮੇਰੇ ਬਾਰੇ',
    personalDetails: 'ਨਿੱਜੀ ਵੇਰਵੇ',
    familyDetails: 'ਪਰਿਵਾਰਕ ਵੇਰਵੇ',
    contactDetails: 'ਸੰਪਰਕ ਵੇਰਵੇ',
    horoscopeDetails: 'ਕੁੰਡਲੀ ਵੇਰਵੇ',
    partnerExpectations: 'ਸਾਥੀ ਦੀਆਂ ਉਮੀਦਾਂ',

    fullName: 'ਪੂਰਾ ਨਾਮ',
    dateOfBirth: 'ਜਨਮ ਮਿਤੀ',
    timeOfBirth: 'ਜਨਮ ਸਮਾਂ',
    placeOfBirth: 'ਜਨਮ ਸਥਾਨ',
    religion: 'ਧਰਮ',
    caste: 'ਜਾਤ',
    subCaste: 'ਉਪਜਾਤ',
    kuldevata: 'ਕੁਲਦੇਵਤਾ',
    gotra: 'ਗੋਤਰ',
    rashi: 'ਰਾਸ਼ੀ',
    nakshatra: 'ਨਛੱਤਰ',
    gan: 'ਗਣ',
    nadi: 'ਨਾੜੀ',
    height: 'ਕੱਦ',
    weight: 'ਭਾਰ',
    complexion: 'ਰੰਗ-ਰੂਪ',
    bloodGroup: 'ਬਲੱਡ ਗਰੁੱਪ',
    maritalStatus: 'ਵਿਆਹੁਤਾ ਸਥਿਤੀ',
    motherTongue: 'ਮਾਤ ਭਾਸ਼ਾ',
    education: 'ਵਿੱਦਿਆ',
    occupation: 'ਨੌਕਰੀ/ਕਾਰੋਬਾਰ',
    companyName: 'ਕੰਪਨੀ ਦਾ ਨਾਮ',
    annualIncome: 'ਸਾਲਾਨਾ ਆਮਦਨ',
    workLocation: 'ਕੰਮ ਦਾ ਸਥਾਨ',
    fatherName: 'ਪਿਤਾ ਦਾ ਨਾਮ',
    fatherOccupation: 'ਪਿਤਾ ਦਾ ਕਾਰੋਬਾਰ',
    motherName: 'ਮਾਤਾ ਦਾ ਨਾਮ',
    motherOccupation: 'ਮਾਤਾ ਦਾ ਕਾਰੋਬਾਰ',
    brothers: 'ਭਰਾ',
    sisters: 'ਭੈਣ',
    maternalUncle: 'ਮਾਮਾ ਜੀ',
    relations: 'ਰਿਸ਼ਤੇਦਾਰ',
    nativePlace: 'ਜੱਦੀ ਪਿੰਡ/ਸ਼ਹਿਰ',
    familyType: 'ਪਰਿਵਾਰ ਦੀ ਕਿਸਮ',
    address: 'ਰਿਹਾਇਸ਼ੀ ਪਤਾ',
    mobileNumber: 'ਮੋਬਾਈਲ ਨੰਬਰ',
    email: 'ਈਮੇਲ',
    deityShloka: '|| ੴ ਸਤਿਨਾਮ ਵਾਹਿਗੁਰੂ ||',
    profileLink: 'ਵੇਰਵੇ ਪ੍ਰੋਫਾਈਲ ਲਿੰਕ',
  },

  // Malayalam (മലയാളം)
  ml: {
    title: 'വിവാഹ ബയോഡാറ്റ',
    aboutMe: 'എന്നെക്കുറിച്ച്',
    personalDetails: 'വ്യക്തിഗത വിവരങ്ങൾ',
    familyDetails: 'കുടുംബ വിവരങ്ങൾ',
    contactDetails: 'ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ',
    horoscopeDetails: 'ജാതക വിവരങ്ങൾ',
    partnerExpectations: 'പ്രതീക്ഷിക്കുന്ന പങ്കാളി',

    fullName: 'മുഴുവൻ പേര്',
    dateOfBirth: 'ജനന തീയതി',
    timeOfBirth: 'ജനന സമയം',
    placeOfBirth: 'ജനിച്ച സ്ഥലം',
    religion: 'മതം',
    caste: 'ജാതി',
    subCaste: 'ഉപജാതി',
    kuldevata: 'കുലദേവത',
    gotra: 'ഗോത്രം',
    rashi: 'രാശി',
    nakshatra: 'നക്ഷത്രം',
    gan: 'ഗണം',
    nadi: 'നാഡി',
    height: 'ഉയരം',
    weight: 'തൂക്കം',
    complexion: 'നിറം',
    bloodGroup: 'രക്തഗ്രൂപ്പ്',
    maritalStatus: 'വൈവാഹിക നില',
    motherTongue: 'മാതൃഭാഷ',
    education: 'വിദ്യാഭ്യാസം',
    occupation: 'ജോലി',
    companyName: 'സ്ഥാപനത്തിന്റെ പേര്',
    annualIncome: 'വാർഷിക വരുമാനം',
    workLocation: 'ജോലി ചെയ്യുന്ന സ്ഥലം',
    fatherName: 'പിതാവിന്റെ പേര്',
    fatherOccupation: 'പിതാവിന്റെ ജോലി',
    motherName: 'മാതാവിന്റെ പേര്',
    motherOccupation: 'മാതാവിന്റെ ജോലി',
    brothers: 'സഹോദരന്മാർ',
    sisters: 'സഹോദരിമാർ',
    maternalUncle: 'അമ്മാവൻ',
    relations: 'ബന്ധുക്കൾ',
    nativePlace: 'സ്വദേശം',
    familyType: 'കുടുംബ തരം',
    address: 'മേൽവിലാസം',
    mobileNumber: 'മൊബൈൽ നമ്പർ',
    contactNo: 'ഫോൺ നമ്പർ',
    email: 'ഇമെയിൽ',
    deityShloka: '|| ശ്രീ ഗണേശായ നമഃ ||',
    profileLink: 'വിശദമായ പ്രൊഫൈൽ ലിങ്ക്',
  },

  // Odia (ଓଡ଼ିଆ)
  or: {
    title: 'ବିବାହ ବାୟୋଡାଟା',
    aboutMe: 'ମୋ ବିଷୟରେ',
    personalDetails: 'ବ୍ୟକ୍ତିଗତ ବିବରଣୀ',
    familyDetails: 'ପାରିବାରିକ ବିବରଣୀ',
    contactDetails: 'ଯୋଗାଯୋଗ ବିବରଣୀ',
    horoscopeDetails: 'କୁଣ୍ଡଳୀ ବିବରଣୀ',
    partnerExpectations: 'ଜୀବନସାଥୀଙ୍କ ଆଶା',

    fullName: 'ପୂରା ନାମ',
    dateOfBirth: 'ଜନ୍ମ ତାରିଖ',
    timeOfBirth: 'ଜନ୍ମ ସମୟ',
    placeOfBirth: 'ଜନ୍ମ ସ୍ଥାନ',
    religion: 'ଧର୍ମ',
    caste: 'ଜାତି',
    subCaste: 'ଉପଜାତି',
    kuldevata: 'କୁଳଦେବତା',
    gotra: 'ଗୋତ୍ର',
    rashi: 'ରାଶି',
    nakshatra: 'ନକ୍ଷତ୍ର',
    gan: 'ଗଣ',
    nadi: 'ନାଡ଼ି',
    height: 'ଉଚ୍ଚତା',
    weight: 'ଓଜନ',
    complexion: 'ରଙ୍ଗ',
    bloodGroup: 'ରକ୍ତ ବର୍ଗ',
    maritalStatus: 'ବୈବାହିକ ସ୍ଥିତି',
    motherTongue: 'ମାତୃଭାଷା',
    education: 'ଶିକ୍ଷାଗତ ଯୋଗ୍ୟତା',
    occupation: 'ବୃତ୍ତି',
    companyName: 'କମ୍ପାନୀର ନାମ',
    annualIncome: 'ବାର୍ଷିକ ଆୟ',
    workLocation: 'କାର୍ଯ୍ୟସ୍ଥଳୀ',
    fatherName: 'ପିତାଙ୍କ ନାମ',
    fatherOccupation: 'ପିତାଙ୍କ ବୃତ୍ତି',
    motherName: 'ମାତାଙ୍କ ନାମ',
    motherOccupation: 'ମାତାଙ୍କ ବୃତ୍ତି',
    brothers: 'ଭାଇ',
    sisters: 'ଭଉଣୀ',
    maternalUncle: 'ମାମୁଁ',
    relations: 'ସମ୍ପର୍କୀୟ',
    nativePlace: 'ନିଜ ଗ୍ରାମ / ସହର',
    familyType: 'ପରିବାର ପ୍ରକାର',
    address: 'ଠିକଣା',
    mobileNumber: 'ମୋବାଇଲ୍ ନମ୍ବର',
    contactNo: 'ଯୋଗାଯୋଗ ନମ୍ବର',
    email: 'ଇମେଲ୍',
    deityShloka: '|| ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ||',
    profileLink: 'ବିସ୍ତୃତ ପ୍ରୋଫାଇଲ୍ ଲିଙ୍କ୍',
  },

  // Assamese (অসমীয়া)
  as: {
    title: 'বিবাহৰ বায়’ডাটা',
    aboutMe: 'মোৰ বিষয়ে',
    personalDetails: 'ব্যক্তিগত বিৱৰণ',
    familyDetails: 'পাৰিবাৰিক বিৱৰণ',
    contactDetails: 'যোগাযোগৰ বিৱৰণ',
    horoscopeDetails: 'কোষ্ঠী বিৱৰণ',
    partnerExpectations: 'জীৱনসংগীৰ প্ৰত্যাশা',

    fullName: 'সম্পূৰ্ণ নাম',
    dateOfBirth: 'জন্ম তাৰিখ',
    timeOfBirth: 'জন্ম সময়',
    placeOfBirth: 'জন্মস্থান',
    religion: 'ধৰ্ম',
    caste: 'জাতি',
    subCaste: 'উপজাতি',
    kuldevata: 'কুলদেৱতা',
    gotra: 'গোত্ৰ',
    rashi: 'ৰাশি',
    nakshatra: 'নক্ষত্ৰ',
    gan: 'গণ',
    nadi: 'নাড়ী',
    height: 'উচ্চতা',
    weight: 'ওজন',
    complexion: 'বৰ্ণ',
    bloodGroup: 'তেজৰ গ্ৰুপ',
    maritalStatus: 'বৈবাহিক স্থিতি',
    motherTongue: 'মাতৃভাষা',
    education: 'শিক্ষাগত অৰ্হতা',
    occupation: 'বৃত্তি',
    companyName: 'প্ৰতিষ্ঠানৰ নাম',
    annualIncome: 'বাৰ্ষিক আয়',
    workLocation: 'কৰ্মস্থান',
    fatherName: 'দেউতাৰ নাম',
    fatherOccupation: 'দেউতাৰ বৃত্তি',
    motherName: 'মাৰ নাম',
    motherOccupation: 'মাৰ বৃত্তি',
    brothers: 'ভাই-ককাই',
    sisters: 'বাই-ভনী',
    maternalUncle: 'মোমাই',
    relations: 'আত্মীয়-স্বজন',
    nativePlace: 'নিজ গাঁও / চহৰ',
    familyType: 'পৰিয়ালৰ ধৰণ',
    address: 'ঠিকনা',
    mobileNumber: 'মোবাইল নম্বৰ',
    contactNo: 'যোগাযোগ নম্বৰ',
    email: 'ইমেইল',
    deityShloka: '|| শ্ৰী গণেশায় নমঃ ||',
    profileLink: 'বিস্তাৰিত প্ৰফাইল লিংক',
  },

  // Urdu (اردو)
  ur: {
    title: 'شادی کا بائیو ڈیٹا',
    aboutMe: 'میرے بارے میں',
    personalDetails: 'ذاتی تفصیلات',
    familyDetails: 'خاندانی تفصیلات',
    contactDetails: 'رابطے کی تفصیلات',
    horoscopeDetails: 'زائچہ کی تفصیلات',
    partnerExpectations: 'جیون ساتھی کی توقعات',

    fullName: 'پورا نام',
    dateOfBirth: 'تاریخ پیدائش',
    timeOfBirth: 'وقت پیدائش',
    placeOfBirth: 'مقام پیدائش',
    religion: 'مذہب',
    caste: 'قوم / ذات',
    subCaste: 'ذیلی ذات',
    kuldevata: 'خاندانی بزرگ',
    gotra: 'شجرہ نسب',
    rashi: 'برج',
    nakshatra: 'نکشترا',
    gan: 'گن',
    nadi: 'ناڈی',
    height: 'قد',
    weight: 'وزن',
    complexion: 'رنگت',
    bloodGroup: 'بلڈ گروپ',
    maritalStatus: 'ازدواجی حیثیت',
    motherTongue: 'مادری زبان',
    education: 'تعلیم',
    occupation: 'پیشہ',
    companyName: 'ادارے کا نام',
    annualIncome: 'سالانہ آمدنی',
    workLocation: 'ملازمت کا مقام',
    fatherName: 'والد کا نام',
    fatherOccupation: 'والد کا پیشہ',
    motherName: 'والدہ کا نام',
    motherOccupation: 'والدہ کا پیشہ',
    brothers: 'بھائی',
    sisters: 'بہنیں',
    maternalUncle: 'ماموں',
    relations: 'عزیز و اقارب',
    nativePlace: 'آبائی وطن',
    familyType: 'خاندان کی قسم',
    address: 'پتہ',
    mobileNumber: 'موبائل نمبر',
    contactNo: 'رابطہ نمبر',
    email: 'ای میل',
    deityShloka: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    profileLink: 'تفصیلی پروفائل لنک',
  },
};

/**
 * Reverse lookup map to identify the English canonical key for any label
 * in English, Marathi, Hindi, etc.
 */
const CANONICAL_KEY_LOOKUP: Record<string, keyof MatrimonialDictionary> = {
  // Titles & Subtitles
  'matrimonial biodata': 'title',
  'matrimonial bio-data': 'title',
  'matrimonial bio data': 'title',
  'biodata': 'title',
  'bio-data': 'title',
  'bio data': 'title',
  'बायोडाटा': 'title',
  'बायोडेटा': 'title',
  'वैवाहिक जीवन परिचय': 'title',
  'लग्न बायोडाटा': 'title',
  'about me': 'aboutMe',
  'माझ्याबद्दल': 'aboutMe',
  'मेरे बारे में': 'aboutMe',

  // Profile Link
  'details profile link': 'profileLink',
  'profile link': 'profileLink',
  'details profile': 'profileLink',
  'profile details link': 'profileLink',
  'public profile link': 'profileLink',
  'view profile': 'profileLink',
  'profile': 'profileLink',
  'सविस्तर प्रोफाइल लिंक': 'profileLink',
  'विवरण प्रोफाइल लिंक': 'profileLink',
  'વિગતવાર પ્રોફાઇલ લિંક': 'profileLink',
  'বিস্তারিত প্রোফাইল লিঙ্ক': 'profileLink',
  'விவரங்கள் சுயவிவர இணைப்பு': 'profileLink',
  'వివరాల ప్రొఫైల్ లింక్': 'profileLink',
  'ವಿವರಗಳ ಪ್ರೊಫೈಲ್ ಲಿಂಕ್': 'profileLink',
  'ਵੇਰਵੇ ਪ੍ਰੋਫਾਈਲ ਲਿੰਕ': 'profileLink',
  'വിശദമായ പ്രൊഫൈൽ ലിങ്ക്': 'profileLink',
  'ବିସ୍ତୃତ ପ୍ରୋଫାଇଲ୍ ଲିଙ୍କ୍': 'profileLink',
  'বিস্তাৰিত প্ৰফাইল লিংক': 'profileLink',
  'تفصیلی پروفائل لنک': 'profileLink',

  // Sections
  'personal details': 'personalDetails',
  'personal information': 'personalDetails',
  'वैयक्तिक माहिती': 'personalDetails',
  'व्यक्तिगत विवरण': 'personalDetails',
  'family details': 'familyDetails',
  'family background': 'familyDetails',
  'family information': 'familyDetails',
  'family': 'familyDetails',
  'कौटुंबिक माहिती': 'familyDetails',
  'पारिवारिक विवरण': 'familyDetails',
  'पारिवारिक पृष्ठभूमि': 'familyDetails',
  'contact details': 'contactDetails',
  'contact information': 'contactDetails',
  'contact': 'contactDetails',
  'संपर्क': 'contactDetails',
  'संपर्क माहिती': 'contactDetails',
  'संपर्क विवरण': 'contactDetails',
  'horoscope details': 'horoscopeDetails',
  'horoscope': 'horoscopeDetails',
  'kundali': 'horoscopeDetails',
  'कुंडली माहिती': 'horoscopeDetails',
  'कुंडली विवरण': 'horoscopeDetails',
  'partner expectations': 'partnerExpectations',
  'expectations': 'partnerExpectations',
  'अपेक्षित स्थळ': 'partnerExpectations',
  'जीवनसाथी की अपेक्षाएं': 'partnerExpectations',

  // 28 Core Biodata Fields & Common Variants
  'full name': 'fullName',
  'name': 'fullName',
  'नाव': 'fullName',
  'पूरा नाम': 'fullName',
  'date of birth': 'dateOfBirth',
  'dob': 'dateOfBirth',
  'birth date': 'dateOfBirth',
  'जन्म तारीख': 'dateOfBirth',
  'जन्म तिथि': 'dateOfBirth',
  'time of birth': 'timeOfBirth',
  'birth time': 'timeOfBirth',
  'जन्म वेळ': 'timeOfBirth',
  'जन्म समय': 'timeOfBirth',
  'place of birth': 'placeOfBirth',
  'birth place': 'placeOfBirth',
  'जन्म स्थळ': 'placeOfBirth',
  'जन्म स्थान': 'placeOfBirth',
  'religion': 'religion',
  'धर्म': 'religion',
  'caste': 'caste',
  'जात': 'caste',
  'जाति': 'caste',
  'sub-caste': 'subCaste',
  'subcaste': 'subCaste',
  'पोटजात': 'subCaste',
  'उपजाति': 'subCaste',
  'kuldevata': 'kuldevata',
  'kuldaivat': 'kuldevata',
  'kuladevata': 'kuldevata',
  'कुलदैवत': 'kuldevata',
  'कुलदेवता': 'kuldevata',
  'gotra': 'gotra',
  'गोत्र': 'gotra',
  'rashi': 'rashi',
  'raashi': 'rashi',
  'राशी': 'rashi',
  'राशि': 'rashi',
  'nakshatra': 'nakshatra',
  'नक्षत्र': 'nakshatra',
  'gan': 'gan',
  'गण': 'gan',
  'nadi': 'nadi',
  'नाडी': 'nadi',
  'नाड़ी': 'nadi',
  'height': 'height',
  'उंची': 'height',
  'ऊंचाई': 'height',
  'कद': 'height',
  'weight': 'weight',
  'वजन': 'weight',
  'complexion': 'complexion',
  'वर्ण': 'complexion',
  'रंग-रूप': 'complexion',
  'blood group': 'bloodGroup',
  'bloodgroup': 'bloodGroup',
  'blood group:': 'bloodGroup',
  'रक्तगट': 'bloodGroup',
  'रक्त समूह': 'bloodGroup',
  'marital status': 'maritalStatus',
  'वैवाहिक स्थिती': 'maritalStatus',
  'वैवाहिक स्थिति': 'maritalStatus',
  'mother tongue': 'motherTongue',
  'मातृभाषा': 'motherTongue',
  'education': 'education',
  'highest education': 'education',
  'qualification': 'education',
  'educational qualification': 'education',
  'शिक्षण': 'education',
  'शिक्षा': 'education',
  'occupation': 'occupation',
  'profession': 'occupation',
  'job': 'occupation',
  'नोकरी/व्यवसाय': 'occupation',
  'नोकरी': 'occupation',
  'व्यवसाय': 'occupation',
  'company name': 'companyName',
  'company': 'companyName',
  'कंपनीचे नाव': 'companyName',
  'annual income': 'annualIncome',
  'income': 'annualIncome',
  'salary': 'annualIncome',
  'वेतन/उत्पन्न': 'annualIncome',
  'वार्षिक आय': 'annualIncome',
  'उत्पन्न': 'annualIncome',
  'work location': 'workLocation',
  'job location': 'workLocation',
  'कार्यस्थळ': 'workLocation',
  "father's name": 'fatherName',
  'father name': 'fatherName',
  'father': 'fatherName',
  'वडिलांचे नाव': 'fatherName',
  'पिता का नाम': 'fatherName',
  'वडिल': 'fatherName',
  "father's occupation": 'fatherOccupation',
  'father occupation': 'fatherOccupation',
  'वडिलांचा व्यवसाय': 'fatherOccupation',
  'पिता का व्यवसाय': 'fatherOccupation',
  "mother's name": 'motherName',
  'mother name': 'motherName',
  'mother': 'motherName',
  'आईचे नाव': 'motherName',
  'माता का नाम': 'motherName',
  'आई': 'motherName',
  "mother's occupation": 'motherOccupation',
  'mother occupation': 'motherOccupation',
  'आईचा व्यवसाय': 'motherOccupation',
  'माता का व्यवसाय': 'motherOccupation',
  'brothers': 'brothers',
  'brother': 'brothers',
  'भाऊ': 'brothers',
  'भाई': 'brothers',
  'sisters': 'sisters',
  'sister': 'sisters',
  'बहीण': 'sisters',
  'बहन': 'sisters',
  'maternal uncle': 'maternalUncle',
  'mama': 'maternalUncle',
  'uncle': 'maternalUncle',
  'मामा': 'maternalUncle',
  'relations': 'relations',
  'relatives': 'relations',
  'नातेसंबंध': 'relations',
  'रिश्तेदार': 'relations',
  'native place': 'nativePlace',
  'मूळ गाव': 'nativePlace',
  'मूल निवास': 'nativePlace',
  'गाव': 'nativePlace',
  'family type': 'familyType',
  'कुटुंब प्रकार': 'familyType',
  'address': 'address',
  'residence address': 'address',
  'residence': 'address',
  'permanent address': 'address',
  'current address': 'address',
  'पत्ता': 'address',
  'निवासी पत्ता': 'address',
  'पता': 'address',
  'mobile number': 'mobileNumber',
  'contact number': 'contactNo',
  'contact no': 'contactNo',
  'contact no.': 'contactNo',
  'mobile no': 'mobileNumber',
  'mobile no.': 'mobileNumber',
  'phone': 'mobileNumber',
  'phone no': 'mobileNumber',
  'phone no.': 'mobileNumber',
  'मो.नं.': 'mobileNumber',
  'संपर्क क्रमांक': 'contactNo',
  'मोबाइल नंबर': 'mobileNumber',
  'email id': 'email',
  'email': 'email',
  'ईमेल': 'email',

  // ── Gujarati (gu) ──────────────────────────────────────────────────────────
  'મારા વિશે': 'aboutMe',
  'વ્યક્તિગત વિગતો': 'personalDetails',
  'કૌટુંબિક વિગતો': 'familyDetails',
  'સંપર્ક વિગતો': 'contactDetails',
  'કુંડળી વિગતો': 'horoscopeDetails',
  'અપેક્ષિત જીવનસાથી': 'partnerExpectations',

  'પૂરું નામ': 'fullName',
  'જન્મ તારીખ': 'dateOfBirth',
  'જન્મ સમય': 'timeOfBirth',
  'જન્મ સ્થળ': 'placeOfBirth',
  'ધર્મ': 'religion',
  'જ્ઞાતિ': 'caste',
  'પેટા જ્ઞાતિ': 'subCaste',
  'કુળદેવતા': 'kuldevata',
  'ગોત્ર': 'gotra',
  'રાશિ': 'rashi',
  'નક્ષત્ર': 'nakshatra',
  'ગણ': 'gan',
  'નાડી': 'nadi',
  'ઊંચાઈ': 'height',
  'વજન': 'weight',
  'વર્ણ': 'complexion',
  'બ્લડ ગ્રુપ': 'bloodGroup',
  'વૈવાહિક સ્થિતિ': 'maritalStatus',
  'માતૃભાષા': 'motherTongue',
  'શિક્ષણ': 'education',
  'નોકરી/વ્યવસાય': 'occupation',
  'કંપનીનું નામ': 'companyName',
  'વાર્ષિક આવક': 'annualIncome',
  'કામનું સ્થળ': 'workLocation',
  'પિતાનું નામ': 'fatherName',
  'પિતાનો વ્યવસાય': 'fatherOccupation',
  'માતાનું નામ': 'motherName',
  'માતાનો વ્યવસાય': 'motherOccupation',
  'ભાઈ': 'brothers',
  'બહેન': 'sisters',
  'મોસાળ/મામા': 'maternalUncle',
  'સંબંધીઓ': 'relations',
  'વતન': 'nativePlace',
  'કુટુંબ પ્રકાર': 'familyType',
  'સરનામું': 'address',
  'મોબાઇલ નંબર': 'mobileNumber',
  'સંપર્ક નંબર': 'contactNo',
  'ઇમેઇલ': 'email',

  // ── Bengali (bn) ───────────────────────────────────────────────────────────
  'আমার সম্পর্কে': 'aboutMe',
  'ব্যক্তিগত বিবরণ': 'personalDetails',
  'পারিবারিক বিবরণ': 'familyDetails',
  'যোগাযোগের বিবরণ': 'contactDetails',
  'কুষ্ঠি বিবরণ': 'horoscopeDetails',
  'প্রত্যাশিত পাত্র/পাত্রী': 'partnerExpectations',

  'পূর্ণ নাম': 'fullName',
  'জন্ম তারিখ': 'dateOfBirth',
  'জন্ম সময়': 'timeOfBirth',
  'জন্ম স্থান': 'placeOfBirth',
  'ধর্ম': 'religion',
  'জাতি': 'caste',
  'উপজাতি': 'subCaste',
  'কুলদেবতা': 'kuldevata',
  'গোত্র': 'gotra',
  'রাশি': 'rashi',
  'নক্ষত্র': 'nakshatra',
  'গণ': 'gan',
  'নাড়ী': 'nadi',
  'উচ্চতা': 'height',
  'ওজন': 'weight',
  'গায়ের রং': 'complexion',
  'রক্তের গ্রুপ': 'bloodGroup',
  'বৈবাহিক অবস্থা': 'maritalStatus',
  'মাতৃভাষা': 'motherTongue',
  'শিক্ষাগত যোগ্যতা': 'education',
  'পেশা/চাকরি': 'occupation',
  'প্রতিষ্ঠানের নাম': 'companyName',
  'বার্ষিক আয়': 'annualIncome',
  'কাজের স্থান': 'workLocation',
  'পিতার নাম': 'fatherName',
  'পিতার পেশা': 'fatherOccupation',
  'মাতার নাম': 'motherName',
  'মাতার পেশা': 'motherOccupation',
  'ভাই': 'brothers',
  'বোন': 'sisters',
  'মামার নাম': 'maternalUncle',
  'আত্মীয়স্বজন': 'relations',
  'আদি নিবাস': 'nativePlace',
  'পরিবারের ধরন': 'familyType',
  'স্থায়ী ঠিকানা': 'address',
  'মোবাইল নম্বর': 'mobileNumber',
  'ইমেল': 'email',

  // ── Tamil (ta) ─────────────────────────────────────────────────────────────
  'என்னை பற்றி': 'aboutMe',
  'தனிப்பட்ட விவரங்கள்': 'personalDetails',
  'குடும்ப விவரங்கள்': 'familyDetails',
  'தொடர்பு விவரங்கள்': 'contactDetails',
  'ஜாதக விவரங்கள்': 'horoscopeDetails',
  'எதிர்பார்ப்புகள்': 'partnerExpectations',

  'முழு பெயர்': 'fullName',
  'பிறந்த தேதி': 'dateOfBirth',
  'பிறந்த நேரம்': 'timeOfBirth',
  'பிறந்த இடம்': 'placeOfBirth',
  'மதம்': 'religion',
  'சாதி': 'caste',
  'உபசாதி': 'subCaste',
  'குலதெய்வம்': 'kuldevata',
  'கோத்திரம்': 'gotra',
  'ராசி': 'rashi',
  'நட்சத்திரம்': 'nakshatra',
  'கணம்': 'gan',
  'நாடி': 'nadi',
  'உயரம்': 'height',
  'எடை': 'weight',
  'தோல் நிறம்': 'complexion',
  'இரத்த வகை': 'bloodGroup',
  'திருமண நிலை': 'maritalStatus',
  'தாய்மொழி': 'motherTongue',
  'கல்வித்தகுதி': 'education',
  'தொழில்/வேலை': 'occupation',
  'நிறுவனத்தின் பெயர்': 'companyName',
  'வருமானம்': 'annualIncome',
  'பணிபுரியும் இடம்': 'workLocation',
  'தந்தையின் பெயர்': 'fatherName',
  'தந்தை தொழில்': 'fatherOccupation',
  'தாயின் பெயர்': 'motherName',
  'தாய் தொழில்': 'motherOccupation',
  'சகோதரர்கள்': 'brothers',
  'சகோதரிகள்': 'sisters',
  'தாய்மாமன்': 'maternalUncle',
  'உறவினர்கள்': 'relations',
  'சொந்த ஊர்': 'nativePlace',
  'குடும்ப வகை': 'familyType',
  'முகவரி': 'address',
  'அலைபேசி எண்': 'mobileNumber',
  'மின்னஞ்சல்': 'email',

  // ── Telugu (te) ────────────────────────────────────────────────────────────
  'నా గురించి': 'aboutMe',
  'వ్యక్తిగత వివరాలు': 'personalDetails',
  'కుటుంబ వివరాలు': 'familyDetails',
  'సంప్రదింపు వివరాలు': 'contactDetails',
  'జాతక వివరాలు': 'horoscopeDetails',
  'ఆశించే లక్షణాలు': 'partnerExpectations',

  'పూర్తి పేరు': 'fullName',
  'పుట్టిన తేదీ': 'dateOfBirth',
  'పుట్టిన సమయం': 'timeOfBirth',
  'పుట్టిన స్థలం': 'placeOfBirth',
  'మతం': 'religion',
  'కులం': 'caste',
  'ఉపకులం': 'subCaste',
  'కులదైవం': 'kuldevata',
  'గోత్రం': 'gotra',
  'రాశి': 'rashi',
  'నక్షత్రం': 'nakshatra',
  'గణం': 'gan',
  'నాడి': 'nadi',
  'ఎత్తు': 'height',
  'బరువు': 'weight',
  'వర్ణం': 'complexion',
  'రక్త వర్గం': 'bloodGroup',
  'వైవాహిక స్థితి': 'maritalStatus',
  'మాతృభాష': 'motherTongue',
  'విద్యార్హత': 'education',
  'ఉద్యోగం/వ్యాపారం': 'occupation',
  'సంస్థ పేరు': 'companyName',
  'వార్షిక ఆదాయం': 'annualIncome',
  'పనిచేసే ప్రదేశం': 'workLocation',
  'తండ్రి పేరు': 'fatherName',
  'తండ్రి ఉద్యోగం': 'fatherOccupation',
  'తల్లి పేరు': 'motherName',
  'తల్లి ఉద్యోగం': 'motherOccupation',
  'సోదరులు': 'brothers',
  'సోదరీమణులు': 'sisters',
  'మేనమామ': 'maternalUncle',
  'బంధువులు': 'relations',
  'స్వస్థలం': 'nativePlace',
  'కుటుంబ రకం': 'familyType',
  'చిరునామా': 'address',
  'మొబైల్ సంఖ్య': 'mobileNumber',
  'ఈమెయిల్': 'email',

  // ── Kannada (kn) ───────────────────────────────────────────────────────────
  'ನನ್ನ ಬಗ್ಗೆ': 'aboutMe',
  'ವೈಯಕ್ತಿಕ ವಿವರಗಳು': 'personalDetails',
  'ಕುಟುಂಬದ ವಿವರಗಳು': 'familyDetails',
  'ಸಂಪರ್ಕ ವಿವರಗಳು': 'contactDetails',
  'ಜಾತಕ ವಿವರಗಳು': 'horoscopeDetails',
  'ಅಪೇಕ್ಷಿತ ಸಂಗಾತಿ': 'partnerExpectations',

  'ಪೂರ್ಣ ಹೆಸರು': 'fullName',
  'ಜನ್ಮ ದಿನಾಂಕ': 'dateOfBirth',
  'ಜನ್ಮ ಸಮಯ': 'timeOfBirth',
  'ಜನ್ಮ ಸ್ಥಳ': 'placeOfBirth',
  'ಧರ್ಮ': 'religion',
  'ಜಾತಿ': 'caste',
  'ಉಪಜಾತಿ': 'subCaste',
  'ಕುಲದೇವತೆ': 'kuldevata',
  'ಗೋತ್ರ': 'gotra',
  'ರಾಶಿ': 'rashi',
  'ನಕ್ಷತ್ರ': 'nakshatra',
  'ಗಣ': 'gan',
  'ನಾಡಿ': 'nadi',
  'ಎತ್ತರ': 'height',
  'ತೂಕ': 'weight',
  'ಮೈಬಣ್ಣ': 'complexion',
  'ರಕ್ತದ ಗುಂಪು': 'bloodGroup',
  'ವೈವಾಹಿಕ ಸ್ಥಿತಿ': 'maritalStatus',
  'ಮಾತೃಭಾಷೆ': 'motherTongue',
  'ವಿದ್ಯಾಭ್ಯಾಸ': 'education',
  'ಉದ್ಯೋಗ': 'occupation',
  'ಸಂಸ್ಥೆಯ ಹೆಸರು': 'companyName',
  'ವಾರ್ಷಿಕ ಆದಾಯ': 'annualIncome',
  'ಕೆಲಸದ ಸ್ಥಳ': 'workLocation',
  'ತಂದೆಯ ಹೆಸರು': 'fatherName',
  'ತಂದೆಯ ಉದ್ಯೋಗ': 'fatherOccupation',
  'ತಾಯಿಯ ಹೆಸರು': 'motherName',
  'ತಾಯಿಯ ಉದ್ಯೋಗ': 'motherOccupation',
  'ಸಹೋದರರು': 'brothers',
  'ಸಹೋದರಿಯರು': 'sisters',
  'ಮಾವನ ಹೆಸರು': 'maternalUncle',
  'ಸಂಬಂಧಿಕರು': 'relations',
  'ಸ್ವಂತ ಊರು': 'nativePlace',
  'ಕುಟುಂಬದ ಪ್ರಕಾರ': 'familyType',
  'ವಿಳಾಸ': 'address',
  'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ': 'mobileNumber',
  'ಸಂಪರ್ಕ ಸಂಖ್ಯೆ': 'contactNo',
  'ಇಮೇಲ್': 'email',

  // ── Punjabi (pa) ───────────────────────────────────────────────────────────
  'ਮੇਰੇ ਬਾਰੇ': 'aboutMe',
  'ਨਿੱਜੀ ਵੇਰਵੇ': 'personalDetails',
  'ਪਰਿਵਾਰਕ ਵੇਰਵੇ': 'familyDetails',
  'ਸੰਪਰਕ ਵੇਰਵੇ': 'contactDetails',
  'ਕੁੰਡਲੀ ਵੇਰਵੇ': 'horoscopeDetails',
  'ਸਾਥੀ ਦੀਆਂ ਉਮੀਦਾਂ': 'partnerExpectations',

  'ਪੂਰਾ ਨਾਮ': 'fullName',
  'ਜਨਮ ਮਿਤੀ': 'dateOfBirth',
  'ਜਨਮ ਸਮਾਂ': 'timeOfBirth',
  'ਜਨਮ ਸਥਾਨ': 'placeOfBirth',
  'ਧਰਮ': 'religion',
  'ਜਾਤ': 'caste',
  'ਉਪਜਾਤ': 'subCaste',
  'ਕੁਲਦੇਵਤਾ': 'kuldevata',
  'ਗੋਤਰ': 'gotra',
  'ਰਾਸ਼ੀ': 'rashi',
  'ਨਛੱਤਰ': 'nakshatra',
  'ਗਣ': 'gan',
  'ਨਾੜੀ': 'nadi',
  'ਕੱਦ': 'height',
  'ਭਾਰ': 'weight',
  'ਰੰਗ-ਰੂਪ': 'complexion',
  'ਬਲੱਡ ਗਰੁੱਪ': 'bloodGroup',
  'ਵਿਆਹੁਤਾ ਸਥਿਤੀ': 'maritalStatus',
  'ਮਾਤ ਭਾਸ਼ਾ': 'motherTongue',
  'ਵਿੱਦਿਆ': 'education',
  'ਨੌਕਰੀ/ਕਾਰੋਬਾਰ': 'occupation',
  'ਕੰਪਨੀ ਦਾ ਨਾਮ': 'companyName',
  'ਸਾਲਾਨਾ ਆਮਦਨ': 'annualIncome',
  'ਕੰਮ ਦਾ ਸਥਾਨ': 'workLocation',
  'ਪਿਤਾ ਦਾ ਨਾਮ': 'fatherName',
  'ਪਿਤਾ ਦਾ ਕਾਰੋਬਾਰ': 'fatherOccupation',
  'ਮਾਤਾ ਦਾ ਨਾਮ': 'motherName',
  'ਮਾਤਾ ਦਾ ਕਾਰੋਬਾਰ': 'motherOccupation',
  'ਭਰਾ': 'brothers',
  'ਭੈਣ': 'sisters',
  'ਮਾਮਾ ਜੀ': 'maternalUncle',
  'ਰਿਸ਼ਤੇਦਾਰ': 'relations',
  'ਜੱਦੀ ਪਿੰਡ/ਸ਼ਹਿਰ': 'nativePlace',
  'ਪਰਿਵਾਰ ਦੀ ਕਿਸਮ': 'familyType',
  'ਰਿਹਾਇਸ਼ੀ ਪਤਾ': 'address',
  'ਮੋਬਾਈਲ ਨੰਬਰ': 'mobileNumber',
  'ਈਮੇਲ': 'email',

  // ── Malayalam (ml) ────────────────────────────────────────────────────────
  'എന്നെക്കുറിച്ച്': 'aboutMe',
  'വ്യക്തിഗത വിവരങ്ങൾ': 'personalDetails',
  'കുടുംബ വിവരങ്ങൾ': 'familyDetails',
  'ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ': 'contactDetails',
  'ജാതക വിവരങ്ങൾ': 'horoscopeDetails',
  'പ്രതീക്ഷിക്കുന്ന പങ്കാളി': 'partnerExpectations',
  'മുഴുവൻ പേര്': 'fullName',
  'ജനന തീയതി': 'dateOfBirth',
  'ജനന സമയം': 'timeOfBirth',
  'ജനിച്ച സ്ഥലം': 'placeOfBirth',
  'മതം': 'religion',
  'ജാതി': 'caste',
  'ഉപജാതി': 'subCaste',
  'കുലദേവത': 'kuldevata',
  'ഗോത്രം': 'gotra',
  'രാശി': 'rashi',
  'നക്ഷത്രം': 'nakshatra',
  'ഗണം': 'gan',
  'നാഡി': 'nadi',
  'ഉയരം': 'height',
  'തൂക്കം': 'weight',
  'നിറം': 'complexion',
  'രക്തഗ്രൂപ്പ്': 'bloodGroup',
  'വൈവാഹിക നില': 'maritalStatus',
  'മാതൃഭാഷ': 'motherTongue',
  'വിദ്യാഭ്യാസം': 'education',
  'ജോലി': 'occupation',
  'സ്ഥാപനത്തിന്റെ പേര്': 'companyName',
  'വാർഷിക വരുമാനം': 'annualIncome',
  'ജോലി ചെയ്യുന്ന സ്ഥലം': 'workLocation',
  'പിതാവിന്റെ പേര്': 'fatherName',
  'പിതാവിന്റെ ജോലി': 'fatherOccupation',
  'മാതാവിന്റെ പേര്': 'motherName',
  'മാതാവിന്റെ ജോലി': 'motherOccupation',
  'സഹോദരന്മാർ': 'brothers',
  'സഹോദരിമാർ': 'sisters',
  'അമ്മാവൻ': 'maternalUncle',
  'ബന്ധുക്കൾ': 'relations',
  'സ്വദേശം': 'nativePlace',
  'കുടുംബ തരം': 'familyType',
  'മേൽവിലാസം': 'address',
  'മൊബൈൽ നമ്പർ': 'mobileNumber',
  'ഇമെയിൽ': 'email',

  // ── Odia (or) ──────────────────────────────────────────────────────────────
  'ମୋ ବିଷୟରେ': 'aboutMe',
  'ବ୍ୟକ୍ତିଗତ ବିବରଣୀ': 'personalDetails',
  'ପାରିବାରିକ ବିବରଣୀ': 'familyDetails',
  'ଯୋଗାଯୋଗ ବିବରଣୀ': 'contactDetails',
  'କୁଣ୍ଡଳୀ ବିବରଣୀ': 'horoscopeDetails',
  'ଜୀବନସାଥୀଙ୍କ ଆଶା': 'partnerExpectations',
  'ପୂରା ନାମ': 'fullName',
  'ଜନ୍ମ ତାରିଖ': 'dateOfBirth',
  'ଜନ୍ମ ସମୟ': 'timeOfBirth',
  'ଜନ୍ମ ସ୍ଥାନ': 'placeOfBirth',
  'ଧର୍ମ': 'religion',
  'ଜାତି': 'caste',
  'ଉପଜାତି': 'subCaste',
  'କୁଳଦେବତା': 'kuldevata',
  'ଗୋତ୍ର': 'gotra',
  'ରାଶି': 'rashi',
  'ନକ୍ଷତ୍ର': 'nakshatra',
  'ନାଡ଼ି': 'nadi',
  'ଉଚ୍ଚତା': 'height',
  'ଓଜନ': 'weight',
  'ରଙ୍ଗ': 'complexion',
  'ରକ୍ତ ବର୍ଗ': 'bloodGroup',
  'ବୈବାହିକ ସ୍ଥିତି': 'maritalStatus',
  'ମାତୃଭାଷା': 'motherTongue',
  'ଶିକ୍ଷାଗତ ଯୋଗ୍ୟତା': 'education',
  'ବୃତ୍ତି': 'occupation',
  'କମ୍ପାନୀର ନାମ': 'companyName',
  'ବାର୍ଷିକ ଆୟ': 'annualIncome',
  'କାର୍ଯ୍ୟସ୍ଥଳୀ': 'workLocation',
  'ପିତାଙ୍କ ନାମ': 'fatherName',
  'ପିତାଙ୍କ ବୃତ୍ତି': 'fatherOccupation',
  'ମାତାଙ୍କ ନାମ': 'motherName',
  'ମାତାଙ୍କ ବୃତ୍ତି': 'motherOccupation',
  'ଭାଇ': 'brothers',
  'ଭଉଣୀ': 'sisters',
  'ମାମୁଁ': 'maternalUncle',
  'ସମ୍ପର୍କୀୟ': 'relations',
  'ନିଜ ଗ୍ରାମ / ସହର': 'nativePlace',
  'ପରିବାର ପ୍ରକାର': 'familyType',
  'ଠିକଣା': 'address',
  'ମୋବାଇଲ୍ ନମ୍ବର': 'mobileNumber',
  'ଇମେଲ୍': 'email',

  // ── Assamese (as) ──────────────────────────────────────────────────────────
  'মোৰ বিষয়ে': 'aboutMe',
  'ব্যক্তিগত বিৱৰণ': 'personalDetails',
  'পাৰিবাৰিক বিৱৰণ': 'familyDetails',
  'যোগাযোগৰ বিৱৰণ': 'contactDetails',
  'কোষ্ঠী বিৱৰণ': 'horoscopeDetails',
  'জীৱনসংগীৰ প্ৰত্যাশা': 'partnerExpectations',
  'সম্পূৰ্ণ নাম': 'fullName',
  'জন্ম তাৰিখ': 'dateOfBirth',
  'জন্মস্থান': 'placeOfBirth',
  'ধৰ্ম': 'religion',
  'কুলদেৱতা': 'kuldevata',
  'গোত্ৰ': 'gotra',
  'ৰাশি': 'rashi',
  'নক্ষত্ৰ': 'nakshatra',
  'বৰ্ণ': 'complexion',
  'তেজৰ গ্ৰুপ': 'bloodGroup',
  'বৈবাহিক স্থিতি': 'maritalStatus',
  'শিক্ষাগত অৰ্হতা': 'education',
  'প্ৰতিষ্ঠানৰ নাম': 'companyName',
  'বাৰ্ষিক আয়': 'annualIncome',
  'কৰ্মস্থান': 'workLocation',
  'দেউতাৰ নাম': 'fatherName',
  'দেউতাৰ বৃত্তি': 'fatherOccupation',
  'মাৰ নাম': 'motherName',
  'মাৰ বৃত্তি': 'motherOccupation',
  'ভাই-ককাই': 'brothers',
  'বাই-ভনী': 'sisters',
  'মোমাই': 'maternalUncle',
  'আত্মীয়-স্বজন': 'relations',
  'নিজ গাঁও / চহৰ': 'nativePlace',
  'পৰিয়ালৰ ধৰণ': 'familyType',
  'ঠিকনা': 'address',
  'মোবাইল নম্বৰ': 'mobileNumber',
  'ইমেইল': 'email',

  // ── Urdu (ur) ──────────────────────────────────────────────────────────────
  'میرے بارے میں': 'aboutMe',
  'ذاتی تفصیلات': 'personalDetails',
  'خاندانی تفصیلات': 'familyDetails',
  'رابطے کی تفصیلات': 'contactDetails',
  'زائچہ کی تفصیلات': 'horoscopeDetails',
  'جیون ساتھی کی توقعات': 'partnerExpectations',
  'پورا نام': 'fullName',
  'تاریخ پیدائش': 'dateOfBirth',
  'وقت پیدائش': 'timeOfBirth',
  'مقام پیدائش': 'placeOfBirth',
  'مذہب': 'religion',
  'قوم / ذات': 'caste',
  'ذیلی ذات': 'subCaste',
  'خاندانی بزرگ': 'kuldevata',
  'شجرہ نسب': 'gotra',
  'برج': 'rashi',
  'قد': 'height',
  'وزن': 'weight',
  'رنگت': 'complexion',
  'بلڈ گروپ': 'bloodGroup',
  'ازدواجی حیثیت': 'maritalStatus',
  'مادری زبان': 'motherTongue',
  'تعلیم': 'education',
  'پیشہ': 'occupation',
  'ادارے کا نام': 'companyName',
  'سالانہ آمدنی': 'annualIncome',
  'ملازمت کا مقام': 'workLocation',
  'والد کا نام': 'fatherName',
  'والد کا پیشہ': 'fatherOccupation',
  'والدہ کا نام': 'motherName',
  'والدہ کا پیشہ': 'motherOccupation',
  'بھائی': 'brothers',
  'بہنیں': 'sisters',
  'ماموں': 'maternalUncle',
  'عزیز و اقارب': 'relations',
  'آبائی وطن': 'nativePlace',
  'خاندان کی قسم': 'familyType',
  'پتہ': 'address',
  'موبائل نمبر': 'mobileNumber',
  'ای میل': 'email',

  // ── Deity Shlokas & Sacred Invocations ────────────────────────────────────
  'shree ganeshay namah': 'deityShloka',
  'shri ganeshay namah': 'deityShloka',
  'shri ganeshay namah:': 'deityShloka',
  'shree ganeshaya namah': 'deityShloka',
  'shri ganeshaya namah': 'deityShloka',
  'श्री गणेशाय नमः': 'deityShloka',
  'श्री गणेशाय नम:': 'deityShloka',
  'श्रीगणेशाय नमः': 'deityShloka',
  'श्रीमन् महागणधिपतये नमः': 'deityShloka',
  'શ્રી ગણેશાય નમઃ': 'deityShloka',
  'শ্রী গণেশায় নমঃ': 'deityShloka',
  'ஸ்ரீ விநாயகர் துணை': 'deityShloka',
  'శ్రీ గణేశాయ నమః': 'deityShloka',
  'ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ': 'deityShloka',
  'ੴ ਸਤਿਨਾਮ ਵਾਹਿਗੁਰੂ': 'deityShloka',
  'ശ്രീ ഗണേശായ നമഃ': 'deityShloka',
  'ଶ୍ରୀ ଗଣେଶାୟ ନମଃ': 'deityShloka',
  'শ্ৰী গণেশায় নমঃ': 'deityShloka',
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ': 'deityShloka',
  'bismillah': 'deityShloka',
};

export const MONTH_TRANSLATIONS: Record<string, Record<string, string>> = {
  mr: {
    january: 'जानेवारी', february: 'फेब्रुवारी', march: 'मार्च', april: 'एप्रिल', may: 'मे', june: 'जून',
    july: 'जुलै', august: 'ऑगस्ट', september: 'सप्टेंबर', october: 'ऑक्टोबर', november: 'नोव्हेंबर', december: 'डिसेंबर',
    jan: 'जानेवारी', feb: 'फेब्रुवारी', mar: 'मार्च', apr: 'एप्रिल', jun: 'जून', jul: 'जुलै', aug: 'ऑगस्ट', sep: 'सप्टेंबर', sept: 'सप्टेंबर', oct: 'ऑक्टोबर', nov: 'नोव्हेंबर', dec: 'डिसेंबर',
  },
  hi: {
    january: 'जनवरी', february: 'फरवरी', march: 'मार्च', april: 'अप्रैल', may: 'मई', june: 'जून',
    july: 'जुलाई', august: 'अगस्त', september: 'सितंबर', october: 'अक्टूबर', november: 'नवंबर', december: 'दिसंबर',
    jan: 'जनवरी', feb: 'फरवरी', mar: 'मार्च', apr: 'अप्रैल', jun: 'जून', jul: 'जुलाई', aug: 'अगस्त', sep: 'सितंबर', sept: 'सितंबर', oct: 'अक्टूबर', nov: 'नवंबर', dec: 'दिसंबर',
  },
  gu: {
    january: 'જાન્યુઆરી', february: 'ફેબ્રુઆરી', march: 'માર્ચ', april: 'એપ્રિલ', may: 'મે', june: 'જૂન',
    july: 'જુલાઈ', august: 'ઓગસ્ટ', september: 'સપ્ટેમ્બર', october: 'ઓક્ટોબર', november: 'નવેમ્બર', december: 'ડિસેમ્બર',
    jan: 'જાન્યુઆરી', feb: 'ફેબ્રુઆરી', mar: 'માર્ચ', apr: 'એપ્રિલ', jun: 'જૂન', jul: 'જુલાઈ', aug: 'ઓગસ્ટ', sep: 'સપ્ટેમ્બર', oct: 'ઓક્ટોબર', nov: 'નવેમ્બર', dec: 'ડિસેમ્બર',
  },
  bn: {
    january: 'জানুয়ারি', february: 'ফেব্রুয়ারি', march: 'মার্চ', april: 'এপ্রিল', may: 'মে', june: 'জুন',
    july: 'জুলাই', august: 'আগস্ট', september: 'সেপ্টেম্বর', october: 'অক্টোবর', november: 'নভেম্বর', december: 'ডিসেম্বর',
    jan: 'জানু', feb: 'ফেব্রু', mar: 'মার্চ', apr: 'এপ্রিল', jun: 'জুন', jul: 'জুলাই', aug: 'আগস্ট', sep: 'সেপ্টে', oct: 'অক্টো', nov: 'নভে', dec: 'ডিসে',
  },
  ta: {
    january: 'ஜனவரி', february: 'பிப்ரவரி', march: 'மார்ச்', april: 'ஏப்ரல்', may: 'மே', june: 'ஜூன்',
    july: 'ஜூலை', august: 'ஆகஸ்ட்', september: 'செப்டம்பர்', october: 'அக்டோபர்', november: 'நவம்பர்', december: 'டிசம்பர்',
    jan: 'ஜனவரி', feb: 'பிப்ரவரி', mar: 'மார்ச்', apr: 'ஏப்ரல்', jun: 'ஜூன்', jul: 'ஜூலை', aug: 'ஆகஸ்ட்', sep: 'செப்', oct: 'அக்', nov: 'நவ', dec: 'டிச',
  },
  te: {
    january: 'జనవరి', february: 'ఫిబ్రవరి', march: 'మార్చి', april: 'ఏప్రిల్', may: 'మే', june: 'జూన్',
    july: 'జూలై', august: 'ఆగస్టు', september: 'సెప్టెంబర్', october: 'అక్టోబర్', november: 'నవంబర్', december: 'డిసెంబర్',
    jan: 'జనవరి', feb: 'ఫిబ్రవరి', mar: 'మార్చి', apr: 'ఏప్రిల్', jun: 'జూన్', jul: 'జూలై', aug: 'ఆగస్టు', sep: 'సెప్టెంబర్', oct: 'అక్టోబర్', nov: 'నవంబర్', dec: 'డిసెంబర్',
  },
  kn: {
    january: 'ಜನವರಿ', february: 'ಫೆಬ್ರವರಿ', march: 'ಮಾರ್ಚ್', april: 'ಏಪ್ರಿಲ್', may: 'ಮೇ', june: 'ಜೂನ್',
    july: 'ಜುಲೈ', august: 'ಆಗಸ್ಟ್', september: 'ಸೆಪ್ಟೆಂಬರ್', october: 'ಅಕ್ಟೋಬರ್', november: 'ನವೆಂಬರ್', december: 'ಡಿಸೆಂಬರ್',
    jan: 'ಜನವರಿ', feb: 'ಫೆಬ್ರವರಿ', mar: 'ಮಾರ್ಚ್', apr: 'ಏಪ್ರಿಲ್', jun: 'ಜೂನ್', jul: 'ಜುಲೈ', aug: 'ಆಗಸ್ಟ್', sep: 'ಸೆಪ್ಟೆಂಬರ್', oct: 'ಅಕ್ಟೋಬರ್', nov: 'ನವೆಂಬರ್', dec: 'ಡಿಸೆಂಬರ್',
  },
  ml: {
    january: 'ജനുവരി', february: 'ഫെബ്രുവരി', march: 'മാർച്ച്', april: 'ഏപ്രിൽ', may: 'മെയ്', june: 'ജൂൺ',
    july: 'ജൂലൈ', august: 'ഓഗസ്റ്റ്', september: 'സെപ്റ്റംബർ', october: 'ഒക്ടോബർ', november: 'നവംബർ', december: 'ഡിസംബർ',
    jan: 'ജനു', feb: 'ഫെബ്രു', mar: 'മാർച്ച്', apr: 'ഏപ്രിൽ', jun: 'ജൂൺ', jul: 'ജൂലൈ', aug: 'ഓഗസ്റ്റ്', sep: 'സെപ്റ്റം', oct: 'ഒക്ടോ', nov: 'നവം', dec: 'ഡിസം',
  },
  pa: {
    january: 'ਜਨਵਰੀ', february: 'ਫ਼ਰਵਰੀ', march: 'ਮਾਰਚ', april: 'ਅਪ੍ਰੈਲ', may: 'ਮਈ', june: 'ਜੂਨ',
    july: 'ਜੁਲਾਈ', august: 'ਅਗਸਤ', september: 'ਸਤੰਬਰ', october: 'ਅਕਤੂਬਰ', november: 'ਨਵੰਬਰ', december: 'ਦਸੰਬਰ',
    jan: 'ਜਨ', feb: 'ਫ਼ਰ', mar: 'ਮਾਰਚ', apr: 'ਅਪ੍ਰੈਲ', jun: 'ਜੂਨ', jul: 'ਜੁਲਾਈ', aug: 'ਅਗਸਤ', sep: 'ਸਤੰ', oct: 'ਅਕਤੂ', nov: 'ਨਵੰ', dec: 'ਦਸੰ',
  },
  or: {
    january: 'ଜାନୁଆରୀ', february: 'ଫେବୃଆରୀ', march: 'ମାର୍ଚ୍ଚ', april: 'ଏପ୍ରିଲ', may: 'ମେ', june: 'ଜୁନ',
    july: 'ଜୁଲାଇ', august: 'ଅଗଷ୍ଟ', september: 'ସେପ୍ଟେମ୍ବର', october: 'ଅକ୍ଟୋବର', november: 'ନଭେମ୍ବର', december: 'ଡିସେମ୍ବର',
    jan: 'ଜାନୁ', feb: 'ଫେବୃ', mar: 'ମାର୍ଚ୍ଚ', apr: 'ଏପ୍ରିଲ', jun: 'ଜୁନ', jul: 'ଜୁଲାଇ', aug: 'ଅଗଷ୍ଟ', sep: 'ସେପ୍ଟେ', oct: 'ଅକ୍ଟୋ', nov: 'ନଭେ', dec: 'ଡିସେ',
  },
  as: {
    january: 'জানুৱাৰী', february: 'ফেব্ৰুৱাৰী', march: 'মাৰ্চ', april: 'এপ্ৰিল', may: 'মে’', june: 'জুন',
    july: 'জুলাই', august: 'আগষ্ট', september: 'ছেপ্টেম্বৰ', october: 'অক্টোবৰ', november: 'নৱেম্বৰ', december: 'ডিচেম্বৰ',
    jan: 'জানু', feb: 'ফেব্ৰু', mar: 'মাৰ্চ', apr: 'এপ্ৰিল', jun: 'জুন', jul: 'জুলাই', aug: 'আগষ্ট', sep: 'ছেপ্টে', oct: 'অক্টো', nov: 'নৱে', dec: 'ডিচে',
  },
  ur: {
    january: 'جنوری', february: 'فروری', march: 'مارچ', april: 'اپریل', may: 'مئی', june: 'جون',
    july: 'جولائی', august: 'اگست', september: 'ستمبر', october: 'اکتوبر', november: 'نومبر', december: 'دسمبر',
    jan: 'جنوری', feb: 'فروری', mar: 'مارچ', apr: 'اپریل', jun: 'جون', jul: 'جولائی', aug: 'اگست', sep: 'ستمبر', oct: 'اکتوبر', nov: 'نومبر', dec: 'دسمبر',
  },
};

export const COMMON_VALUE_TRANSLATIONS: Record<string, Record<string, string>> = {
  mr: {
    'none': 'नाही', 'not provided': 'दिलेले नाही', 'never married': 'अविवाहित', 'unmarried': 'अविवाहित',
    'divorced': 'घटस्फोटित', 'widowed': 'विधुर / विधवा', 'female': 'स्त्री', 'male': 'पुरुष',
    'very fair': 'अति गोरा', 'fair': 'गोरा', 'wheatish': 'गहूवर्ण', 'wheatish medium': 'सावळा / मध्यम',
    'wheatish brown': 'सावळा', 'dark': 'सावळा', 'medium': 'मध्यम',
    'nuclear family': 'विभक्त कुटुंब', 'joint family': 'एकत्र कुटुंब', 'private job': 'खाजगी नोकरी',
    'government job': 'शासकीय नोकरी', 'business': 'व्यवसाय', 'homemaker': 'गृहिणी', 'housewife': 'गृहिणी',
    'farmer': 'शेतकरी', 'farming': 'शेती', 'agriculture': 'शेती', 'retired': 'सेवानिवृत्त',
    'hindu': 'हिंदू', 'muslim': 'मुस्लिम', 'christian': 'ख्रिश्चन', 'sikh': 'शीख', 'jain': 'जैन', 'buddhist': 'बौद्ध',
    'software engineer': 'सॉफ्टवेअर इंजिनिअर', 'doctor': 'डॉक्टर', 'engineer': 'इंजिनिअर', 'teacher': 'शिक्षक', 'details profile link': 'सविस्तर प्रोफाइल लिंक', 'profile link': 'सविस्तर प्रोफाइल लिंक',
    '1 elder brother': '1 मोठा भाऊ', '2 elder brother': '2 मोठे भाऊ', '2 elder brothers': '2 मोठे भाऊ', '3 elder brothers': '3 मोठे भाऊ',
    '1 younger brother': '1 लहान भाऊ', '2 younger brother': '2 लहान भाऊ', '2 younger brothers': '2 लहान भाऊ',
    '1 brother': '1 भाऊ', '2 brother': '2 भाऊ', '2 brothers': '2 भाऊ',
    '1 elder sister': '1 मोठी बहीण', '2 elder sister': '2 मोठ्या बहिणी', '2 elder sisters': '2 मोठ्या बहिणी',
    '1 younger sister': '1 लहान बहीण', '2 younger sister': '2 लहान बहिणी', '2 younger sisters': '2 लहान बहिणी',
    '1 sister': '1 बहीण', '2 sister': '2 बहिणी', '2 sisters': '2 बहिणी',
    'elder brother': 'मोठा भाऊ', 'elder brothers': 'मोठे भाऊ', 'younger brother': 'लहान भाऊ', 'younger brothers': 'लहान भाऊ',
    'elder sister': 'मोठी बहीण', 'elder sisters': 'मोठ्या बहिणी', 'younger sister': 'लहान बहीण', 'younger sisters': 'लहान बहिणी',
    'brother': 'भाऊ', 'brothers': 'भाऊ', 'sister': 'बहीण', 'sisters': 'बहिणी',
    'no brother': 'भाऊ नाही', 'no sister': 'बहीण नाही', 'both married': 'दोन्ही विवाहित', 'both unmarried': 'दोन्ही अविवाहित',
  },
  hi: {
    'none': 'कोई नहीं', 'not provided': 'उपलब्ध नहीं', 'never married': 'अविवाहित', 'unmarried': 'अविवाहित',
    'divorced': 'तलाकशुदा', 'widowed': 'विधवा / विधुर', 'female': 'महिला', 'male': 'पुरुष',
    'very fair': 'बहुत गोरा', 'fair': 'गोरा', 'wheatish': 'गेहुंआ', 'wheatish medium': 'सांवला मध्यम',
    'wheatish brown': 'सांवला', 'dark': 'सांवला', 'medium': 'मध्यम',
    'nuclear family': 'एकल परिवार', 'joint family': 'संयुक्त परिवार', 'private job': 'निजी नौकरी',
    'government job': 'सरकारी नौकरी', 'business': 'व्यवसाय', 'homemaker': 'गृहणी', 'housewife': 'गृहणी',
    'farmer': 'किसान', 'farming': 'खेती', 'agriculture': 'कृषि', 'retired': 'सेवानिवृत्त',
    'hindu': 'हिन्दू', 'muslim': 'मुस्लिम', 'christian': 'ईसाई', 'sikh': 'सिख', 'jain': 'जैन', 'buddhist': 'बौद्ध',
    'software engineer': 'सॉफ्टवेयर इंजीनियर', 'doctor': 'डॉक्टर', 'engineer': 'इंजीनियर', 'teacher': 'अध्यापक', 'details profile link': 'विवरण प्रोफाइल लिंक', 'profile link': 'विवरण प्रोफाइल लिंक',
    '1 elder brother': '1 बड़ा भाई', '2 elder brother': '2 बड़े भाई', '2 elder brothers': '2 बड़े भाई', '3 elder brothers': '3 बड़े भाई',
    '1 younger brother': '1 छोटा भाई', '2 younger brother': '2 छोटे भाई', '2 younger brothers': '2 छोटे भाई',
    '1 brother': '1 भाई', '2 brother': '2 भाई', '2 brothers': '2 भाई',
    '1 elder sister': '1 बड़ी बहन', '2 elder sister': '2 बड़ी बहनें', '2 elder sisters': '2 बड़ी बहनें',
    '1 younger sister': '1 छोटी बहन', '2 younger sister': '2 छोटी बहनें', '2 younger sisters': '2 छोटी बहनें',
    '1 sister': '1 बहन', '2 sister': '2 बहनें', '2 sisters': '2 बहनें',
    'elder brother': 'बड़ा भाई', 'elder brothers': 'बड़े भाई', 'younger brother': 'छोटा भाई', 'younger brothers': 'छोटे भाई',
    'elder sister': 'बड़ी बहन', 'elder sisters': 'बड़ी बहनें', 'younger sister': 'छोटी बहन', 'younger sisters': 'छोटी बहनें',
    'brother': 'भाई', 'brothers': 'भाई', 'sister': 'बहन', 'sisters': 'बहनें',
    'no brother': 'कोई भाई नहीं', 'no sister': 'कोई बहन नहीं', 'both married': 'दोनों विवाहित', 'both unmarried': 'दोनों अविवाहित',
  },
  gu: {
    'none': 'નથી', 'not provided': 'આપેલ નથી', 'never married': 'અપરિણીત', 'unmarried': 'અપરિણીત',
    'divorced': 'છૂટાછેડા લીધેલ', 'widowed': 'વિધુર / વિધવા', 'female': 'સ્ત્રી', 'male': 'પુરુષ',
    'very fair': 'ખૂબ ગોરો', 'fair': 'ગોરો', 'wheatish': 'ઘઉંવર્ણ', 'wheatish medium': 'ઘઉંવર્ણ મધ્યમ',
    'dark': 'શ્યામ', 'nuclear family': 'વિભક્ત કુટુંબ', 'joint family': 'સંયુક્ત કુટુંબ',
    'private job': 'ખાનગી નોકરી', 'government job': 'સરકારી નોકરી', 'business': 'વેપાર / ધંધો',
    'homemaker': 'ગૃહિણી', 'housewife': 'ગૃહિણી',
    'hindu': 'હિન્દુ', 'muslim': 'મુસ્લિમ', 'christian': 'ખ્રિસ્તી', 'sikh': 'શીખ', 'jain': 'જૈન', 'buddhist': 'બૌદ્ધ',
    'software engineer': 'સોફ્ટવેર એન્જિનિયર', 'doctor': 'ડોક્ટર', 'engineer': 'એન્જિનિયર',
    '1 elder brother': '1 મોટો ભાઈ', '2 elder brother': '2 મોટા ભાઈ', '2 elder brothers': '2 મોટા ભાઈ', '3 elder brothers': '3 મોટા ભાઈ',
    '1 younger brother': '1 નાનો ભાઈ', '2 younger brother': '2 નાના ભાઈ', '2 younger brothers': '2 નાના ભાઈ',
    '1 brother': '1 ભાઈ', '2 brother': '2 ભાઈ', '2 brothers': '2 ભાઈ',
    '1 elder sister': '1 મોટી બહેન', '2 elder sister': '2 મોટી બહેનો', '2 elder sisters': '2 મોટી બહેનો',
    '1 younger sister': '1 નાની બહેન', '2 younger sister': '2 નાની બહેનો', '2 younger sisters': '2 નાની બહેનો',
    '1 sister': '1 બહેન', '2 sister': '2 બહેનો', '2 sisters': '2 બહેનો',
    'elder brother': 'મોટો ભાઈ', 'elder brothers': 'મોટા ભાઈ', 'younger brother': 'નાનો ભાઈ', 'younger brothers': 'નાના ભાઈ',
    'elder sister': 'મોટી બહેન', 'elder sisters': 'મોટી બહેનો', 'younger sister': 'નાની બહેન', 'younger sisters': 'નાની બહેનો',
    'brother': 'ભાઈ', 'brothers': 'ભાઈ', 'sister': 'બહેન', 'sisters': 'બહેનો',
    'no brother': 'ભાઈ નથી', 'no sister': 'બહેન નથી', 'both married': 'બંને પરિણીત', 'both unmarried': 'બંને અપરિણીત',
  },
  te: {
    'none': 'ఏమీ లేదు', 'not provided': 'అందించబడలేదు', 'never married': 'అవివాహిత', 'unmarried': 'అవివాహిత',
    'divorced': 'విడాకులు తీసుకున్న', 'widowed': 'వితంతువు / విధురుడు', 'female': 'స్త్రీ', 'male': 'పురుషుడు',
    'very fair': 'అతి తెలుపు', 'fair': 'తెలుపు', 'wheatish': 'గోధుమ వర్ణం', 'wheatish medium': 'గోధుమ వర్ణం (మధ్యస్థం)',
    'dark': 'నలుపు', 'nuclear family': 'చిన్న కుటుంబం', 'joint family': 'ఉమ్మడి కుటుంబం',
    'private job': 'ప్రైవేట్ ఉద్యోగం', 'government job': 'ప్రభుత్వ ఉద్యోగం', 'business': 'వ్యాపారం',
    'homemaker': 'గృహిణి', 'housewife': 'గృహిణి',
    'hindu': 'హిందూ', 'muslim': 'ముస్లిం', 'christian': 'క్రైస్తవ', 'sikh': 'సిక్కు', 'jain': 'జైన', 'buddhist': 'బౌద్ధ',
    'software engineer': 'సాఫ్ట్‌వేర్ ఇంజనీర్', 'doctor': 'వైద్యుడు (డాక్టర్)', 'engineer': 'ఇంజనీర్', 'teacher': 'ఉపాధ్యాయుడు', 'details profile link': 'వివరాల ప్రొఫైల్ లింక్', 'profile link': 'వివరాల ప్రొఫైల్ లింక్',
    '1 elder brother': '1 అన్నయ్య', '2 elder brother': '2 అన్నయ్యలు', '2 elder brothers': '2 అన్నయ్యలు', '3 elder brothers': '3 అన్నయ్యలు',
    '1 younger brother': '1 తమ్ముడు', '2 younger brother': '2 తమ్ముళ్ళు', '2 younger brothers': '2 తమ్ముళ్ళు',
    '1 brother': '1 సోదరుడు', '2 brother': '2 సోదరులు', '2 brothers': '2 సోదరులు',
    '1 elder sister': '1 అక్క', '2 elder sister': '2 అక్కలు', '2 elder sisters': '2 అక్కలు',
    '1 younger sister': '1 చెల్లెలు', '2 younger sister': '2 చెల్లెళ్ళు', '2 younger sisters': '2 చెల్లెళ్ళు',
    '1 sister': '1 సోదరి', '2 sister': '2 సోదరీమణులు', '2 sisters': '2 సోదరీమణులు',
    'elder brother': 'అన్నయ్య', 'elder brothers': 'అన్నయ్యలు', 'younger brother': 'తమ్ముడు', 'younger brothers': 'తమ్ముళ్ళు',
    'elder sister': 'అక్క', 'elder sisters': 'అక్కలు', 'younger sister': 'చెల్లెలు', 'younger sisters': 'చెల్లెళ్ళు',
    'brother': 'సోదరుడు', 'brothers': 'సోదరులు', 'sister': 'సోదరి', 'sisters': 'సోదరీమణులు',
    'no brother': 'సోదరుడు లేరు', 'no sister': 'సోదరి లేరు', 'both married': 'ఇద్దరూ వివాహితులు', 'both unmarried': 'ఇద్దరూ అవివాహితులు',
  },
  ta: {
    'none': 'இல்லை', 'not provided': 'வழங்கப்படவில்லை', 'never married': 'திருமணமாகாதவர்', 'unmarried': 'திருமணமாகாதவர்',
    'divorced': 'விவாகரத்து பெற்றவர்', 'widowed': 'விதவை / விதவர்', 'female': 'பெண்', 'male': 'ஆண்',
    'very fair': 'மிகுந்த சிகப்பு', 'fair': 'சிகப்பு', 'wheatish': 'மாநிறம்', 'wheatish medium': 'மாநிறம்',
    'dark': 'கருப்பு', 'nuclear family': 'தனி குடும்பம்', 'joint family': 'கூட்டு குடும்பம்',
    'private job': 'தனியார் பணி', 'government job': 'அரசு பணி', 'business': 'வணிகம்',
    'homemaker': 'இல்லத்தரசி', 'housewife': 'இல்லத்தரசி',
    'hindu': 'இந்து', 'muslim': 'முஸ்லிம்', 'christian': 'கிறிஸ்தவர்', 'sikh': 'சீக்கியர்', 'jain': 'சைனர்', 'buddhist': 'பௌத்தர்',
    'software engineer': 'மென்பொருள் பொறியாளர்', 'doctor': 'மருத்துவர்', 'engineer': 'பொறியாளர்',
    '1 elder brother': '1 அண்ணன்', '2 elder brother': '2 அண்ணன்கள்', '2 elder brothers': '2 அண்ணன்கள்', '3 elder brothers': '3 அண்ணன்கள்',
    '1 younger brother': '1 தம்பி', '2 younger brother': '2 தம்பிகள்', '2 younger brothers': '2 தம்பிகள்',
    '1 brother': '1 சகோதரர்', '2 brother': '2 சகோதரர்கள்', '2 brothers': '2 சகோதரர்கள்',
    '1 elder sister': '1 அக்கா', '2 elder sister': '2 அக்காக்கள்', '2 elder sisters': '2 அக்காக்கள்',
    '1 younger sister': '1 தங்கை', '2 younger sister': '2 தங்கைகள்', '2 younger sisters': '2 தங்கைகள்',
    '1 sister': '1 சகோதரி', '2 sister': '2 சகோதரிகள்', '2 sisters': '2 சகோதரிகள்',
    'elder brother': 'அண்ணன்', 'elder brothers': 'அண்ணன்கள்', 'younger brother': 'தம்பி', 'younger brothers': 'தம்பிகள்',
    'elder sister': 'அக்கா', 'elder sisters': 'அக்காக்கள்', 'younger sister': 'தங்கை', 'younger sisters': 'தங்கைகள்',
    'brother': 'சகோதரர்', 'brothers': 'சகோதரர்கள்', 'sister': 'சகோதரி', 'sisters': 'சகோதரிகள்',
    'no brother': 'சகோதரர் இல்லை', 'no sister': 'சகோதரி இல்லை', 'both married': 'இருவரும் திருமணமானவர்கள்', 'both unmarried': 'இருவரும் திருமணமாகாதவர்கள்',
  },
  kn: {
    'none': 'ಯಾವುದೂ ಇಲ್ಲ', 'not provided': 'ಒದಗಿಸಲಾಗಿಲ್ಲ', 'never married': 'ಅವಿವಾಹಿತ', 'unmarried': 'ಅವಿವಾಹಿತ',
    'divorced': 'ವಿಚ್ಛೇದಿತ', 'widowed': 'ವಿಧುರ / ವಿಧವೆ', 'female': 'ಮಹಿಳೆ', 'male': 'ಪುರುಷ',
    'very fair': 'ಅತಿ ಬಿಳಿ', 'fair': 'ಬಿಳಿ / ಸುಂದರ', 'wheatish': 'ಗೋಧಿ ಬಣ್ಣ', 'wheatish medium': 'ಗೋಧಿ ಮೈಬಣ್ಣ',
    'dark': 'ಕಪ್ಪು', 'nuclear family': 'ವಿಭಕ್ತ ಕುಟುಂಬ', 'joint family': 'ಅವಿಭಕ್ತ ಕುಟುಂಬ',
    'private job': 'ಖಾಸಗಿ ನೌಕರಿ', 'government job': 'ಸರ್ಕಾರಿ ನೌಕರಿ', 'business': 'ವ್ಯವಹಾರ',
    'homemaker': 'ಗೃಹಿಣಿ', 'housewife': 'ಗೃಹಿಣಿ',
    'hindu': 'ಹಿಂದೂ', 'muslim': 'ಮುಸ್ಲಿಂ', 'christian': 'ಕ್ರಿಶ್ಚಿಯನ್', 'sikh': 'ಸಿಖ್', 'jain': 'ಜೈನ', 'buddhist': 'ಬೌದ್ಧ',
    'software engineer': 'ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಜಿನಿಯರ್', 'doctor': 'ವೈದ್ಯರು', 'engineer': 'ಇಂಜಿನಿಯರ್',
    '1 elder brother': '1 ಅಣ್ಣ', '2 elder brother': '2 ಅಣ್ಣಂದಿರು', '2 elder brothers': '2 ಅಣ್ಣಂದಿರು', '3 elder brothers': '3 ಅಣ್ಣಂದಿರು',
    '1 younger brother': '1 ತಮ್ಮ', '2 younger brother': '2 ತಮ್ಮಂದಿರು', '2 younger brothers': '2 ತಮ್ಮಂದಿರು',
    '1 brother': '1 ಸಹೋದರ', '2 brother': '2 ಸಹೋದರರು', '2 brothers': '2 ಸಹೋದರರು',
    '1 elder sister': '1 ಅಕ್ಕ', '2 elder sister': '2 ಅಕ್ಕಂದಿರು', '2 elder sisters': '2 ಅಕ್ಕಂದಿರು',
    '1 younger sister': '1 ತಂಗಿ', '2 younger sister': '2 ತಂಗಿಯರು', '2 younger sisters': '2 ತಂಗಿಯರು',
    '1 sister': '1 ಸಹೋದರಿ', '2 sister': '2 ಸಹೋದರಿಯರು', '2 sisters': '2 ಸಹೋದರಿಯರು',
    'elder brother': 'ಅಣ್ಣ', 'elder brothers': 'ಅಣ್ಣಂದಿರು', 'younger brother': 'ತಮ್ಮ', 'younger brothers': 'ತಮ್ಮಂದಿರು',
    'elder sister': 'ಅಕ್ಕ', 'elder sisters': 'ಅಕ್ಕಂದಿರು', 'younger sister': 'ತಂಗಿ', 'younger sisters': 'ತಂಗಿಯರು',
    'brother': 'ಸಹೋದರ', 'brothers': 'ಸಹೋದರರು', 'sister': 'ಸಹೋದರಿ', 'sisters': 'ಸಹೋದರಿಯರು',
    'no brother': 'ಸಹೋದರರಿಲ್ಲ', 'no sister': 'ಸಹೋದರಿಯರಿಲ್ಲ', 'both married': 'ಇಬ್ಬರೂ ವಿವಾಹಿತರು', 'both unmarried': 'ಇಬ್ಬರೂ ಅವಿವಾಹಿತರು',
  },
  bn: {
    'none': 'কিছুই না', 'not provided': 'প্রদান করা হয়নি', 'never married': 'অবিবাহিত', 'unmarried': 'অবিবাহিত',
    'divorced': 'বিবাহবিচ্ছিন্ন', 'widowed': 'বিপত্নীক / বিধবা', 'female': 'মহিলা', 'male': 'পুরুষ',
    'very fair': 'খুব ফর্সা', 'fair': 'ফর্সা', 'wheatish': 'শ্যামলা', 'wheatish medium': 'শ্যামলা মাঝারি',
    'dark': 'কালো', 'nuclear family': 'একক পরিবার', 'joint family': 'যৌথ পরিবার',
    'private job': 'বেসরকারি চাকরি', 'government job': 'সরকারি চাকরি', 'business': 'ব্যবসা',
    'homemaker': 'গৃহিণী', 'housewife': 'গৃহিণী',
    'hindu': 'হিন্দু', 'muslim': 'মুসলিম', 'christian': 'খ্রিস্টান', 'sikh': 'শিখ', 'jain': 'জৈন', 'buddhist': 'বৌদ্ধ',
    'software engineer': 'সফটওয়্যার ইঞ্জিনিয়ার', 'doctor': 'ডাক্তার', 'engineer': 'ইঞ্জিনিয়ার',
    '1 elder brother': '1 বড় ভাই', '2 elder brother': '2 বড় ভাই', '2 elder brothers': '2 বড় ভাই', '3 elder brothers': '3 বড় ভাই',
    '1 younger brother': '1 ছোট ভাই', '2 younger brother': '2 ছোট ভাই', '2 younger brothers': '2 ছোট ভাই',
    '1 brother': '1 ভাই', '2 brother': '2 ভাই', '2 brothers': '2 ভাই',
    '1 elder sister': '1 বড় বোন', '2 elder sister': '2 বড় বোন', '2 elder sisters': '2 বড় বোন',
    '1 younger sister': '1 ছোট বোন', '2 younger sister': '2 ছোট বোন', '2 younger sisters': '2 ছোট বোন',
    '1 sister': '1 বোন', '2 sister': '2 বোন', '2 sisters': '2 বোন',
    'elder brother': 'বড় ভাই', 'elder brothers': 'বড় ভাই', 'younger brother': 'ছোট ভাই', 'younger brothers': 'ছোট ভাই',
    'elder sister': 'বড় বোন', 'elder sisters': 'বড় বোন', 'younger sister': 'ছোট বোন', 'younger sisters': 'ছোট বোন',
    'brother': 'ভাই', 'brothers': 'ভাই', 'sister': 'বোন', 'sisters': 'বোন',
    'no brother': 'কোন ভাই নেই', 'no sister': 'কোন বোন নেই', 'both married': 'উভয়েই বিবাহিত', 'both unmarried': 'উভয়েই অবিবাহিত',
  },
  ml: {
    'none': 'ഇല്ല', 'not provided': 'നൽകിയിട്ടില്ല', 'never married': 'അവിവാഹിതൻ / അവിവാഹിത', 'unmarried': 'അവിവാഹിതൻ / അവിവാഹിത',
    'divorced': 'വിവാഹമോചിതൻ / വിവാഹമോചിത', 'widowed': 'വിധവ / വിധുരൻ', 'female': 'സ്ത്രീ', 'male': 'പുരുഷൻ',
    'very fair': 'വളരെ വെളുത്ത', 'fair': 'വെളുത്ത', 'wheatish': 'മാനിറം', 'wheatish medium': 'മാനിറം',
    'dark': 'കറുത്ത', 'nuclear family': 'അണുകുടുംബം', 'joint family': 'കൂട്ടുകുടുംബം',
    'private job': 'സ്വകാര്യ ജോലി', 'government job': 'സർക്കാർ ജോലി', 'business': 'ബിസിനസ്സ്',
    'homemaker': 'വീട്ടമ്മ', 'housewife': 'വീട്ടമ്മ',
    'hindu': 'ഹിന്ദു', 'muslim': 'മുസ്ലിം', 'christian': 'ക്രിസ്ത്യൻ', 'sikh': 'സിഖ്', 'jain': 'ജൈനൻ', 'buddhist': 'ബുദ്ധമതം',
    'software engineer': 'സോഫ്റ്റ്‌വെയർ എഞ്ചിനീയർ', 'doctor': 'ഡോക്ടർ', 'engineer': 'എഞ്ചിനീയർ',
    '1 elder brother': '1 ജ്യേഷ്ഠൻ', '2 elder brother': '2 ജ്യേഷ്ഠന്മാർ', '2 elder brothers': '2 ജ്യേഷ്ഠന്മാർ', '3 elder brothers': '3 ജ്യേഷ്ഠന്മാർ',
    '1 younger brother': '1 അനിയൻ', '2 younger brother': '2 അനിയന്മാർ', '2 younger brothers': '2 അനിയന്മാർ',
    '1 brother': '1 സഹോദരൻ', '2 brother': '2 സഹോദരങ്ങൾ', '2 brothers': '2 സഹോദരങ്ങൾ',
    '1 elder sister': '1 ജ്യേഷ്ഠത്തി', '2 elder sister': '2 ജ്യേഷ്ഠത്തിമാർ', '2 elder sisters': '2 ജ്യേഷ്ഠത്തിമാർ',
    '1 younger sister': '1 അനിയത്തി', '2 younger sister': '2 അനിയത്തിമാർ', '2 younger sisters': '2 അനിയത്തിമാർ',
    '1 sister': '1 സഹോദരി', '2 sister': '2 സഹോദരിമാർ', '2 sisters': '2 സഹോദരിമാർ',
    'elder brother': 'ജ്യേഷ്ഠൻ', 'elder brothers': 'ജ്യേഷ്ഠന്മാർ', 'younger brother': 'അനിയൻ', 'younger brothers': 'അനിയന്മാർ',
    'elder sister': 'ജ്യേഷ്ഠത്തി', 'elder sisters': 'ജ്യേഷ്ഠത്തിമാർ', 'younger sister': 'അനിയത്തി', 'younger sisters': 'അനിയത്തിമാർ',
    'brother': 'സഹോദരൻ', 'brothers': 'സഹോദരങ്ങൾ', 'sister': 'സഹോദരി', 'sisters': 'സഹോദരിമാർ',
    'no brother': 'സഹോദരനില്ല', 'no sister': 'സഹോദരിയില്ല', 'both married': 'രണ്ടുപേരും വിവാഹിതർ', 'both unmarried': 'രണ്ടുപേരും അവിവാഹിതർ',
  },
  pa: {
    'none': 'ਕੋਈ ਨਹੀਂ', 'not provided': 'ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ', 'never married': 'ਅਣਵਿਆਹਿਆ', 'unmarried': 'ਅਣਵਿਆਹਿਆ',
    'divorced': 'ਤਲਾਕਸ਼ੁਦਾ', 'widowed': 'ਵਿਧਵਾ / ਵਿਧੁਰ', 'female': 'ਔਰਤ', 'male': 'ਪੁਰਸ਼',
    'very fair': 'ਬਹੁਤ ਗੋਰਾ', 'fair': 'ਗੋਰਾ', 'wheatish': 'ਕਣਕਵੰਨਾ', 'wheatish medium': 'ਕਣਕਵੰਨਾ ਦਰਮਿਆਨਾ',
    'dark': 'ਸਾਂਵਲਾ', 'nuclear family': 'ਛੋਟਾ ਪਰਿਵਾਰ', 'joint family': 'ਸਾਂਝਾ ਪਰਿਵਾਰ',
    'private job': 'ਪ੍ਰਾਈਵੇਟ ਨੌਕਰੀ', 'government job': 'ਸਰਕਾਰੀ ਨੌਕਰੀ', 'business': 'ਕਾਰੋਬਾਰ',
    'homemaker': 'ਘਰੇਲੂ ਔਰਤ', 'housewife': 'ਘਰੇਲੂ ਔਰਤ',
    'hindu': 'ਹਿੰਦੂ', 'muslim': 'ਮੁਸਲਿਮ', 'christian': 'ਈਸਾਈ', 'sikh': 'ਸਿੱਖ', 'jain': 'ਜੈਨ', 'buddhist': 'ਬੋਧੀ',
    'software engineer': 'ਸਾਫਟਵੇਅਰ ਇੰਜੀਨੀਅਰ', 'doctor': 'ਡਾਕਟਰ', 'engineer': 'ਇੰਜੀਨੀਅਰ',
    '1 elder brother': '1 ਵੱਡਾ ਭਰਾ', '2 elder brother': '2 ਵੱਡੇ ਭਰਾ', '2 elder brothers': '2 ਵੱਡੇ ਭਰਾ', '3 elder brothers': '3 ਵੱਡੇ ਭਰਾ',
    '1 younger brother': '1 ਛੋਟਾ ਭਰਾ', '2 younger brother': '2 ਛੋਟੇ ਭਰਾ', '2 younger brothers': '2 ਛੋਟੇ ਭਰਾ',
    '1 brother': '1 ਭਰਾ', '2 brother': '2 ਭਰਾ', '2 brothers': '2 ਭਰਾ',
    '1 elder sister': '1 ਵੱਡੀ ਭੈਣ', '2 elder sister': '2 ਵੱਡੀਆਂ ਭੈਣਾਂ', '2 elder sisters': '2 ਵੱਡੀਆਂ ਭੈਣਾਂ',
    '1 younger sister': '1 ਛੋਟੀ ਭੈਣ', '2 younger sister': '2 ਛੋਟੀਆਂ ਭੈਣਾਂ', '2 younger sisters': '2 ਛੋਟੀਆਂ ਭੈਣਾਂ',
    '1 sister': '1 ਭੈਣ', '2 sister': '2 ਭੈਣਾਂ', '2 sisters': '2 ਭੈਣਾਂ',
    'elder brother': 'ਵੱਡਾ ਭਰਾ', 'elder brothers': 'ਵੱਡੇ ਭਰਾ', 'younger brother': 'ਛੋਟਾ ਭਰਾ', 'younger brothers': 'ਛੋਟੇ ਭਰਾ',
    'elder sister': 'ਵੱਡੀ ਭੈਣ', 'elder sisters': 'ਵੱਡੀਆਂ ਭੈਣਾਂ', 'younger sister': 'ਛੋਟੀ ਭੈਣ', 'younger sisters': 'ਛੋਟੀਆਂ ਭੈਣਾਂ',
    'brother': 'ਭਰਾ', 'brothers': 'ਭਰਾ', 'sister': 'ਭੈਣ', 'sisters': 'ਭੈਣਾਂ',
    'no brother': 'ਕੋਈ ਭਰਾ ਨਹੀਂ', 'no sister': 'ਕੋਈ ਭੈਣ ਨਹੀਂ', 'both married': 'ਦੋਵੇਂ ਵਿਆਹੇ ਹੋਏ', 'both unmarried': 'ਦੋਵੇਂ ਅਣਵਿਆਹੇ',
  },
  or: {
    'none': 'କିଛି ନାହିଁ', 'not provided': 'ଦିଆଯାଇ ନାହିଁ', 'never married': 'ଅବିବାହିତ', 'unmarried': 'ଅବିବାହିତ',
    'divorced': 'ଛାଡ଼ପତ୍ର ପ୍ରାପ୍ତ', 'widowed': 'ବିଧବା / ବିପତ୍ନୀକ', 'female': 'ମହିଳା', 'male': 'ପୁରୁଷ',
    'very fair': 'ଅତି ଫର୍ସା', 'fair': 'ଫର୍ସା', 'wheatish': 'ଗହମ ରଙ୍ଗ', 'wheatish medium': 'ଗହମ ରଙ୍ଗ ମଧ୍ୟମ',
    'dark': 'କଳା', 'nuclear family': 'ଏକକ ପରିବାର', 'joint family': 'ଯୌଥ ପରିବାର',
    'private job': 'ଘରୋଇ ଚାକିରି', 'government job': 'ସରକାରୀ ଚାକିରି', 'business': 'ବ୍ୟବସାୟ',
    'homemaker': 'ଗୃହିଣୀ', 'housewife': 'ଗୃହିଣୀ',
    'hindu': 'ହିନ୍ଦୁ', 'muslim': 'ମୁସଲିମ', 'christian': 'ଖ୍ରୀଷ୍ଟିଆନ', 'sikh': 'ଶିଖ', 'jain': 'ଜୈନ', 'buddhist': 'ବୌଦ୍ଧ',
    'software engineer': 'ସଫ୍ଟୱେର୍ ଇଞ୍ଜିନିୟର', 'doctor': 'ଡାକ୍ତର', 'engineer': 'ଇଞ୍ଜିନିୟର',
    '1 elder brother': '1 ବଡ଼ ଭାଇ', '2 elder brother': '2 ବଡ଼ ଭାଇ', '2 elder brothers': '2 ବଡ଼ ଭାଇ', '3 elder brothers': '3 ବଡ଼ ଭାଇ',
    '1 younger brother': '1 ସାନ ଭାଇ', '2 younger brother': '2 ସାନ ଭାଇ', '2 younger brothers': '2 ସାନ ଭାଇ',
    '1 brother': '1 ଭାଇ', '2 brother': '2 ଭାଇ', '2 brothers': '2 ଭାଇ',
    '1 elder sister': '1 ବଡ଼ ଭଉଣୀ', '2 elder sister': '2 ବଡ଼ ଭଉଣୀ', '2 elder sisters': '2 ବଡ଼ ଭଉଣୀ',
    '1 younger sister': '1 ସାନ ଭଉଣୀ', '2 younger sister': '2 ସାନ ଭଉଣୀ', '2 younger sisters': '2 ସାନ ଭଉଣୀ',
    '1 sister': '1 ଭଉଣୀ', '2 sister': '2 ଭଉଣୀ', '2 sisters': '2 ଭଉଣୀ',
    'elder brother': 'ବଡ଼ ଭାଇ', 'elder brothers': 'ବଡ଼ ଭାଇ', 'younger brother': 'ସାନ ଭାଇ', 'younger brothers': 'ସାନ ଭାଇ',
    'elder sister': 'ବଡ଼ ଭଉଣୀ', 'elder sisters': 'ବଡ଼ ଭଉଣୀ', 'younger sister': 'ସାନ ଭଉଣୀ', 'younger sisters': 'ସାନ ଭଉଣୀ',
    'brother': 'ଭାଇ', 'brothers': 'ଭାଇ', 'sister': 'ଭଉଣୀ', 'sisters': 'ଭଉଣୀ',
    'no brother': 'କୌଣସି ଭାଇ ନାହିଁ', 'no sister': 'କୌଣସି ଭଉଣୀ ନାହିଁ', 'both married': 'ଉଭୟ ବିବାହିତ', 'both unmarried': 'ଉଭୟ ଅବିବାହିତ',
  },
  as: {
    'none': 'একো নাই', 'not provided': 'প্ৰদান কৰা হোৱা নাই', 'never married': 'অবিবাহিত', 'unmarried': 'অবিবাহিত',
    'divorced': 'বিবাহবিচ্ছিন্ন', 'widowed': 'বিধৱা / বিপত্নীক', 'female': 'মহিলা', 'male': 'পুৰুষ',
    'very fair': 'অতি বগা', 'fair': 'বগা', 'wheatish': 'ঘেঁহু বৰণীয়া', 'wheatish medium': 'ঘেঁহু বৰণীয়া',
    'dark': 'কলা', 'nuclear family': 'একক পৰিয়াল', 'joint family': 'যৌথ পৰিয়াল',
    'private job': 'ব্যক্তিগত চাকৰি', 'government job': 'চৰকাৰী চাকৰি', 'business': 'ব্যৱসায়',
    'homemaker': 'গৃহিনী', 'housewife': 'গৃহিনী',
    'hindu': 'হিন্দু', 'muslim': 'মুছলিম', 'christian': 'খ্ৰীষ্টান', 'sikh': 'শিখ', 'jain': 'জৈন', 'buddhist': 'বৌদ্ধ',
    'software engineer': 'ছফ্টৱেৰ অভিযন্তা', 'doctor': 'চিকিৎসক', 'engineer': 'অভিযন্তা',
    '1 elder brother': '1 ডাঙৰ ককাইদেউ', '2 elder brother': '2 ডাঙৰ ককাইদেউসকল', '2 elder brothers': '2 ডাঙৰ ককাইদেউসকল', '3 elder brothers': '3 ডাঙৰ ককাইদেউসকল',
    '1 younger brother': '1 সৰু ভাই', '2 younger brother': '2 সৰু ভাইসকল', '2 younger brothers': '2 সৰু ভাইসকল',
    '1 brother': '1 ভাই', '2 brother': '2 ভাইসকল', '2 brothers': '2 ভাইসকল',
    '1 elder sister': '1 ডাঙৰ বায়েক', '2 elder sister': '2 ডাঙৰ বায়েকসকল', '2 elder sisters': '2 ডাঙৰ বায়েকসকল',
    '1 younger sister': '1 সৰু ভনীয়েক', '2 younger sister': '2 সৰু ভনীয়েকসকল', '2 younger sisters': '2 সৰু ভনীয়েকসকল',
    '1 sister': '1 ভনী', '2 sister': '2 ভনীসকল', '2 sisters': '2 ভনীসকল',
    'elder brother': 'ডাঙৰ ককাইদেউ', 'elder brothers': 'ডাঙৰ ককাইদেউসকল', 'younger brother': 'সৰু ভাই', 'younger brothers': 'সৰু ভাইসকল',
    'elder sister': 'ডাঙৰ বায়েক', 'elder sisters': 'ডাঙৰ বায়েকসকল', 'younger sister': 'সৰু ভনীয়েক', 'younger sisters': 'সৰু ভনীয়েকসকল',
    'brother': 'ভাই', 'brothers': 'ভাইসকল', 'sister': 'ভনী', 'sisters': 'ভনীসকল',
    'no brother': 'কোনো ভাই নাই', 'no sister': 'কোনো ভনী নাই', 'both married': 'দুয়োজনেই বিবাহিত', 'both unmarried': 'দুয়োজনেই অবিবাহিত',
  },
  ur: {
    'none': 'کوئی نہیں', 'not provided': 'فراہم نہیں کیا گیا', 'never married': 'غیر شادی شدہ', 'unmarried': 'غیر شادی شدہ',
    'divorced': 'طلاق یافتہ', 'widowed': 'بیوہ / رنڈوا', 'female': 'عورت', 'male': 'مرد',
    'very fair': 'بہت گورا', 'fair': 'گورا', 'wheatish': 'گندمی', 'wheatish medium': 'گندمی رنگت',
    'dark': 'سانولا', 'nuclear family': 'اکائی خاندان', 'joint family': 'مشترکہ خاندان',
    'private job': 'پرائیویٹ نوکری', 'government job': 'سرکاری نوکری', 'business': 'کاروبار',
    'homemaker': 'گھریلو خاتون', 'housewife': 'گھریلو خاتون',
    'hindu': 'ہندو', 'muslim': 'مسلم', 'christian': 'عیسائی', 'sikh': 'سکھ', 'jain': 'جین', 'buddhist': 'بدھ مت',
    'software engineer': 'سافٹ ویئر انجینئر', 'doctor': 'ڈاکٹر', 'engineer': 'انجینئر',
    '1 elder brother': '1 بڑا بھائی', '2 elder brother': '2 بڑے بھائی', '2 elder brothers': '2 بڑے بھائی', '3 elder brothers': '3 بڑے بھائی',
    '1 younger brother': '1 چھوٹا بھائی', '2 younger brother': '2 چھوٹے بھائی', '2 younger brothers': '2 چھوٹے بھائی',
    '1 brother': '1 بھائی', '2 brother': '2 بھائی', '2 brothers': '2 بھائی',
    '1 elder sister': '1 بڑی بہن', '2 elder sister': '2 بڑی بہنیں', '2 elder sisters': '2 بڑی بہنیں',
    '1 younger sister': '1 چھوٹی بہن', '2 younger sister': '2 چھوٹی بہنیں', '2 younger sisters': '2 چھوٹی بہنیں',
    '1 sister': '1 بہن', '2 sister': '2 بہنیں', '2 sisters': '2 بہنیں',
    'elder brother': 'بڑا بھائی', 'elder brothers': 'بڑے بھائی', 'younger brother': 'چھوٹا بھائی', 'younger brothers': 'چھوٹے بھائی',
    'elder sister': 'بڑی بہن', 'elder sisters': 'بڑی بہنیں', 'younger sister': 'چھوٹی بہن', 'younger sisters': 'چھوٹی بہنیں',
    'brother': 'بھائی', 'brothers': 'بھائی', 'sister': 'بہن', 'sisters': 'بہنیں',
    'no brother': 'کوئی بھائی نہیں', 'no sister': 'کوئی بہن نہیں', 'both married': 'دونوں شادی شدہ', 'both unmarried': 'دونوں غیر شادی شدہ',
  },
};

export interface SiblingLangConfig {
  elderBrotherSingular: string;
  elderBrotherPlural: string;
  youngerBrotherSingular: string;
  youngerBrotherPlural: string;
  brotherSingular: string;
  brotherPlural: string;
  elderSisterSingular: string;
  elderSisterPlural: string;
  youngerSisterSingular: string;
  youngerSisterPlural: string;
  sisterSingular: string;
  sisterPlural: string;
  married: string;
  unmarried: string;
  bothMarried?: string;
  bothUnmarried?: string;
}

export const SIBLING_CONFIGS: Record<string, SiblingLangConfig> = {
  mr: {
    elderBrotherSingular: 'मोठा भाऊ',
    elderBrotherPlural: 'मोठे भाऊ',
    youngerBrotherSingular: 'लहान भाऊ',
    youngerBrotherPlural: 'लहान भाऊ',
    brotherSingular: 'भाऊ',
    brotherPlural: 'भाऊ',
    elderSisterSingular: 'मोठी बहीण',
    elderSisterPlural: 'मोठ्या बहिणी',
    youngerSisterSingular: 'लहान बहीण',
    youngerSisterPlural: 'लहान बहिणी',
    sisterSingular: 'बहीण',
    sisterPlural: 'बहिणी',
    married: 'विवाहित',
    unmarried: 'अविवाहित',
      bothMarried: 'दोन्ही विवाहित',
    bothUnmarried: 'दोन्ही अविवाहित',
  },
  hi: {
    elderBrotherSingular: 'बड़ा भाई',
    elderBrotherPlural: 'बड़े भाई',
    youngerBrotherSingular: 'छोटा भाई',
    youngerBrotherPlural: 'छोटे भाई',
    brotherSingular: 'भाई',
    brotherPlural: 'भाई',
    elderSisterSingular: 'बड़ी बहन',
    elderSisterPlural: 'बड़ी बहनें',
    youngerSisterSingular: 'छोटी बहन',
    youngerSisterPlural: 'छोटी बहनें',
    sisterSingular: 'बहन',
    sisterPlural: 'बहनें',
    married: 'विवाहित',
    unmarried: 'अविवाहित',
      bothMarried: 'दोनों विवाहित',
    bothUnmarried: 'दोनों अविवाहित',
  },
  gu: {
    elderBrotherSingular: 'મોટો ભાઈ',
    elderBrotherPlural: 'મોટા ભાઈ',
    youngerBrotherSingular: 'નાનો ભાઈ',
    youngerBrotherPlural: 'નાના ભાઈ',
    brotherSingular: 'ભાઈ',
    brotherPlural: 'ભાઈ',
    elderSisterSingular: 'મોટી બહેન',
    elderSisterPlural: 'મોટી બહેનો',
    youngerSisterSingular: 'નાની બહેન',
    youngerSisterPlural: 'નાની બહેનો',
    sisterSingular: 'બહેન',
    sisterPlural: 'બહેનો',
    married: 'પરિણીત',
    unmarried: 'અપરિણીત',
      bothMarried: 'બંને પરિણીત',
    bothUnmarried: 'બંને અપરિણીત',
  },
  te: {
    elderBrotherSingular: 'అన్నయ్య',
    elderBrotherPlural: 'అన్నయ్యలు',
    youngerBrotherSingular: 'తమ్ముడు',
    youngerBrotherPlural: 'తమ్ముళ్ళు',
    brotherSingular: 'సోదరుడు',
    brotherPlural: 'సోదరులు',
    elderSisterSingular: 'అక్క',
    elderSisterPlural: 'అక్కలు',
    youngerSisterSingular: 'చెల్లెలు',
    youngerSisterPlural: 'చెల్లెళ్ళు',
    sisterSingular: 'సోదరి',
    sisterPlural: 'సోదరీమణులు',
    married: 'వివాహితుడు',
    unmarried: 'అవివాహితుడు',
      bothMarried: 'ఇద్దరూ వివాహితులు',
    bothUnmarried: 'ఇద్దరూ అవివాహితులు',
  },
  ta: {
    elderBrotherSingular: 'அண்ணன்',
    elderBrotherPlural: 'அண்ணன்கள்',
    youngerBrotherSingular: 'தம்பி',
    youngerBrotherPlural: 'தம்பிகள்',
    brotherSingular: 'சகோதரர்',
    brotherPlural: 'சகோதரர்கள்',
    elderSisterSingular: 'அக்கா',
    elderSisterPlural: 'அக்காக்கள்',
    youngerSisterSingular: 'தங்கை',
    youngerSisterPlural: 'தங்கைகள்',
    sisterSingular: 'சகோதரி',
    sisterPlural: 'சகோதரிகள்',
    married: 'திருமணமானவர்',
    unmarried: 'திருமணமாகாதவர்',
      bothMarried: 'இருவரும் திருமணமானவர்கள்',
    bothUnmarried: 'இருவரும் திருமணமாகாதவர்கள்',
  },
  kn: {
    elderBrotherSingular: 'ಅಣ್ಣ',
    elderBrotherPlural: 'ಅಣ್ಣಂದಿರು',
    youngerBrotherSingular: 'ತಮ್ಮ',
    youngerBrotherPlural: 'ತಮ್ಮಂದಿರು',
    brotherSingular: 'ಸಹೋದರ',
    brotherPlural: 'ಸಹೋದರರು',
    elderSisterSingular: 'ಅಕ್ಕ',
    elderSisterPlural: 'ಅಕ್ಕಂದಿರು',
    youngerSisterSingular: 'ತಂಗಿ',
    youngerSisterPlural: 'ತಂಗಿಯರು',
    sisterSingular: 'ಸಹೋದರಿ',
    sisterPlural: 'ಸಹೋದರಿಯರು',
    married: 'ವಿವಾಹಿತ',
    unmarried: 'ಅವಿವಾಹಿತ',
      bothMarried: 'ಇಬ್ಬರೂ ವಿವಾಹಿತರು',
    bothUnmarried: 'ಇಬ್ಬರೂ ಅವಿವಾಹಿತರು',
  },
  bn: {
    elderBrotherSingular: 'বড় ভাই',
    elderBrotherPlural: 'বড় ভাই',
    youngerBrotherSingular: 'ছোট ভাই',
    youngerBrotherPlural: 'ছোট ভাই',
    brotherSingular: 'ভাই',
    brotherPlural: 'ভাই',
    elderSisterSingular: 'বড় বোন',
    elderSisterPlural: 'বড় বোন',
    youngerSisterSingular: 'ছোট বোন',
    youngerSisterPlural: 'ছোট বোন',
    sisterSingular: 'বোন',
    sisterPlural: 'বোন',
    married: 'বিবাহিত',
    unmarried: 'অবিবাহিত',
      bothMarried: 'উভয়েই বিবাহিত',
    bothUnmarried: 'উভয়েই অবিবাহিত',
  },
  ml: {
    elderBrotherSingular: 'ജ്യേഷ്ഠൻ',
    elderBrotherPlural: 'ജ്യേഷ്ഠന്മാർ',
    youngerBrotherSingular: 'അനിയൻ',
    youngerBrotherPlural: 'അനിയന്മാർ',
    brotherSingular: 'സഹോദരൻ',
    brotherPlural: 'സഹോദരങ്ങൾ',
    elderSisterSingular: 'ജ്യേഷ്ഠത്തി',
    elderSisterPlural: 'ജ്യേഷ്ഠത്തിമാർ',
    youngerSisterSingular: 'അനിയത്തി',
    youngerSisterPlural: 'അനിയത്തിമാർ',
    sisterSingular: 'സഹോദരി',
    sisterPlural: 'സഹോദരിമാർ',
    married: 'വിവാഹിതൻ',
    unmarried: 'അവിവാഹിതൻ',
      bothMarried: 'രണ്ടുപേരും വിവാഹിതർ',
    bothUnmarried: 'രണ്ടുപേരും അവിവാഹിതർ',
  },
  pa: {
    elderBrotherSingular: 'ਵੱਡਾ ਭਰਾ',
    elderBrotherPlural: 'ਵੱਡੇ ਭਰਾ',
    youngerBrotherSingular: 'ਛੋਟਾ ਭਰਾ',
    youngerBrotherPlural: 'ਛੋਟੇ ਭਰਾ',
    brotherSingular: 'ਭਰਾ',
    brotherPlural: 'ਭਰਾ',
    elderSisterSingular: 'ਵੱਡੀ ਭੈਣ',
    elderSisterPlural: 'ਵੱਡੀਆਂ ਭੈਣਾਂ',
    youngerSisterSingular: 'ਛੋਟੀ ਭੈਣ',
    youngerSisterPlural: 'ਛੋਟੀਆਂ ਭੈਣਾਂ',
    sisterSingular: 'ਭੈਣ',
    sisterPlural: 'ਭੈਣਾਂ',
    married: 'ਵਿਆਹਿਆ',
    unmarried: 'ਅਣਵਿਆਹਿਆ',
      bothMarried: 'ਦੋਵੇਂ ਵਿਆਹੇ ਹੋਏ',
    bothUnmarried: 'ਦੋਵੇਂ ਅਣਵਿਆਹੇ',
  },
  or: {
    elderBrotherSingular: 'ବଡ଼ ଭାଇ',
    elderBrotherPlural: 'ବଡ଼ ଭାଇ',
    youngerBrotherSingular: 'ସାନ ଭାଇ',
    youngerBrotherPlural: 'ସାନ ଭାଇ',
    brotherSingular: 'ଭାଇ',
    brotherPlural: 'ଭାଇ',
    elderSisterSingular: 'ବଡ଼ ଭଉଣୀ',
    elderSisterPlural: 'ବଡ଼ ଭଉଣୀ',
    youngerSisterSingular: 'ସାନ ଭଉଣୀ',
    youngerSisterPlural: 'ସାନ ଭଉଣୀ',
    sisterSingular: 'ଭଉଣୀ',
    sisterPlural: 'ଭଉଣୀ',
    married: 'ବିବାହିତ',
    unmarried: 'ଅବିବାହିତ',
      bothMarried: 'ଉଭୟ ବିବାହିତ',
    bothUnmarried: 'ଉଭୟ ଅବିବାହିତ',
  },
  as: {
    elderBrotherSingular: 'ডাঙৰ ককাইদেউ',
    elderBrotherPlural: 'ডাঙৰ ককাইদেউসকল',
    youngerBrotherSingular: 'সৰু ভাই',
    youngerBrotherPlural: 'সৰু ভাইসকল',
    brotherSingular: 'ভাই',
    brotherPlural: 'ভাইসকল',
    elderSisterSingular: 'ডাঙৰ বায়েক',
    elderSisterPlural: 'ডাঙৰ বায়েকসকল',
    youngerSisterSingular: 'সৰু ভনীয়েক',
    youngerSisterPlural: 'সৰু ভনীয়েকসকল',
    sisterSingular: 'ভনী',
    sisterPlural: 'ভনীসকল',
    married: 'বিবাহিত',
    unmarried: 'অবিবাহিত',
      bothMarried: 'দুয়োজনেই বিবাহিত',
    bothUnmarried: 'দুয়োজনেই অবিবাহিত',
  },
  ur: {
    elderBrotherSingular: 'بڑا بھائی',
    elderBrotherPlural: 'بڑے بھائی',
    youngerBrotherSingular: 'چھوٹا بھائی',
    youngerBrotherPlural: 'چھوٹے بھائی',
    brotherSingular: 'بھائی',
    brotherPlural: 'بھائی',
    elderSisterSingular: 'بڑی بہن',
    elderSisterPlural: 'بڑی بہنیں',
    youngerSisterSingular: 'چھوٹی بہن',
    youngerSisterPlural: 'چھوٹی بہنیں',
    sisterSingular: 'بہن',
    sisterPlural: 'بہنیں',
    married: 'شادی شدہ',
    unmarried: 'غیر شادی شدہ',
      bothMarried: 'دونوں شادی شدہ',
    bothUnmarried: 'دونوں غیر شادی شدہ',
  },
};

export function localizeFamilyAndSiblingString(val: string, targetLang: string): string {
  const dict = SIBLING_CONFIGS[targetLang];
  if (!dict) return val;

  let res = val;

  // 1. Inverted count patterns e.g. "elder brother: 2", "elder brother - 2", "brother: 2", "elder brother 2"
  res = res.replace(/\belder\s+brothers?\s*[:\-]?\s*(\b\d+\b)/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.elderBrotherPlural : dict.elderBrotherSingular}`;
  });

  res = res.replace(/\byounger\s+brothers?\s*[:\-]?\s*(\b\d+\b)/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.youngerBrotherPlural : dict.youngerBrotherSingular}`;
  });

  res = res.replace(/\bbrothers?\s*[:\-]?\s*(\b\d+\b)/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.brotherPlural : dict.brotherSingular}`;
  });

  res = res.replace(/\belder\s+sisters?\s*[:\-]?\s*(\b\d+\b)/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.elderSisterPlural : dict.elderSisterSingular}`;
  });

  res = res.replace(/\byounger\s+sisters?\s*[:\-]?\s*(\b\d+\b)/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.youngerSisterPlural : dict.youngerSisterSingular}`;
  });

  res = res.replace(/\bsisters?\s*[:\-]?\s*(\b\d+\b)/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.sisterPlural : dict.sisterSingular}`;
  });

  // 2. Direct count patterns e.g. "2 elder brother", "1 elder brother", "2 elder brothers", "2 - elder brother"
  res = res.replace(/(\b\d+\b)\s*[:\-]?\s*elder\s+brothers?\b/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.elderBrotherPlural : dict.elderBrotherSingular}`;
  });

  res = res.replace(/(\b\d+\b)\s*[:\-]?\s*younger\s+brothers?\b/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.youngerBrotherPlural : dict.youngerBrotherSingular}`;
  });

  res = res.replace(/(\b\d+\b)\s*[:\-]?\s*brothers?(?:\s*\([sS]\))?\b/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.brotherPlural : dict.brotherSingular}`;
  });

  res = res.replace(/(\b\d+\b)\s*[:\-]?\s*elder\s+sisters?\b/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.elderSisterPlural : dict.elderSisterSingular}`;
  });

  res = res.replace(/(\b\d+\b)\s*[:\-]?\s*younger\s+sisters?\b/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.youngerSisterPlural : dict.youngerSisterSingular}`;
  });

  res = res.replace(/(\b\d+\b)\s*[:\-]?\s*sisters?(?:\s*\([sS]\))?\b/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.sisterPlural : dict.sisterSingular}`;
  });

  // 3. Count + elder/younger alone without brother/sister (e.g. in brother field: "2 elder", "1 younger")
  res = res.replace(/(\b\d+\b)\s*[:\-]?\s*elder\b(?!(\s*sister|\s*brother))/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.elderBrotherPlural : dict.elderBrotherSingular}`;
  });
  res = res.replace(/(\b\d+\b)\s*[:\-]?\s*younger\b(?!(\s*sister|\s*brother))/gi, (_match, countStr) => {
    const num = parseInt(countStr, 10);
    return `${countStr} ${num > 1 ? dict.youngerBrotherPlural : dict.youngerBrotherSingular}`;
  });

  // 4. Standalone phrases
  res = res.replace(/\belder\s+brothers\b/gi, dict.elderBrotherPlural);
  res = res.replace(/\belder\s+brother\b/gi, dict.elderBrotherSingular);
  res = res.replace(/\byounger\s+brothers\b/gi, dict.youngerBrotherPlural);
  res = res.replace(/\byounger\s+brother\b/gi, dict.youngerBrotherSingular);
  res = res.replace(/\bbrothers\b/gi, dict.brotherPlural);
  res = res.replace(/\bbrother\b/gi, dict.brotherSingular);

  res = res.replace(/\belder\s+sisters\b/gi, dict.elderSisterPlural);
  res = res.replace(/\belder\s+sister\b/gi, dict.elderSisterSingular);
  res = res.replace(/\byounger\s+sisters\b/gi, dict.youngerSisterPlural);
  res = res.replace(/\byounger\s+sister\b/gi, dict.youngerSisterSingular);
  res = res.replace(/\bsisters\b/gi, dict.sisterPlural);
  res = res.replace(/\bsister\b/gi, dict.sisterSingular);

  // 5. Status inside descriptions, e.g. "both married", "both unmarried", "1 married", "married", "unmarried"
  if (dict.bothMarried) {
    res = res.replace(/\bboth\s+married\b/gi, dict.bothMarried);
    res = res.replace(/\ball\s+married\b/gi, dict.bothMarried);
  }
  if (dict.bothUnmarried) {
    res = res.replace(/\bboth\s+unmarried\b/gi, dict.bothUnmarried);
    res = res.replace(/\ball\s+unmarried\b/gi, dict.bothUnmarried);
  }
  res = res.replace(/(\b\d+\b)\s+married\b/gi, `$1 ${dict.married}`);
  res = res.replace(/(\b\d+\b)\s+unmarried\b/gi, `$1 ${dict.unmarried}`);
  res = res.replace(/\bmarried\b/gi, dict.married);
  res = res.replace(/\bunmarried\b/gi, dict.unmarried);

  return res;
}

export function localizeValue(val: string, targetLang: string = 'en'): string {
  if (!val || typeof val !== 'string' || !val.trim()) return val;
  if (!targetLang || targetLang === 'en') return val;

  let result = val.trim();
  const lower = result.toLowerCase();

  // 1. None / Not provided / Empty markers
  if (lower === 'none' || lower === 'na' || lower === 'n/a' || lower === '-' || lower === 'nil') {
    const commonDict = COMMON_VALUE_TRANSLATIONS[targetLang];
    if (commonDict && commonDict['none']) return commonDict['none'];
    return '-';
  }
  if (lower === 'not provided') {
    const commonDict = COMMON_VALUE_TRANSLATIONS[targetLang];
    if (commonDict && commonDict['not provided']) return commonDict['not provided'];
    return '-';
  }

  // 2. Exact dictionary lookup for raw common values
  const commonDict = COMMON_VALUE_TRANSLATIONS[targetLang];
  if (commonDict && commonDict[lower]) {
    return commonDict[lower];
  }

  // 3. Localize English month names in dates (e.g. "2 August 2003" -> "2 ఆగస్టు 2003")
  const months = MONTH_TRANSLATIONS[targetLang];
  if (months) {
    for (const [enMonth, localizedMonth] of Object.entries(months)) {
      const regex = new RegExp(`\\b${enMonth}\\b`, 'gi');
      if (regex.test(result)) {
        result = result.replace(regex, localizedMonth);
      }
    }
  }

  // 4. Localize AM / PM in birth times (e.g. "06:30 AM" or "11:15 AM")
  const TIME_AM_PM_MAP: Record<string, { am: string; pm: string }> = {
    mr: { am: 'सकाळी', pm: 'दुपारी' },
    hi: { am: 'सुबह', pm: 'शाम' },
    gu: { am: 'સવારે', pm: 'સાંજે' },
    te: { am: 'ఉదయం', pm: 'సాయంత్రం' },
    ta: { am: 'காலை', pm: 'மாலை' },
    kn: { am: 'ಬೆಳಿಗ್ಗೆ', pm: 'ಸಂಜೆ' },
    bn: { am: 'সকাল', pm: 'সন্ধ্যা' },
    ml: { am: 'രാവിലെ', pm: 'വൈകുന്നേരം' },
    pa: { am: 'ਸਵੇਰੇ', pm: 'ਸ਼ਾਮ' },
    or: { am: 'ସକାଳ', pm: 'ସନ୍ଧ୍ୟା' },
    as: { am: 'ৰাতিপুৱা', pm: 'সন্ধিয়া' },
    ur: { am: 'صبح', pm: 'شام' },
  };

  const amPmTranslation = TIME_AM_PM_MAP[targetLang];
  if (amPmTranslation) {
    result = result.replace(/\b([0-9:]+)\s*AM\b/gi, `${amPmTranslation.am} $1`);
    result = result.replace(/\b([0-9:]+)\s*PM\b/gi, `${amPmTranslation.pm} $1`);
    result = result.replace(/\bAM\b/gi, amPmTranslation.am);
    result = result.replace(/\bPM\b/gi, amPmTranslation.pm);
  }

  // 5. Sibling & family phrase patterns (e.g. "2 elder brother" -> "2 बड़े भाई", "1 younger sister (unmarried)" -> "1 छोटी बहन (अविवाहित)")
  result = localizeFamilyAndSiblingString(result, targetLang);

  // 6. Exact dictionary lookup for post-processed value
  if (commonDict) {
    const trimmedLower = result.toLowerCase().trim();
    if (commonDict[trimmedLower]) {
      return commonDict[trimmedLower];
    }
  }

  // 7. If result was modified by rule-based localization (different from original input),
  // NEVER let an untranslated or stale cache entry overwrite it!
  if (result !== val.trim()) {
    return result;
  }

  // 7.5 Check verified Indic name transliteration or cache
  const cachedName = getCachedIndicTransliteration(result, targetLang);
  if (cachedName && cachedName !== result) {
    return cachedName;
  }

  // 8. Check live translations cache in localStorage (soul_sync_live_translations_v3)
  // ONLY if not already localized, AND the cached translation is genuinely non-empty and not equal to the original English text!
  try {
    const liveCache = localStorage.getItem('soul_sync_live_translations_v3');
    if (liveCache) {
      const parsed = JSON.parse(liveCache);
      if (parsed && parsed[targetLang]) {
        const langObj = parsed[targetLang];
        const badTranslations = ['पेरिस', 'पैरिस', 'پیرس', 'paris', 'पॅरिस'];
        const isPoisoned = (k: string, v: string) =>
          k.toLowerCase().includes('parise') && badTranslations.some((b) => v.toLowerCase().includes(b));

        const cand1 = langObj[result];
        if (cand1 && typeof cand1 === 'string' && cand1.trim() && cand1.trim().toLowerCase() !== lower && !isPoisoned(result, cand1)) {
          return cand1.trim();
        }
        const cand2 = langObj[lower];
        if (cand2 && typeof cand2 === 'string' && cand2.trim() && cand2.trim().toLowerCase() !== lower && !isPoisoned(lower, cand2)) {
          return cand2.trim();
        }
        const foundKey = Object.keys(langObj).find((k) => k.toLowerCase() === lower);
        if (foundKey) {
          const cand3 = langObj[foundKey];
          if (cand3 && typeof cand3 === 'string' && cand3.trim() && cand3.trim().toLowerCase() !== lower && !isPoisoned(foundKey, cand3)) {
            return cand3.trim();
          }
        }
      }
    }
  } catch {}

  return result;
}

export function localizeTemplateString(
  templateStr: string,
  dataObj: any,
  targetLang: string = 'en',
  missingBehavior: 'placeholder' | 'hide' | 'not_provided' = 'placeholder',
  resolveVarFn?: (str: string, data: any, missing: any, lang: string) => string
): string {
  if (!templateStr) return '';
  if (!targetLang || targetLang === 'en') {
    if (!templateStr.includes('{{') && !templateStr.includes('{') && !templateStr.includes('[')) {
      return templateStr;
    }
    const resolved = resolveVarFn
      ? resolveVarFn(templateStr, dataObj, missingBehavior, targetLang)
      : templateStr;
    return resolved.replace(/\s*\(\s*\)/g, '').trim();
  }

  // Case 1: Leading colon e.g. ": {{familyDetails.brothers}}" or ": 2 elder brother"
  const leadingColonMatch = templateStr.match(/^(:+\s*)(.*)$/);
  if (leadingColonMatch) {
    const sep = leadingColonMatch[1];
    const rest = leadingColonMatch[2];
    let resolvedRest = rest;
    if (rest.includes('{{') || rest.includes('{') || rest.includes('[')) {
      resolvedRest = resolveVarFn ? resolveVarFn(rest, dataObj, missingBehavior, targetLang) : rest;
    } else {
      resolvedRest = localizeValue(rest, targetLang);
    }
    const cleanedRest = resolvedRest.replace(/\s*\(\s*\)/g, '').trim();
    if (missingBehavior === 'hide' && (!cleanedRest || cleanedRest === 'None' || cleanedRest === 'नाही' || cleanedRest === 'कोई नहीं')) {
      return '';
    }
    return `${sep}${cleanedRest}`;
  }

  // Case 2: Element with label prefix before colon e.g.
  // "Date of Birth: {{personalDetails.dateOfBirth}}"
  // "Brothers: 2 elder brother"
  // "भाई : 2 elder brother"
  const colonMatch = templateStr.match(/^([^:{[]+)(:\s*)(.*)$/);
  if (colonMatch) {
    const rawPrefix = colonMatch[1].trim();
    const separator = colonMatch[2];
    const rest = colonMatch[3];

    // Translate the prefix label
    const translatedPrefix = getTranslatedMatrimonialText(rawPrefix, targetLang);

    // Resolve and localize the rest
    let resolvedRest = rest;
    if (rest.includes('{{') || rest.includes('{') || rest.includes('[')) {
      resolvedRest = resolveVarFn
        ? resolveVarFn(rest, dataObj, missingBehavior, targetLang)
        : rest;
    } else {
      resolvedRest = localizeValue(rest, targetLang);
    }

    // Clean up empty parentheses like " ()" if inner variable resolved to empty
    const cleanedRest = resolvedRest.replace(/\s*\(\s*\)/g, '').trim();

    if (missingBehavior === 'hide' && (!cleanedRest || cleanedRest === 'None' || cleanedRest === 'नाही' || cleanedRest === 'कोई नहीं')) {
      return '';
    }

    return `${translatedPrefix}${separator}${cleanedRest}`;
  }

  // Case 3: Pure static string (no braces, no colon)
  if (!templateStr.includes('{{') && !templateStr.includes('{') && !templateStr.includes('[')) {
    const translated = getTranslatedMatrimonialText(templateStr, targetLang);
    if (translated && translated !== templateStr) return translated;
    return localizeValue(templateStr, targetLang);
  }

  // Case 4: Any other template string with variables
  const resolved = resolveVarFn
    ? resolveVarFn(templateStr, dataObj, missingBehavior, targetLang)
    : templateStr;
  return resolved.replace(/\s*\(\s*\)/g, '').trim();
}

export function getTranslatedMatrimonialText(text: string, targetLang: string = 'en'): string {
  if (!text || !text.trim()) return text;
  if (!targetLang || targetLang === 'en') return text;

  const dictionary = MATRIMONIAL_TRANSLATIONS[targetLang] || MATRIMONIAL_TRANSLATIONS['en'];
  const trimmed = text.trim();

  // Check for leading colon e.g. ": 2 elder brother"
  const leadingColonMatch = trimmed.match(/^(:+\s*)(.*)$/);
  if (leadingColonMatch) {
    const colonPrefix = leadingColonMatch[1];
    const rest = leadingColonMatch[2];
    const transRest = getTranslatedMatrimonialText(rest, targetLang);
    return `${colonPrefix}${transRest}`;
  }

  // Check for trailing colon e.g. "Date of Birth:" or "Date of Birth: "
  const colonMatch = trimmed.match(/^(.*?)(:\s*)$/);
  if (colonMatch) {
    const baseText = colonMatch[1].trim();
    const colonPart = colonMatch[2];
    const translatedBase = getTranslatedMatrimonialText(baseText, targetLang);
    return `${translatedBase}${colonPart}`;
  }

  // Handle composite labels separated by slash e.g. "Religion / Caste" or "बहीण / भाऊ"
  if (trimmed.includes('/') && !trimmed.startsWith('//') && !trimmed.startsWith('http')) {
    const slashParts = trimmed.split('/');
    const translatedParts = slashParts.map((part) => getTranslatedMatrimonialText(part.trim(), targetLang));
    return translatedParts.join(' / ');
  }

  // Handle wrapped strings like "— Personal Details —" or "|| Shree Ganeshay Namah ||" or "॥ श्री गणेशाय नमः ॥"
  const cleanKey = trimmed
    .replace(/^[—\-\|॥\s]+|[—\-\|॥\s]+$/g, '')
    .trim()
    .toLowerCase();

  const canonicalKey = CANONICAL_KEY_LOOKUP[cleanKey];
  if (canonicalKey && dictionary[canonicalKey]) {
    const translated = dictionary[canonicalKey];

    // Shlokas already have authentic native invocation wrappers
    if (canonicalKey === 'deityShloka') {
      return translated;
    }

    // If original had "— " or "|| ", re-wrap nicely
    if (trimmed.startsWith('—') && trimmed.endsWith('—')) {
      return `— ${translated} —`;
    }
    if (trimmed.startsWith('||') && trimmed.endsWith('||')) {
      return `|| ${translated} ||`;
    }
    if (trimmed.startsWith('॥') && trimmed.endsWith('॥')) {
      return `॥ ${translated} ॥`;
    }
    return translated;
  }

  // Check common value translations
  const commonDict = COMMON_VALUE_TRANSLATIONS[targetLang];
  if (commonDict && commonDict[cleanKey]) {
    return commonDict[cleanKey];
  }

  // Try rule-based / family value localization
  const valLocalized = localizeValue(cleanKey, targetLang);
  if (valLocalized && valLocalized.toLowerCase() !== cleanKey) {
    return valLocalized;
  }

  // Check live translations cache in localStorage (soul_sync_live_translations_v3)
  try {
    const liveCache = localStorage.getItem('soul_sync_live_translations_v3');
    if (liveCache) {
      const parsed = JSON.parse(liveCache);
      const langDict = parsed?.[targetLang];
      if (langDict) {
        if (langDict[text]) return langDict[text];
        if (langDict[trimmed]) return langDict[trimmed];
        if (langDict[cleanKey]) return langDict[cleanKey];
        const foundKey = Object.keys(langDict).find((k) => k.toLowerCase() === cleanKey);
        if (foundKey && langDict[foundKey]) return langDict[foundKey];
      }
    }
  } catch {}

  return text;
}
