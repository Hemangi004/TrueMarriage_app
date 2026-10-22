export const SAMPLE_FEMALE_PHOTOS = [
  { id: 'f1', name: 'Priya', tag: 'Traditional', url: '/sample_profiles/priya.webp' },
  { id: 'f2', name: 'Sunita', tag: 'Ethnic Elegance', url: '/sample_profiles/sunita.webp' },
  { id: 'f3', name: 'Pooja', tag: 'Modern Classic', url: '/sample_profiles/pooja.webp' },
  { id: 'f4', name: 'Lakshmi', tag: 'Traditional Red', url: '/sample_profiles/lakshmi.webp' },
  { id: 'f5', name: 'Megha', tag: 'Pastel Festive', url: '/sample_profiles/megha.webp' },
];

export const SAMPLE_MALE_PHOTOS = [
  { id: 'm1', name: 'Rahul', tag: 'Smart Formal', url: '/sample_profiles/rahul.webp' },
  { id: 'm2', name: 'Vikram', tag: 'Executive', url: '/sample_profiles/vikram.webp' },
  { id: 'm3', name: 'Akash', tag: 'Modern', url: '/sample_profiles/akash.webp' },
  { id: 'm4', name: 'Arjun', tag: 'Casual Ethnic', url: '/sample_profiles/arjun.webp' },
  { id: 'm5', name: 'Manish', tag: 'Professional', url: '/sample_profiles/manish.webp' },
];

export interface DummyBiodataProfile {
  id: string;
  label: string;
  gender: 'male' | 'female';
  data: {
    pageHeader: {
      deity: string;
      deityIcon: string;
    };
    personalDetails: {
      fullName: string;
      gender: string;
      dateOfBirth: string; // Must be before 2005
      timeOfBirth: string;
      placeOfBirth: string;
      religion: string;
      caste: string;
      kuldevata: string;
      gotra: string;
      rashi: string;
      nakshatra: string;
      gan: string;
      nadi: string;
      height: string;
      weight?: string;
      complexion: string;
      bloodGroup: string;
      maritalStatus: string;
      motherTongue: string;
      photoUrl: string;
    };
    educationOccupation: {
      education: string;
      occupation: string;
      companyName: string;
      annualIncome: string;
      workLocation: string;
    };
    familyDetails: {
      fatherName: string;
      fatherOccupation: string;
      motherName: string;
      motherOccupation: string;
      brothers: string;
      sisters: string;
      familyType?: string;
      nativePlace: string;
      maternalUncle: string;
      relations: string;
    };
    contactDetails: {
      primaryContact: string;
      secondaryContact: string;
      email: string;
      residenceAddress: string;
    };
  };
}

