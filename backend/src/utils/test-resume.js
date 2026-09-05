import { parseJobDescription } from "./job/parseJobDescription.js";

const jd = `
HR & Talent Acquisition Specialist
PeopleWorks Pakistan
Islamabad, Pakistan
Full-Time

Responsibilities
- Manage end-to-end recruitment
- Coordinate interviews
- Create and post job descriptions

Required Skills
Recruitment
Talent Acquisition
Candidate Sourcing
Resume Screening
Interview Coordination
Applicant Tracking Systems
Job Posting
LinkedIn Recruiter
Employee Onboarding
HR Operations
HRIS
Microsoft Excel
Communication

Preferred Skills
Workday
BambooHR
Employer Branding
Performance Management
Employee Relations
Payroll Coordination
SHRM Certification

Education
Bachelor's degree in Human Resources, Business, or Management

Experience
2+ years of recruitment, talent acquisition, or HR operations
`;

const result = parseJobDescription(jd);

console.log(
  JSON.stringify(
    {
      requiredSkills: result.requiredSkills,
      preferredSkills: result.preferredSkills,
      certifications: result.certifications,
      experienceRequirement: result.experienceRequirement,
      educationRequirements: result.educationRequirements,
    },
    null,
    2
  )
);