"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  Tag,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";

export default function BlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  const { get } = useApi();
  const [liked, setLiked] = useState(false);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
      setImageError(false);
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const response = await get(`/blogs/slug/${slug}`);
      const blogData = response.data?.blog || response.data;
      console.log("Blog data received:", blogData);
      console.log("ImageUrl:", blogData?.imageUrl);
      console.log("Image object:", blogData?.image);
      setPost(blogData);
    } catch (error) {
      console.error("Error fetching blog:", error);
      // Fallback to sample data
      setPost(sampleBlogPosts[slug]);
    } finally {
      setLoading(false);
    }
  };

  // Sample blog posts data for fallback
  const sampleBlogPosts = {
    "healthcare-services-midnapore": {
      title: "Comprehensive Healthcare Services Now Available in Midnapore",
      author: "Dr. Rajesh Kumar",
      date: "October 25, 2025",
      category: "Healthcare",
      readTime: "5 min read",
      tags: ["Healthcare", "Midnapore", "Digital Health", "Patient Care"],
      content: `
        <h2>Transforming Healthcare Access in Midnapore Region</h2>
        <p>
          We are excited to announce the launch of DrHelp.in, a comprehensive healthcare platform designed to connect patients with trusted medical professionals and facilities across Midnapore, Tamluk, Haldia, Contai, and surrounding areas.
        </p>

        <h3>What Makes DrHelp.in Different?</h3>
        <p>
          In today's fast-paced world, accessing quality healthcare shouldn't be complicated. DrHelp.in simplifies the entire process by bringing together doctors, clinics, pathology labs, and emergency services on a single, easy-to-use platform.
        </p>

        <h3>Key Features of Our Platform</h3>
        <ul>
          <li><strong>Easy Doctor Discovery:</strong> Find qualified doctors by specialty, location, or availability</li>
          <li><strong>Instant Booking:</strong> Book appointments online 24/7 without waiting on phone lines</li>
          <li><strong>Verified Clinics:</strong> Access information about trusted clinics and hospitals in your area</li>
          <li><strong>Pathology Services:</strong> Schedule diagnostic tests and health checkup packages</li>
          <li><strong>Emergency Support:</strong> Quick access to ambulance services when every second counts</li>
        </ul>

        <h3>Serving Multiple Cities</h3>
        <p>
          Our platform currently serves patients across several key locations in the Midnapore region:
        </p>
        <ul>
          <li><strong>Midnapore:</strong> The heart of our operations with extensive network of healthcare providers</li>
          <li><strong>Tamluk:</strong> Growing healthcare hub with quality medical facilities</li>
          <li><strong>Haldia:</strong> Industrial city with increasing healthcare needs</li>
          <li><strong>Contai:</strong> Coastal town benefiting from improved medical access</li>
        </ul>

        <h3>How It Works</h3>
        <p>
          Using DrHelp.in is simple and straightforward:
        </p>
        <ol>
          <li><strong>Search:</strong> Enter your symptoms, required specialty, or location</li>
          <li><strong>Compare:</strong> View profiles, read reviews, and check availability</li>
          <li><strong>Book:</strong> Schedule your appointment instantly</li>
          <li><strong>Visit:</strong> Receive confirmation and visit the doctor at scheduled time</li>
        </ol>

        <h3>Quality Healthcare for Everyone</h3>
        <p>
          Our mission is to make quality healthcare accessible to everyone, regardless of their location. Whether you need a routine checkup, specialist consultation, diagnostic tests, or emergency services, DrHelp.in is your trusted healthcare companion.
        </p>

        <h3>Patient-Centric Approach</h3>
        <p>
          We understand that healthcare is personal. That's why we've designed our platform with patient needs at the forefront:
        </p>
        <ul>
          <li>Transparent pricing with no hidden costs</li>
          <li>Real patient reviews and ratings</li>
          <li>Easy appointment rescheduling</li>
          <li>Secure health records management</li>
          <li>24/7 customer support</li>
        </ul>

        <h3>Join the Healthcare Revolution</h3>
        <p>
          We invite you to experience the future of healthcare access. Whether you're a patient seeking medical care or a healthcare provider looking to reach more patients, DrHelp.in is here to serve you.
        </p>

        <p>
          <strong>Ready to get started?</strong> Visit our homepage to search for doctors, clinics, and medical services in your area. Your health is our priority!
        </p>

        <div class="bg-primary-50 dark:bg-primary-900 p-6 rounded-lg mt-8">
          <h4 class="text-lg font-bold mb-2">About the Author</h4>
          <p>
            Dr. Rajesh Kumar is a healthcare technology consultant with over 15 years of experience in digital health platforms. He specializes in improving healthcare accessibility in rural and semi-urban areas.
          </p>
        </div>
      `,
    },
    "book-appointments-online": {
      title: "How to Book Medical Appointments Online: A Complete Guide",
      author: "Priya Sharma",
      date: "October 20, 2025",
      category: "Digital Health",
      readTime: "4 min read",
      tags: ["Appointments", "Online Booking", "Healthcare Technology", "Guide"],
      content: `
        <h2>The Modern Way to Book Healthcare Appointments</h2>
        <p>
          Gone are the days of waiting in long queues or spending hours on the phone trying to book a doctor's appointment. Online appointment booking has revolutionized how we access healthcare services. This comprehensive guide will walk you through everything you need to know about booking medical appointments online.
        </p>

        <h3>Why Book Appointments Online?</h3>
        <p>
          Online appointment booking offers numerous advantages over traditional methods:
        </p>
        <ul>
          <li><strong>24/7 Availability:</strong> Book appointments anytime, anywhere, even outside clinic hours</li>
          <li><strong>Instant Confirmation:</strong> Get immediate confirmation of your booking</li>
          <li><strong>Easy Comparison:</strong> Compare doctors, read reviews, and check availability</li>
          <li><strong>Time-Saving:</strong> No need to visit or call clinics</li>
          <li><strong>Appointment Reminders:</strong> Receive automated reminders via SMS or email</li>
        </ul>

        <h3>Step-by-Step Guide to Booking Online</h3>
        
        <h4>Step 1: Create Your Account</h4>
        <p>
          Start by registering on DrHelp.in. You'll need to provide basic information such as your name, phone number, and email address. This creates your personal health profile that you can use for all future appointments.
        </p>

        <h4>Step 2: Search for Healthcare Providers</h4>
        <p>
          Use our advanced search features to find the right healthcare provider:
        </p>
        <ul>
          <li>Search by specialty (e.g., Cardiologist, Pediatrician, Dentist)</li>
          <li>Filter by location and distance</li>
          <li>Sort by ratings, experience, or consultation fees</li>
          <li>Check doctor availability and clinic timings</li>
        </ul>

        <h4>Step 3: Review Doctor Profiles</h4>
        <p>
          Take time to review doctor profiles carefully. Look for:
        </p>
        <ul>
          <li>Qualifications and certifications</li>
          <li>Years of experience</li>
          <li>Patient reviews and ratings</li>
          <li>Consultation fees</li>
          <li>Clinic address and facilities</li>
        </ul>

        <h4>Step 4: Select Date and Time</h4>
        <p>
          Once you've chosen a doctor, select your preferred appointment date and time from available slots. The system shows real-time availability, so you know exactly when the doctor is free.
        </p>

        <h4>Step 5: Provide Details</h4>
        <p>
          Fill in necessary details such as:
        </p>
        <ul>
          <li>Reason for visit</li>
          <li>Symptoms (if any)</li>
          <li>Previous medical history (optional but helpful)</li>
          <li>Any specific requirements</li>
        </ul>

        <h4>Step 6: Confirm Your Booking</h4>
        <p>
          Review all details and confirm your appointment. You'll receive an instant confirmation with:
        </p>
        <ul>
          <li>Appointment date and time</li>
          <li>Doctor's name and clinic address</li>
          <li>Booking reference number</li>
          <li>Instructions (if any)</li>
        </ul>

        <h3>Booking Pathology Tests Online</h3>
        <p>
          In addition to doctor appointments, you can also book pathology tests and health packages online:
        </p>
        <ol>
          <li>Browse available tests and packages</li>
          <li>Compare prices and lab ratings</li>
          <li>Choose home collection or lab visit</li>
          <li>Select convenient time slot</li>
          <li>Make secure online payment</li>
        </ol>

        <h3>Managing Your Appointments</h3>
        <p>
          After booking, you can easily manage your appointments through your dashboard:
        </p>
        <ul>
          <li><strong>View Upcoming Appointments:</strong> See all scheduled appointments</li>
          <li><strong>Reschedule:</strong> Change appointment date/time if needed</li>
          <li><strong>Cancel:</strong> Cancel appointments with proper notice</li>
          <li><strong>History:</strong> Access past appointment records</li>
        </ul>

        <h3>Tips for Successful Online Booking</h3>
        <ul>
          <li>Book well in advance for popular doctors</li>
          <li>Provide accurate contact information for reminders</li>
          <li>Read cancellation policies before booking</li>
          <li>Keep your booking reference number handy</li>
          <li>Arrive 10-15 minutes early for your appointment</li>
        </ul>

        <h3>What About Emergency Situations?</h3>
        <p>
          For medical emergencies, use our quick ambulance booking feature. Simply click the emergency button, provide your location, and we'll dispatch the nearest available ambulance immediately.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Your health information is sensitive, and we take its security seriously. All data is encrypted and stored securely. We never share your personal information without your consent.
        </p>

        <div class="bg-green-50 dark:bg-green-900 p-6 rounded-lg mt-8">
          <h4 class="text-lg font-bold mb-2">Pro Tip</h4>
          <p>
            Enable notifications in your account settings to receive appointment reminders and important updates. This helps ensure you never miss an appointment!
          </p>
        </div>
      `,
    },
    "importance-regular-health-checkups": {
      title: "The Importance of Regular Health Check-ups",
      author: "Dr. Anita Das",
      date: "October 15, 2025",
      category: "Health Tips",
      readTime: "6 min read",
      tags: ["Preventive Care", "Health Screening", "Wellness", "Medical Advice"],
      content: `
        <h2>Why Regular Health Check-ups Matter</h2>
        <p>
          In our busy lives, we often neglect our health until something goes wrong. However, regular health check-ups are one of the most important investments you can make in your well-being. They help detect potential health issues before they become serious problems, ultimately saving lives and reducing healthcare costs.
        </p>

        <h3>What is a Health Check-up?</h3>
        <p>
          A health check-up, also known as a preventive health screening, is a comprehensive medical examination that evaluates your overall health status. It typically includes various tests and assessments to identify risk factors and early signs of diseases.
        </p>

        <h3>Key Benefits of Regular Check-ups</h3>

        <h4>1. Early Disease Detection</h4>
        <p>
          Many serious conditions like diabetes, heart disease, and cancer show no symptoms in early stages. Regular screenings can catch these diseases when they're most treatable:
        </p>
        <ul>
          <li>Blood tests reveal cholesterol levels, blood sugar, and organ function</li>
          <li>Blood pressure monitoring detects hypertension early</li>
          <li>Cancer screenings can identify tumors before symptoms appear</li>
        </ul>

        <h4>2. Monitor Existing Conditions</h4>
        <p>
          If you have chronic conditions like diabetes or hypertension, regular check-ups help:
        </p>
        <ul>
          <li>Track disease progression</li>
          <li>Adjust medications as needed</li>
          <li>Prevent complications</li>
          <li>Ensure treatment effectiveness</li>
        </ul>

        <h4>3. Reduce Healthcare Costs</h4>
        <p>
          Prevention is always cheaper than treatment. By catching diseases early, you can:
        </p>
        <ul>
          <li>Avoid expensive treatments for advanced diseases</li>
          <li>Reduce hospital admissions</li>
          <li>Minimize time off work due to illness</li>
          <li>Lower medication costs through early intervention</li>
        </ul>

        <h4>4. Update Vaccinations</h4>
        <p>
          Regular check-ups ensure you stay current with recommended vaccinations, protecting you from preventable diseases.
        </p>

        <h4>5. Build Doctor-Patient Relationship</h4>
        <p>
          Seeing the same doctor regularly helps them understand your health history better, leading to more personalized and effective care.
        </p>

        <h3>Recommended Check-up Frequency</h3>
        <p>
          How often should you get checked? It depends on your age and health status:
        </p>

        <h4>Ages 18-30 (Healthy Adults)</h4>
        <ul>
          <li>Complete check-up: Every 2-3 years</li>
          <li>Blood pressure: Annually</li>
          <li>Cholesterol: Every 5 years</li>
          <li>Dental check-up: Every 6 months</li>
        </ul>

        <h4>Ages 30-50</h4>
        <ul>
          <li>Complete check-up: Every 1-2 years</li>
          <li>Blood pressure: Annually</li>
          <li>Cholesterol: Every 3-5 years</li>
          <li>Diabetes screening: Every 3 years</li>
          <li>Cancer screenings: As recommended by doctor</li>
        </ul>

        <h4>Ages 50+</h4>
        <ul>
          <li>Complete check-up: Annually</li>
          <li>Blood pressure: Every 6 months</li>
          <li>Diabetes screening: Annually</li>
          <li>Cholesterol: Annually</li>
          <li>Cancer screenings: As per guidelines</li>
          <li>Bone density: Every 2 years</li>
        </ul>

        <h3>Essential Tests in a Health Check-up</h3>

        <h4>Basic Tests</h4>
        <ul>
          <li><strong>Complete Blood Count (CBC):</strong> Checks for anemia, infections, and blood disorders</li>
          <li><strong>Blood Sugar:</strong> Screens for diabetes and pre-diabetes</li>
          <li><strong>Lipid Profile:</strong> Measures cholesterol and triglycerides</li>
          <li><strong>Liver Function:</strong> Assesses liver health</li>
          <li><strong>Kidney Function:</strong> Evaluates kidney performance</li>
          <li><strong>Thyroid Function:</strong> Checks thyroid hormone levels</li>
        </ul>

        <h4>Additional Tests Based on Age/Risk</h4>
        <ul>
          <li>ECG (Electrocardiogram) for heart function</li>
          <li>Chest X-ray</li>
          <li>Ultrasound abdomen</li>
          <li>Vitamin D and B12 levels</li>
          <li>Cancer markers (if indicated)</li>
        </ul>

        <h3>Preparing for Your Check-up</h3>
        <p>
          To get the most accurate results:
        </p>
        <ul>
          <li>Fast for 8-12 hours before blood tests (if required)</li>
          <li>Bring list of current medications</li>
          <li>Note any symptoms or concerns</li>
          <li>Bring previous health records</li>
          <li>Wear comfortable clothing</li>
        </ul>

        <h3>Understanding Your Results</h3>
        <p>
          After your check-up, discuss results thoroughly with your doctor:
        </p>
        <ul>
          <li>Ask about any abnormal values</li>
          <li>Understand what tests mean</li>
          <li>Discuss lifestyle modifications needed</li>
          <li>Plan follow-up tests if required</li>
        </ul>

        <h3>Health Packages at DrHelp.in</h3>
        <p>
          We offer comprehensive health packages tailored to different age groups and needs:
        </p>
        <ul>
          <li><strong>Basic Health Package:</strong> Essential tests for routine screening</li>
          <li><strong>Executive Health Package:</strong> Comprehensive tests for busy professionals</li>
          <li><strong>Senior Citizen Package:</strong> Specialized tests for elderly</li>
          <li><strong>Women's Health Package:</strong> Gender-specific screenings</li>
          <li><strong>Cardiac Package:</strong> Heart health focused tests</li>
          <li><strong>Diabetes Package:</strong> Complete diabetes screening</li>
        </ul>

        <h3>Don't Wait – Take Action Today</h3>
        <p>
          Your health is your most valuable asset. Don't wait for symptoms to appear. Book your health check-up today through DrHelp.in and take the first step toward a healthier future.
        </p>

        <div class="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg mt-8">
          <h4 class="text-lg font-bold mb-2">Remember</h4>
          <p>
            Prevention is better than cure. Regular health check-ups are not an expense – they're an investment in your long-term health and happiness. Early detection saves lives!
          </p>
        </div>
      `,
    },
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Removed from favorites" : "Added to favorites");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-24 flex items-center justify-center">
          <div className="spinner w-12 h-12"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The article you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Blog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Article Header */}
      <article className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/blog")}
            className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blog
          </button>

          {/* Category Badge */}
          <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-full mb-4">
            {post.category}
          </span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            {post.title}
          </motion.h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{post.date || (post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{post.readTime || '5 min read'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                liked
                  ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              <span>{liked ? "Saved" : "Save"}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-xl mb-12 overflow-hidden">
            {post.imageUrl && 
             post.imageUrl !== "/images/blog-default.jpg" && 
             post.imageUrl.trim() !== "" &&
             !imageError ? (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover object-top"
                onError={() => {
                  console.error("Image failed to load:", post.imageUrl);
                  setImageError(true);
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl">📰</span>
              </div>
            )}
          </div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-5 h-5 text-gray-500" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section Placeholder */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-6 h-6 text-gray-500" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Comments
              </h3>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Comments feature coming soon! Stay tuned.
              </p>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