export const TEN_DUMMY_PROFILES: DummyBiodataProfile[] = [
  // Profile 1: Boy 1 - Rahul Sharma
  {
    id: 'profile_1',
    label: 'Profile 1: Rahul Sharma (M, 1996 - Software Engineer)',
    gender: 'male',
    data: {
      pageHeader: {
        deity: '|| श्री गणेशाय नमः ||',
        deityIcon: '🙏',
      },
      personalDetails: {
        fullName: 'Rahul Sharma',
        gender: 'Male',
        dateOfBirth: '15 August 1996',
        timeOfBirth: '08:30 AM',
        placeOfBirth: 'Nagpur, Maharashtra',
        religion: 'Hindu',
        caste: 'Brahmin',
        kuldevata: 'Ganesh',
        gotra: 'Kashyap',
        rashi: 'Leo',
        nakshatra: 'Magha',
        gan: 'Dev',
        nadi: 'Antya',
        height: "5' 9\" (175 cm)",
        weight: '70 kg',
        complexion: 'Fair',
        bloodGroup: 'B+',
        maritalStatus: 'Never Married',
        motherTongue: 'Marathi',
        photoUrl: SAMPLE_MALE_PHOTOS[0].url,
      },
      educationOccupation: {
        education: 'B.Tech in Computer Science',
        occupation: 'Senior Software Engineer',
        companyName: 'Tech Innovations Pvt Ltd',
        annualIncome: '18 LPA',
        workLocation: 'Pune, Maharashtra',
      },
      familyDetails: {
        fatherName: 'Rajesh Sharma',
        fatherOccupation: 'Retired Govt. Officer',
        motherName: 'Sunita Sharma',
        motherOccupation: 'Homemaker',
        brothers: '1 Brother (Married)',
        sisters: '1 Sister (Unmarried)',
        familyType: 'Nuclear Family',
        nativePlace: 'Nagpur, Maharashtra',
        maternalUncle: 'Sharma Family',
        relations: 'Sharma, Patil, Joshi families',
      },
      contactDetails: {
        primaryContact: '+91 98765 43210',
        secondaryContact: '+91 98765 43211',
        email: 'rahul.sharma@example.com',
        residenceAddress: 'Kothrud, Pune, Maharashtra',
      },
    },
  },

  // Profile 2: Girl 1 - Priya Patel
  {
    id: 'profile_2',
    label: 'Profile 2: Priya Patel (F, 1998 - UI/UX Designer)',
    gender: 'female',
    data: {
      pageHeader: {
        deity: '|| श्री गणेशाय नमः ||',
        deityIcon: '🙏',
      },
      personalDetails: {
        fullName: 'Priya Patel',
        gender: 'Female',
        dateOfBirth: '10 December 1998',
        timeOfBirth: '11:15 AM',
        placeOfBirth: 'Mumbai, Maharashtra',
        religion: 'Hindu',
        caste: 'Maratha',
        kuldevata: 'Mahalaxmi',
        gotra: 'Vashishta',
        rashi: 'Virgo',
        nakshatra: 'Chitra',
        gan: 'Dev',
        nadi: 'Madhya',
        height: "5' 4\" (163 cm)",
        weight: '54 kg',
        complexion: 'Fair',
        bloodGroup: 'A+',
        maritalStatus: 'Never Married',
        motherTongue: 'Marathi',
        photoUrl: SAMPLE_FEMALE_PHOTOS[0].url,
      },
      educationOccupation: {
        education: 'M.Des (Product Design)',
        occupation: 'Lead Product Designer',
        companyName: 'Creative Digital Studio',
        annualIncome: '14 LPA',
        workLocation: 'Mumbai, Maharashtra',
      },
      familyDetails: {
        fatherName: 'Dinesh Patel',
        fatherOccupation: 'Architect',
        motherName: 'Meena Patel',
        motherOccupation: 'Professor',
        brothers: '1 Brother (Software Eng.)',
        sisters: 'None',
        familyType: 'Nuclear Family',
        nativePlace: 'Pune, Maharashtra',
        maternalUncle: 'Patel Family',
        relations: 'Patel, Kulkarni, Shah families',
      },
      contactDetails: {
        primaryContact: '+91 98765 43220',
        secondaryContact: '+91 98765 43221',
        email: 'priya.patel@example.com',
        residenceAddress: 'Andheri West, Mumbai, Maharashtra',
      },
    },
  },

  // Profile 3: Boy 2 - Vikram Joshi
  {
    id: 'profile_3',
    label: 'Profile 3: Vikram Joshi (M, 1995 - Product Manager)',
    gender: 'male',
    data: {
      pageHeader: {
        deity: '|| श्री महालक्ष्मी प्रसन्न ||',
        deityIcon: '🕉️',
      },
      personalDetails: {
        fullName: 'Vikram Joshi',
        gender: 'Male',
        dateOfBirth: '24 March 1995',
        timeOfBirth: '09:45 AM',
        placeOfBirth: 'Nashik, Maharashtra',
        religion: 'Hindu',
        caste: 'Brahmin',
        kuldevata: 'Khandoba',
        gotra: 'Bharadwaj',
        rashi: 'Aries',
        nakshatra: 'Ashwini',
        gan: 'Dev',
        nadi: 'Adya',
        height: "5' 11\" (180 cm)",
        weight: '74 kg',
        complexion: 'Fair',
        bloodGroup: 'O+',
        maritalStatus: 'Never Married',
        motherTongue: 'Marathi',
        photoUrl: SAMPLE_MALE_PHOTOS[1].url,
      },
      educationOccupation: {
        education: 'MBA, B.E. (Mechanical)',
        occupation: 'Senior Product Manager',
        companyName: 'Global FinTech Solutions',
        annualIncome: '22 LPA',
        workLocation: 'Bengaluru, Karnataka',
      },
      familyDetails: {
        fatherName: 'Sudhir Joshi',
        fatherOccupation: 'Consultant',
        motherName: 'Radha Joshi',
        motherOccupation: 'School Principal',
        brothers: 'None',
        sisters: '1 Sister (Married)',
        familyType: 'Nuclear Family',
        nativePlace: 'Nashik, Maharashtra',
        maternalUncle: 'Joshi Family',
        relations: 'Joshi, Deshpande, Kulkarni families',
      },
      contactDetails: {
        primaryContact: '+91 98765 43212',
        secondaryContact: '+91 98765 43213',
        email: 'vikram.joshi@example.com',
        residenceAddress: 'Indiranagar, Bengaluru, Karnataka',
      },
    },
  },

  // Profile 4: Girl 2 - Sunita Kulkarni
  {
    id: 'profile_4',
    label: 'Profile 4: Sunita Kulkarni (F, 1999 - Financial Analyst)',
    gender: 'female',
    data: {
      pageHeader: {
        deity: '|| श्री गणेशाय नमः ||',
        deityIcon: '🌸',
      },
      personalDetails: {
        fullName: 'Sunita Kulkarni',
        gender: 'Female',
        dateOfBirth: '18 September 1999',
        timeOfBirth: '06:20 PM',
        placeOfBirth: 'Satara, Maharashtra',
        religion: 'Hindu',
        caste: 'Brahmin',
        kuldevata: 'Bhavani',
        gotra: 'Shandilya',
        rashi: 'Scorpio',
        nakshatra: 'Anuradha',
        gan: 'Dev',
        nadi: 'Madhya',
        height: "5' 5\" (165 cm)",
        weight: '55 kg',
        complexion: 'Very Fair',
        bloodGroup: 'B+',
        maritalStatus: 'Never Married',
        motherTongue: 'Marathi',
        photoUrl: SAMPLE_FEMALE_PHOTOS[1].url,
      },
      educationOccupation: {
        education: 'M.Com, CFA Level 2',
        occupation: 'Investment Analyst',
        companyName: 'Capital Growth Advisory',
        annualIncome: '11 LPA',
        workLocation: 'Pune, Maharashtra',
      },
      familyDetails: {
        fatherName: 'Prakash Kulkarni',
        fatherOccupation: 'Chartered Accountant',
        motherName: 'Anuradha Kulkarni',
        motherOccupation: 'Homemaker',
        brothers: '1 Brother (Pursuing MS)',
        sisters: 'None',
        familyType: 'Joint Family',
        nativePlace: 'Satara, Maharashtra',
        maternalUncle: 'Kulkarni Family',
        relations: 'Kulkarni, Gokhale, Shinde families',
      },
      contactDetails: {
        primaryContact: '+91 98765 43222',
        secondaryContact: '+91 98765 43223',
        email: 'sunita.kulkarni@example.com',
        residenceAddress: 'Baner, Pune, Maharashtra',
      },
    },
  },

  // Profile 5: Boy 3 - Akash Verma
  {
    id: 'profile_5',
    label: 'Profile 5: Akash Verma (M, 1997 - Architect)',
    gender: 'male',
    data: {
      pageHeader: {
        deity: '|| ॐ नमः शिवाय ||',
        deityIcon: '🕉️',
      },
      personalDetails: {
        fullName: 'Akash Verma',
        gender: 'Male',
        dateOfBirth: '14 November 1997',
        timeOfBirth: '10:10 AM',
        placeOfBirth: 'Jaipur, Rajasthan',
        religion: 'Hindu',
        caste: 'Kayastha',
        kuldevata: 'Shiva',
        gotra: 'Kashyap',
        rashi: 'Cancer',
        nakshatra: 'Pushya',
        gan: 'Dev',
        nadi: 'Madhya',
        height: "5' 10\" (178 cm)",
        weight: '72 kg',
        complexion: 'Fair',
        bloodGroup: 'O+',
        maritalStatus: 'Never Married',
        motherTongue: 'Hindi',
        photoUrl: SAMPLE_MALE_PHOTOS[2].url,
      },
      educationOccupation: {
        education: 'B.Arch (SPA Delhi)',
        occupation: 'Principal Architect',
        companyName: 'Verma & Associates Urban Studio',
        annualIncome: '16 LPA',
        workLocation: 'Delhi NCR',
      },
      familyDetails: {
        fatherName: 'Anil Verma',
        fatherOccupation: 'Civil Engineer (PWD)',
        motherName: 'Geeta Verma',
        motherOccupation: 'Homemaker',
        brothers: '1 Brother (Software Eng.)',
        sisters: 'None',
        familyType: 'Nuclear Family',
        nativePlace: 'Jaipur, Rajasthan',
        maternalUncle: 'Verma Family',
        relations: 'Verma, Singhania, Gupta families',
      },
      contactDetails: {
        primaryContact: '+91 98765 43214',
        secondaryContact: '+91 98765 43215',
        email: 'akash.verma@example.com',
        residenceAddress: 'Sector 62, Noida, Uttar Pradesh',
      },
    },
  },

  // Profile 6: Girl 3 - Pooja Deshmukh
  {
    id: 'profile_6',
    label: 'Profile 6: Pooja Deshmukh (F, 2000 - Cloud Engineer)',
    gender: 'female',
    data: {
      pageHeader: {
        deity: '|| श्री कुलदेवता प्रसन्न ||',
        deityIcon: '🙏',
      },
      personalDetails: {
        fullName: 'Pooja Deshmukh',
        gender: 'Female',
        dateOfBirth: '20 June 2000',
        timeOfBirth: '05:30 AM',
        placeOfBirth: 'Amravati, Maharashtra',
        religion: 'Hindu',
        caste: 'Maratha',
        kuldevata: 'Bhavani',
        gotra: 'Gautam',
        rashi: 'Taurus',
        nakshatra: 'Rohini',
        gan: 'Manushya',
        nadi: 'Antya',
        height: "5' 6\" (168 cm)",
        weight: '56 kg',
        complexion: 'Fair',
        bloodGroup: 'B+',
        maritalStatus: 'Never Married',
        motherTongue: 'Marathi',
        photoUrl: SAMPLE_FEMALE_PHOTOS[2].url,
      },
      educationOccupation: {
        education: 'B.E. (Information Technology)',
        occupation: 'Cloud Infrastructure Engineer',
        companyName: 'Amazon Web Services',
        annualIncome: '16 LPA',
        workLocation: 'Hyderabad, Telangana',
      },
      familyDetails: {
        fatherName: 'Vijay Deshmukh',
        fatherOccupation: 'Bank Manager',
        motherName: 'Sarita Deshmukh',
        motherOccupation: 'Teacher',
        brothers: 'None',
        sisters: '1 Sister',
        familyType: 'Nuclear Family',
        nativePlace: 'Amravati, Maharashtra',
        maternalUncle: 'Deshmukh Family',
        relations: 'Deshmukh, Patil, Jadhav families',
      },
      contactDetails: {
        primaryContact: '+91 98765 43224',
        secondaryContact: '+91 98765 43225',
        email: 'pooja.deshmukh@example.com',
        residenceAddress: 'Hitec City, Hyderabad, Telangana',
      },
    },
  },

  // Profile 7: Boy 4 - Arjun Nair
  {
    id: 'profile_7',
    label: 'Profile 7: Arjun Nair (M, 1996 - Data Scientist)',
    gender: 'male',
    data: {
      pageHeader: {
        deity: '|| श्री गणेशाय नमः ||',
        deityIcon: '🕉️',
      },
      personalDetails: {
        fullName: 'Arjun Nair',
        gender: 'Male',
        dateOfBirth: '5 July 1996',
        timeOfBirth: '08:20 AM',
        placeOfBirth: 'Kochi, Kerala',
        religion: 'Hindu',
        caste: 'Nair',
        kuldevata: 'Ayyappa',
        gotra: 'Vashishta',
        rashi: 'Libra',
        nakshatra: 'Swati',
        gan: 'Dev',
        nadi: 'Antya',
        height: "5' 10\" (178 cm)",
        weight: '73 kg',
        complexion: 'Fair',
        bloodGroup: 'B+',
        maritalStatus: 'Never Married',
        motherTongue: 'Malayalam',
        photoUrl: SAMPLE_MALE_PHOTOS[3].url,
      },
      educationOccupation: {
        education: 'M.S. in Data Science',
        occupation: 'Senior Data Scientist',
        companyName: 'Analytics AI Labs',
        annualIncome: '24 LPA',
        workLocation: 'Bengaluru, Karnataka',
      },
      familyDetails: {
        fatherName: 'Ramesh Nair',
        fatherOccupation: 'Retired Indian Air Force',
        motherName: 'Lalitha Nair',
        motherOccupation: 'Professor',
        brothers: '1 Brother (Doctor)',
        sisters: 'None',
        familyType: 'Nuclear Family',
        nativePlace: 'Kochi, Kerala',
        maternalUncle: 'Nair Family',
        relations: 'Nair, Menon, Pillai families',
      },
      contactDetails: {
        primaryContact: '+91 98765 43216',
        secondaryContact: '+91 98765 43217',
        email: 'arjun.nair@example.com',
        residenceAddress: 'Whitefield, Bengaluru, Karnataka',
      },
    },
  },

  // Profile 8: Girl 4 - Lakshmi Iyer
  {
    id: 'profile_8',
    label: 'Profile 8: Lakshmi Iyer (F, 1997 - Physician / Doctor)',
    gender: 'female',
    data: {
      pageHeader: {
        deity: '|| श्री वेंकटेश्वराय नमः ||',
        deityIcon: '🙏',
      },
      personalDetails: {
        fullName: 'Lakshmi Iyer',
        gender: 'Female',
        dateOfBirth: '22 April 1997',
        timeOfBirth: '06:50 AM',
        placeOfBirth: 'Chennai, Tamil Nadu',
        religion: 'Hindu',
        caste: 'Iyer',
        kuldevata: 'Venkateshwara',
        gotra: 'Kashyap',
        rashi: 'Libra',
        nakshatra: 'Chitra',
        gan: 'Dev',
        nadi: 'Madhya',
        height: "5' 5\" (165 cm)",
        weight: '53 kg',
        complexion: 'Fair',
        bloodGroup: 'A+',
        maritalStatus: 'Never Married',
        motherTongue: 'Tamil',
        photoUrl: SAMPLE_FEMALE_PHOTOS[3].url,
      },
      educationOccupation: {
        education: 'MBBS, MD (General Medicine)',
        occupation: 'Consultant Physician',
        companyName: 'Apollo Multispecialty Hospital',
        annualIncome: '20 LPA',
        workLocation: 'Chennai, Tamil Nadu',
      },
      familyDetails: {
        fatherName: 'Krishnan Iyer',
        fatherOccupation: 'Senior Scientist (ISRO Retd.)',
        motherName: 'Vaidehi Iyer',
        motherOccupation: 'Homemaker',
        brothers: 'None',
        sisters: '1 Sister (Married, Architect)',
        familyType: 'Nuclear Family',
        nativePlace: 'Tirunelveli, Tamil Nadu',
        maternalUncle: 'Iyer Family',
        relations: 'Iyer, Subramanian, Shastri families',
      },
      contactDetails: {
        primaryContact: '+91 98765 43226',
        secondaryContact: '+91 98765 43227',
        email: 'dr.lakshmi.iyer@example.com',
        residenceAddress: 'Adyar, Chennai, Tamil Nadu',
      },
    },
  },

  // Profile 9: Boy 5 - Manish Singhania
  {
    id: 'profile_9',
    label: 'Profile 9: Manish Singhania (M, 1994 - Chartered Accountant)',
    gender: 'male',
    data: {
      pageHeader: {
        deity: '|| श्री गणेशाय नमः ||',
        deityIcon: '⚜️',
      },
      personalDetails: {
        fullName: 'Manish Singhania',
        gender: 'Male',
        dateOfBirth: '29 March 1994',
        timeOfBirth: '10:05 AM',
        placeOfBirth: 'Mumbai, Maharashtra',
        religion: 'Hindu',
        caste: 'Marwari',
        kuldevata: 'Salasar Balaji',
        gotra: 'Modi',
        rashi: 'Cancer',
        nakshatra: 'Pushya',
        gan: 'Dev',
        nadi: 'Madhya',
        height: "5' 11\" (180 cm)",
        weight: '75 kg',
        complexion: 'Fair',
        bloodGroup: 'B+',
        maritalStatus: 'Never Married',
        motherTongue: 'Hindi',
        photoUrl: SAMPLE_MALE_PHOTOS[4].url,
      },
      educationOccupation: {
        education: 'FCA, B.Com (Hons)',
        occupation: 'Partner - Audit & Tax Advisory',
        companyName: 'Singhania & Co. LLP',
        annualIncome: '28 LPA',
        workLocation: 'Mumbai, Maharashtra',
      },
      familyDetails: {
        fatherName: 'Harish Singhania',
        fatherOccupation: 'Industrialist',
        motherName: 'Kavita Singhania',
        motherOccupation: 'Social Worker',
        brothers: '1 Brother (Business)',
        sisters: '1 Sister (Married)',
        familyType: 'Joint Family',
        nativePlace: 'Jaipur, Rajasthan',
        maternalUncle: 'Singhania Family',
        relations: 'Singhania, Agarwal, Mittal families',
      },
      contactDetails: {
        primaryContact: '+91 98765 43218',
        secondaryContact: '+91 98765 43219',
        email: 'manish.singhania@example.com',
        residenceAddress: 'Worli Sea Face, Mumbai, Maharashtra',
      },
    },
  },

  // Profile 10: Girl 5 - Megha Kapoor
  {
    id: 'profile_10',
    label: 'Profile 10: Megha Kapoor (F, 1999 - Marketing Director)',
    gender: 'female',
    data: {
      pageHeader: {
        deity: '|| ॐ श्री गणेशाय नमः ||',
        deityIcon: '🌸',
      },
      personalDetails: {
        fullName: 'Megha Kapoor',
        gender: 'Female',
        dateOfBirth: '11 December 1999',
        timeOfBirth: '10:15 AM',
        placeOfBirth: 'Gurugram, Haryana',
        religion: 'Hindu',
        caste: 'Khatri',
        kuldevata: 'Durga',
        gotra: 'Kaushal',
        rashi: 'Aries',
        nakshatra: 'Ashwini',
        gan: 'Dev',
        nadi: 'Adya',
        height: "5' 5\" (165 cm)",
        weight: '52 kg',
        complexion: 'Very Fair',
        bloodGroup: 'B+',
        maritalStatus: 'Never Married',
        motherTongue: 'Hindi / Punjabi',
        photoUrl: SAMPLE_FEMALE_PHOTOS[4].url,
      },
      educationOccupation: {
        education: 'MBA (Marketing, MICA), B.A. (Economics)',
        occupation: 'Brand Strategy Director',
        companyName: 'Global FMCG Brands Ltd',
        annualIncome: '17 LPA',
        workLocation: 'Gurugram, Haryana',
      },
      familyDetails: {
        fatherName: 'Rajeev Kapoor',
        fatherOccupation: 'Director - Logistics Group',
        motherName: 'Simran Kapoor',
        motherOccupation: 'Interior Designer',
        brothers: '1 Brother (Pursuing MBA)',
        sisters: 'None',
        familyType: 'Nuclear Family',
        nativePlace: 'Chandigarh',
        maternalUncle: 'Kapoor Family',
        relations: 'Kapoor, Malhotra, Khanna families',
      },
      contactDetails: {
        primaryContact: '+91 98765 43228',
        secondaryContact: '+91 98765 43229',
        email: 'megha.kapoor@example.com',
        residenceAddress: 'DLF Phase 5, Gurugram, Haryana',
      },
    },
  },
];
