import { ResumeData } from '../types';

export const INITIAL_RESUMES: ResumeData[] = [
  {
    id: 'resume-executive-1',
    title: 'Senior Software Engineer Resume',
    updatedAt: new Date().toISOString(),
    version: 'v2.4 - Systems Focus',
    personalInfo: {
      fullName: 'Alexander Mercer',
      jobTitle: 'Senior Distributed Systems Engineer',
      email: 'alexander.mercer@enterprise.io',
      phone: '+1 (415) 892-3401',
      location: 'San Francisco, CA',
      website: 'https://alexmercer.dev',
      linkedin: 'linkedin.com/in/alex-mercer-systems',
      github: 'github.com/alexmercer-dev',
      photoUrl: '',
      summary: 'Senior Software Engineer with 8+ years of experience designing scalable distributed systems, high-throughput microservices, and cloud storage engines. Proven track record of optimizing database query performance and reducing infrastructure operating costs by 35%. Specialist in Rust, Go, TypeScript, and event-driven architectures.',
    },
    experiences: [
      {
        id: 'exp-1',
        company: 'CloudScale Technologies',
        role: 'Senior Distributed Systems Engineer',
        location: 'San Francisco, CA',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected and deployed a multi-region event streaming pipeline processing 3.8 billion daily requests with 99.999% uptime.',
          'Engineered an automated cache invalidation engine that reduced database read latency from 28ms to 3.2ms, cutting annual infrastructure costs by $840,000.',
          'Led a cross-functional team of 8 engineers to overhaul payment processing pipelines, resulting in zero downtime during peak transaction events.',
          'Mentored 5 junior and mid-level engineers, establishing engineering design doc standards across the organization.',
        ],
      },
      {
        id: 'exp-2',
        company: 'Nexus Infrastructure Labs',
        role: 'Software Engineer II',
        location: 'Seattle, WA',
        startDate: '2018',
        endDate: '2021',
        current: false,
        bullets: [
          'Developed telemetry agents in Go and C++ for virtual network monitoring across 15,000+ cluster nodes.',
          'Optimized memory buffer allocation in Linux kernel drivers, increasing packet throughput by 32%.',
          'Reduced CI/CD build execution times from 42 minutes to 5 minutes by parallelizing Docker container build stages.',
        ],
      },
    ],
    educations: [
      {
        id: 'edu-1',
        institution: 'University of Washington',
        degree: 'Master of Science',
        field: 'Computer Science & Engineering',
        location: 'Seattle, WA',
        startDate: '2016',
        endDate: '2018',
        gpa: '3.92',
      },
    ],
    skillCategories: [
      {
        id: 'sk-1',
        category: 'Languages & Core Systems',
        skills: ['Rust', 'Go', 'TypeScript', 'C++', 'Python', 'SQL', 'System Design', 'gRPC'],
      },
      {
        id: 'sk-2',
        category: 'Cloud Infrastructure & DevOps',
        skills: ['Kubernetes', 'AWS (EKS, DynamoDB, Lambda)', 'Kafka', 'Terraform', 'Docker', 'Redis'],
      },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Open LogStream Engine',
        subtitle: 'High-Throughput Log Aggregator',
        link: 'github.com/alexmercer-dev/log-stream',
        bullets: [
          'Created an open-source log aggregator capable of indexing 400,000 events/sec with sub-millisecond search response times.',
        ],
        techStack: ['Rust', 'Tokio', 'Raft Consensus'],
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        title: 'AWS Certified Solutions Architect - Professional',
        issuer: 'Amazon Web Services',
        date: '2023',
      },
    ],
    customSections: [],
  },
  {
    id: 'resume-pm-2',
    title: 'Principal Product Manager Resume',
    updatedAt: new Date().toISOString(),
    version: 'v1.8 - Enterprise B2B Focus',
    personalInfo: {
      fullName: 'Elena Vance',
      jobTitle: 'Principal Product Manager | Enterprise Cloud',
      email: 'elena.vance@enterprise.io',
      phone: '+1 (206) 451-9920',
      location: 'Seattle, WA',
      website: 'https://elenavance.pm',
      linkedin: 'linkedin.com/in/elena-vance-pm',
      github: '',
      photoUrl: '',
      summary: 'Strategic Product Leader with 9+ years directing B2B SaaS platforms, developer API ecosystems, and cloud security suites. Proven record of scaling platform products from initial launch to $32M Annual Recurring Revenue (ARR). Expert in customer discovery, roadmapping, and cross-functional engineering execution.',
    },
    experiences: [
      {
        id: 'exp-pm-1',
        company: 'Vanguard Cloud Systems',
        role: 'Principal Product Manager',
        location: 'Seattle, WA',
        startDate: '2020',
        endDate: 'Present',
        current: true,
        bullets: [
          'Defined 3-year vision and roadmap for enterprise API developer platform, growing active enterprise accounts from 1,400 to 38,000.',
          'Partnered with security engineering to achieve SOC2 Type II and ISO 27001 compliance, unlocking $12M in Fortune 500 contracts.',
          'Increased monthly developer retention by 28% through telemetry-informed onboarding simplification and interactive documentation.',
        ],
      },
    ],
    educations: [
      {
        id: 'edu-pm-1',
        institution: 'Stanford University',
        degree: 'Master of Business Administration (MBA)',
        field: 'Technology Management',
        location: 'Stanford, CA',
        startDate: '2016',
        endDate: '2018',
      },
    ],
    skillCategories: [
      {
        id: 'sk-pm-1',
        category: 'Product & Strategy',
        skills: ['Product Vision', 'Roadmapping', 'GTM Strategy', 'User Discovery', 'B2B SaaS Growth', 'Data Analytics'],
      },
    ],
    projects: [],
    certifications: [],
    customSections: [],
  },
];
