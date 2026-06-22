export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: "std-app",
    name: "Standard Application",
    subject: "Application for [Position] - [Name]",
    body: "Dear hiring team at [Company],\n\nI am excited to submit my application for the [Position] position. Having reviewed the job requirements, I believe my background and technical skills align closely with what you are looking for.\n\nI have attached my tailored CV for your review.\n\nBest regards,\n[Name]\n[Email] | [Phone]",
  },
  {
    id: "prof-direct",
    name: "Professional & Direct",
    subject: "[Position] Role - [Name]",
    body: "Hello Team [Company],\n\nI am writing to express my interest in the [Position] opening. With my strong experience in software engineering and development, I am confident I can bring immediate value to your team.\n\nPlease find my attached resume outlining my qualifications.\n\nBest regards,\n[Name]\n[Email] | [Phone]",
  },
  {
    id: "creative",
    name: "Creative & High Impact",
    subject: "Passionate Developer for [Company] - [Name]",
    body: "Hi [Company] team,\n\nI've been following [Company]'s growth and would love to contribute as a [Position]. I believe my skills in modern tech stacks and problem-solving align perfectly with what you are building.\n\nHere is my tailored resume for your consideration. Let me know if we can chat!\n\nCheers,\n[Name]\n[Email] | [Phone]",
  },
];
