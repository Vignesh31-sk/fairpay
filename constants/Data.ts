import { Analytics, Grievance, Job } from "@/types";

export const DUMMY_JOBS: Job[] = [
  {
    id: "1",
    title: "Electrician",
    location: "Mumbai, Maharashtra",
    salary: "₹25,000 - ₹35,000",
    description:
      "Experienced electrician required for residential and commercial projects. Must have valid license.",
    category: "electrician",
    company: "PowerTech Solutions",
    type: "Full-time",
  },
  {
    id: "2",
    title: "Plumber",
    location: "Delhi, NCR",
    salary: "₹20,000 - ₹30,000",
    description:
      "Skilled plumber needed for maintenance and installation work. 2+ years experience required.",
    category: "plumber",
    company: "AquaFix Services",
    type: "Full-time",
  },
  {
    id: "3",
    title: "Construction Worker",
    location: "Bangalore, Karnataka",
    salary: "₹18,000 - ₹25,000",
    description:
      "Construction worker for building projects. Physical fitness and safety knowledge required.",
    category: "construction",
    company: "BuildRight Infrastructure",
    type: "Contract",
  },
  {
    id: "4",
    title: "Mechanic",
    location: "Pune, Maharashtra",
    salary: "₹22,000 - ₹32,000",
    description:
      "Auto mechanic for vehicle repairs and maintenance. Experience with bikes and cars preferred.",
    category: "mechanic",
    company: "AutoCare Garage",
    type: "Full-time",
  },
  {
    id: "5",
    title: "Welder",
    location: "Chennai, Tamil Nadu",
    salary: "₹24,000 - ₹34,000",
    description:
      "Certified welder for metal fabrication work. Must know arc and gas welding techniques.",
    category: "welder",
    company: "MetalWorks Ltd",
    type: "Full-time",
  },
  {
    id: "6",
    title: "Carpenter",
    location: "Hyderabad, Telangana",
    salary: "₹20,000 - ₹28,000",
    description:
      "Skilled carpenter for furniture making and home renovation projects.",
    category: "carpenter",
    company: "WoodCraft Interiors",
    type: "Part-time",
  },
];

export const DUMMY_GRIEVANCES: Grievance[] = [
  {
    id: "1",
    title: "Payment Delayed",
    description:
      "My salary for last month has not been paid yet despite multiple requests.",
    category: "payment_issue",
    urgency: "urgent",
    status: "pending",
    timestamp: "2025-08-01T10:30:00Z",
  },
  {
    id: "2",
    title: "Job Description Mismatch",
    description:
      "The actual work is different from what was described during hiring.",
    category: "job_mismatch",
    urgency: "normal",
    status: "in_progress",
    timestamp: "2025-07-28T14:15:00Z",
  },
  {
    id: "3",
    title: "Safety Equipment Not Provided",
    description:
      "Company is not providing proper safety equipment for construction work.",
    category: "workplace_safety",
    urgency: "urgent",
    status: "resolved",
    timestamp: "2025-07-25T09:45:00Z",
  },
];

export const DUMMY_ANALYTICS: Analytics = {
  totalJobs: 156,
  jobsByCategory: {
    Electrician: 25,
    Plumber: 20,
    Construction: 35,
    Mechanic: 18,
    Welder: 22,
    Carpenter: 15,
    Others: 21,
  },
  mostAppliedJob: "Construction Worker",
  applicationsCount: 42,
  totalGrievances: 8,
  resolvedGrievances: 5,
};

export const VOICE_COMMANDS = {
  NAVIGATION: {
    "go to profile": "navigate_profile",
    "show me profile": "navigate_profile",
    "open profile": "navigate_profile",
    "show me jobs": "navigate_jobs",
    "open jobs": "navigate_jobs",
    "find jobs": "navigate_jobs",
    "job search": "navigate_jobs",
    "open analytics": "navigate_analytics",
    "show analytics": "navigate_analytics",
    "show stats": "navigate_analytics",
    "file a complaint": "navigate_grievance",
    "raise grievance": "navigate_grievance",
    "complain about job": "navigate_grievance",
    "report issue": "navigate_grievance",
  },
  JOB_SEARCH: {
    "search for electrician": "search_jobs",
    "find electrician jobs": "search_jobs",
    "search for plumber": "search_jobs",
    "find plumber jobs": "search_jobs",
    "search for construction": "search_jobs",
    "find construction jobs": "search_jobs",
    "search for mechanic": "search_jobs",
    "find mechanic jobs": "search_jobs",
    "search for welder": "search_jobs",
    "find welder jobs": "search_jobs",
    "search for carpenter": "search_jobs",
    "find carpenter jobs": "search_jobs",
  },
  JOB_ACTIONS: {
    "apply for job": "apply_job",
    "apply for this job": "apply_job",
    "apply for plumbing job": "apply_specific_job",
    "apply for electrician job": "apply_specific_job",
    "apply for construction job": "apply_specific_job",
  },
};
