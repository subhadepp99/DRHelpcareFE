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
  
  // Extract clinic information
  let clinicInfo = '';
  let clinicKeywords = '';
  if (doctor.clinicDetails && doctor.clinicDetails.length > 0) {
    // Get primary clinic or first clinic
    const primaryClinic = doctor.clinicDetails.find(c => c.isPrimary) || doctor.clinicDetails[0];
    const clinicName = primaryClinic.clinicName || primaryClinic.clinic?.name;
    
    if (clinicName) {
      clinicInfo = ` Available at ${clinicName}.`;
      clinicKeywords = `, ${clinicName}, ${clinicName} ${location}`;
    }
  }
  
  return {
    title: `Dr. ${name} - ${specialization} in ${location} | DrHelp.in`,
    description: `Book appointment with Dr. ${name}, a qualified ${specialization} in ${location}. ${doctor.experience ? `${doctor.experience} years of experience.` : ''}${clinicInfo} View profile, availability, and patient reviews.`,
    keywords: `Dr. ${name}, ${specialization} ${location}, book doctor appointment, ${specialization.toLowerCase()} near me${clinicKeywords}`,
    doctorName: `Dr. ${name}`,
    location: location,
    specialty: specialization,
  };
};

export const generateClinicMetadata = (clinic) => {
  if (!clinic) return pageMetadata.search;
  
  const name = clinic.name || 'Medical Clinic';
  const location = clinic.place || clinic.address?.city || clinic.city || clinic.location || clinic.address?.state || clinic.state || 'Midnapore';
  const state = clinic.address?.state || clinic.state || '';
  const doctorCount = clinic.doctors?.filter(d => d.isActive).length || 0;
  const doctorInfo = doctorCount > 0 ? ` ${doctorCount} experienced doctor${doctorCount > 1 ? 's' : ''} available.` : '';
  
  return {
    title: `${name} - Clinic in ${location} | DrHelp.in`,
    description: `${name} in ${location}.${doctorInfo} ${clinic.description || 'Quality healthcare services with experienced doctors and modern facilities.'} Book appointments online.`,
    keywords: `${name}, clinic ${location}, ${name} ${location}, medical center ${location}, healthcare facility, book clinic appointment${state ? `, clinic ${state}` : ''}`,
    clinicName: name,
    location: location,
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

// Generate structured data (JSON-LD) for doctor
export const generateDoctorStructuredData = (doctor) => {
  if (!doctor) return null;
  
  const name = doctor.name || `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();
  const location = doctor.city || doctor.location || doctor.state || 'Midnapore';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://drhelp.in';
  
  // Build address
  const address = {
    "@type": "PostalAddress",
    streetAddress: doctor.address?.street || '',
    addressLocality: doctor.city || doctor.address?.city || location,
    addressRegion: doctor.state || doctor.address?.state || '',
    postalCode: doctor.address?.zipCode || '',
    addressCountry: doctor.address?.country || 'India'
  };
  
  // Build clinic/workplace info if available
  let worksFor = null;
  if (doctor.clinicDetails && doctor.clinicDetails.length > 0) {
    const primaryClinic = doctor.clinicDetails.find(c => c.isPrimary) || doctor.clinicDetails[0];
    const clinicName = primaryClinic.clinicName || primaryClinic.clinic?.name;
    
    if (clinicName) {
      worksFor = {
        "@type": "MedicalClinic",
        name: clinicName,
        address: primaryClinic.clinicAddress || address
      };
    }
  }
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: `Dr. ${name}`,
    description: doctor.bio || `${doctor.specialization || 'Healthcare Professional'} in ${location}`,
    medicalSpecialty: doctor.specialization || 'General Medicine',
    image: doctor.imageUrl || doctor.image || '',
    address: address,
    telephone: doctor.phone || doctor.contactNumber || '',
    email: doctor.email || '',
    url: typeof window !== 'undefined' ? window.location.href : `${baseUrl}/doctor/${doctor._id}`,
    ...(worksFor && { worksFor }),
    ...(doctor.qualification && { 
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: doctor.qualification
      }
    }),
    ...(doctor.experience && {
      yearsOfExperience: doctor.experience
    }),
    ...(doctor.consultationFee && {
      priceRange: `₹${doctor.consultationFee}`
    })
  };
  
  return structuredData;
};

// Generate structured data (JSON-LD) for clinic
export const generateClinicStructuredData = (clinic) => {
  if (!clinic) return null;
  
  const name = clinic.name || 'Medical Clinic';
  const location = clinic.place || clinic.address?.city || clinic.city || clinic.location || clinic.address?.state || clinic.state || 'Midnapore';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://drhelp.in';
  
  // Build address
  const address = {
    "@type": "PostalAddress",
    streetAddress: clinic.address?.street || clinic.address || '',
    addressLocality: clinic.place || clinic.address?.city || clinic.city || location,
    addressRegion: clinic.address?.state || clinic.state || '',
    postalCode: clinic.address?.zipCode || clinic.address?.pincode || '',
    addressCountry: clinic.address?.country || 'India'
  };
  
  // Build opening hours if available
  let openingHours = null;
  if (clinic.openingHours || clinic.timings) {
    const hours = clinic.openingHours || clinic.timings;
    if (Array.isArray(hours) && hours.length > 0) {
      openingHours = hours.map(day => {
        if (day.isOpen) {
          return `${day.dayOfWeek} ${day.openTime}-${day.closeTime}`;
        }
        return null;
      }).filter(Boolean);
    }
  }
  
  // Build doctors list
  let medicalSpecialty = [];
  if (clinic.doctors && clinic.doctors.length > 0) {
    clinic.doctors
      .filter(d => d.isActive)
      .forEach(doctorInfo => {
        const doctor = doctorInfo.doctor || doctorInfo;
        if (doctor.specialization || doctor.department) {
          const specialty = doctor.specialization || doctor.department?.name || doctor.department;
          if (specialty && !medicalSpecialty.includes(specialty)) {
            medicalSpecialty.push(specialty);
          }
        }
      });
  }
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: name,
    description: clinic.description || `Medical clinic in ${location} providing quality healthcare services.`,
    image: clinic.imageUrl || clinic.image || '',
    address: address,
    telephone: clinic.phone || clinic.contactNumber || clinic.phoneNumber || '',
    email: clinic.email || '',
    url: typeof window !== 'undefined' ? window.location.href : `${baseUrl}/clinic/${encodeURIComponent(name.replace(/\s+/g, '-').toLowerCase())}/${encodeURIComponent(location)}`,
    ...(openingHours && openingHours.length > 0 && { openingHoursSpecification: openingHours.map(hours => {
      const [day, timeRange] = hours.split(' ');
      const [open, close] = timeRange.split('-');
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: day,
        opens: open,
        closes: close
      };
    })}),
    ...(medicalSpecialty.length > 0 && { medicalSpecialty: medicalSpecialty }),
    ...(clinic.is24Hours && { 
      openingHours: "Mo-Su 00:00-23:59"
    }),
    ...(clinic.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: clinic.rating.average || clinic.rating || 0,
        reviewCount: clinic.rating.count || 0
      }
    })
  };
  
  return structuredData;
};

