/**
 * Work Experience Data
 */
export interface WorkExperience {
  id: number;
  period: string;
  duration: string;
  company: string;
  position: string;
}

export const WORK_EXPERIENCE: readonly WorkExperience[] = [
  {
    id: 1,
    period: "2022 -",
    duration: "1 year 5 months",
    company: "ITHUB",
    position: "Frontend developer | React & Vue",
  },
  {
    id: 2,
    period: "2021 - 2022",
    duration: "8 months",
    company: "VK Development Lab",
    position: "Frontend developer | React",
  },
  {
    id: 3,
    period: "2020 - 2021",
    duration: "9 months",
    company: "SN Inc.",
    position: "Fullstack developer | JavaScript & Python",
  },
  {
    id: 4,
    period: "2018 - 2020",
    duration: "1 year 11 months",
    company: "Business Up",
    position: "Fullstack developer | JavaScript & Python",
  },
] as const;

export const WORK_EXPERIENCE_SUMMARY = {
  TOTAL_YEARS: 4,
  TOTAL_MONTHS: 9,
} as const;

