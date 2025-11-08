// Metadata configuration for all pages
export const pageMetadata = {
  home: {
    title: "Find Doctors, Clinics & Pathology Labs in Midnapore | DrHelp.in",
    description: "DrHelp helps you find trusted doctors, clinics, pathology labs, and ambulance services in Tamluk, Haldia, Contai, and nearby areas. Book medical services easily and get care when you need it most.",
    keywords: "doctors in midnapore, clinics in tamluk, pathology labs, ambulance services, healthcare midnapore, book doctor appointment",
  },
  about: {
    title: "About DrHelp - Your Trusted Healthcare Partner | DrHelp.in",
    description: "Learn about DrHelp's mission to connect patients with quality healthcare providers in Midnapore. Discover our commitment to patient-centered care and expert medical network.",
    keywords: "about drhelp, healthcare platform, medical services midnapore, patient care",
  },
  search: {
    title: "Search Doctors, Clinics & Labs | DrHelp.in",
    description: "Search and find the best doctors, clinics, and pathology labs near you. Filter by specialization, location, and availability to book appointments instantly.",
    keywords: "search doctors, find clinics, medical search, healthcare providers",
  },
  pathology: {
    title: "Pathology Labs & Diagnostic Centers | DrHelp.in",
    description: "Find trusted pathology labs and diagnostic centers in Midnapore. Book tests online, compare packages, and get accurate results from certified labs.",
    keywords: "pathology labs, diagnostic centers, medical tests, blood tests, health checkup",
  },
  blog: {
    title: "Health Tips & Medical Articles | DrHelp Blog",
    description: "Read the latest health tips, medical advice, and healthcare news. Expert articles on wellness, disease prevention, and healthy living.",
    keywords: "health tips, medical articles, wellness blog, healthcare advice",
  },
  login: {
    title: "Login to DrHelp | Access Your Health Dashboard",
    description: "Login to your DrHelp account to manage appointments, view medical records, and connect with healthcare providers.",
    keywords: "drhelp login, patient login, healthcare account",
  },
  register: {
    title: "Register on DrHelp | Create Your Account",
    description: "Create your DrHelp account to book appointments, access health records, and connect with trusted healthcare providers in your area.",
    keywords: "register drhelp, create account, patient signup",
  },
  profile: {
    title: "My Profile | DrHelp Dashboard",
    description: "Manage your DrHelp profile, view appointment history, update personal information, and access your health records.",
    keywords: "patient profile, my appointments, health dashboard",
  },
  bookings: {
    title: "My Bookings | DrHelp",
    description: "View and manage your medical appointments, test bookings, and consultation history on DrHelp.",
    keywords: "my bookings, appointments, medical history",
  },
  forgotPassword: {
    title: "Reset Password | DrHelp",
    description: "Reset your DrHelp account password securely. Enter your email to receive password reset instructions.",
    keywords: "reset password, forgot password, account recovery",
  },
  admin: {
    title: "Admin Dashboard | DrHelp",
    description: "Manage doctors, clinics, pathology labs, and users on the DrHelp platform.",
    keywords: "admin dashboard, healthcare management",
  },
};

// Generate dynamic metadata for specific entity pages
export const generateDoctorMetadata = (doctor) => {
  if (!doctor) return pageMetadata.search;
  
  const name = doctor.name || `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();
  const specialization = doctor.specialization || 'Healthcare Professional';
  const location = doctor.city || doctor.location || doctor.state || 'Midnapore';
  
  return {
    title: `Dr. ${name} - ${specialization} in ${location} | DrHelp.in`,
    description: `Book appointment with Dr. ${name}, a qualified ${specialization} in ${location}. ${doctor.experience ? `${doctor.experience} years of experience.` : ''} View profile, availability, and patient reviews.`,
    keywords: `Dr. ${name}, ${specialization} ${location}, book doctor appointment, ${specialization.toLowerCase()} near me`,
  };
};

export const generateClinicMetadata = (clinic) => {
  if (!clinic) return pageMetadata.search;
  
  const name = clinic.name || 'Medical Clinic';
  const location = clinic.city || clinic.location || clinic.state || 'Midnapore';
  
  return {
    title: `${name} - Clinic in ${location} | DrHelp.in`,
    description: `${name} in ${location}. ${clinic.description || 'Quality healthcare services with experienced doctors and modern facilities.'} Book appointments online.`,
    keywords: `${name}, clinic ${location}, medical center, healthcare facility`,
  };
};

export const generatePathologyMetadata = (lab) => {
  if (!lab) return pageMetadata.pathology;
  
  const name = lab.name || 'Pathology Lab';
  const location = lab.city || lab.location || lab.state || 'Midnapore';
  
  return {
    title: `${name} - Pathology Lab in ${location} | DrHelp.in`,
    description: `${name} in ${location}. ${lab.description || 'Certified diagnostic lab offering comprehensive medical tests and health checkup packages.'} Book tests online.`,
    keywords: `${name}, pathology lab ${location}, diagnostic center, medical tests`,
  };
};

export const generateTestMetadata = (testName, location) => {
  return {
    title: `${testName} Test in ${location || 'Midnapore'} | DrHelp.in`,
    description: `Book ${testName} test online in ${location || 'Midnapore'}. Compare prices from certified pathology labs and get accurate results.`,
    keywords: `${testName} test, ${testName} ${location || 'midnapore'}, book medical test, diagnostic test`,
  };
};

export const generateAmbulanceMetadata = (ambulance) => {
  if (!ambulance) return pageMetadata.search;
  
  const name = ambulance.name || ambulance.vehicleNumber || 'Ambulance Service';
  const location = ambulance.city || ambulance.location || 'Midnapore';
  
  return {
    title: `${name} - Ambulance Service in ${location} | DrHelp.in`,
    description: `${name} in ${location}. ${ambulance.description || 'Emergency ambulance service available 24/7 with trained medical staff.'} Book now.`,
    keywords: `ambulance service ${location}, emergency ambulance, medical transport`,
  };
};

export const generateBlogMetadata = (post) => {
  if (!post) return pageMetadata.blog;
  
  return {
    title: `${post.title} | DrHelp Blog`,
    description: post.excerpt || post.description || post.title,
    keywords: `${post.category || 'health'}, ${post.tags?.join(', ') || 'healthcare, medical advice'}`,
  };
};

