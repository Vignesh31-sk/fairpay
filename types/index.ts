export interface Job {
  id: string;
  title: string;
  location: string;
  salary: string;
  description: string;
  category: string;
  company: string;
  type: "Full-time" | "Part-time" | "Contract";
}

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category:
    | "payment_issue"
    | "job_mismatch"
    | "workplace_safety"
    | "harassment"
    | "other";
  urgency: "normal" | "urgent";
  status: "pending" | "in_progress" | "resolved" | "closed";
  timestamp: string;
  voiceNote?: string; // For storing voice note file path or base64
}

export interface Analytics {
  totalJobs: number;
  jobsByCategory: { [key: string]: number };
  mostAppliedJob: string;
  applicationsCount: number;
  totalGrievances: number;
  resolvedGrievances: number;
}

export interface VoiceCommand {
  command: string;
  action: string;
  params?: any;
}
