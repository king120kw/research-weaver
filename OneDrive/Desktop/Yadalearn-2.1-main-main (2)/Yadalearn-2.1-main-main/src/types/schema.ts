// Type definitions for YadaLearn application
import type { UserRole, SessionStatus, DayOfWeek, CourseLevel, BadgeType } from './enums';

// Props types (data passed to components)
export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  performance: number;
  sessionsCompleted: number;
  interviewsCompleted: number;
  totalHours: number;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  lessonCount: number;
  level: CourseLevel;
  badge: BadgeType;
  enrolledStudents: string[];
  enrollmentCount: string;
  thumbnail: string;
  backgroundColor: string;
}

export interface WeeklyScheduleDay {
  day: DayOfWeek;
  hours: number;
  isHighest: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  subjects: string[];
  languages: string[];
  bio: string;
  profession: string;
  rateMin: number;
  rateMax: number;
  yearsExperience: number;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  performance: number;
  learningSubjects: string[];
  country: string;
  sessionsCompleted: number;
  currentStreak: number;
}

export interface ClassSession {
  id: string;
  title: string;
  teacher: string;
  teacherInitials: string;
  time: string;
  day: string;
  status: SessionStatus;
}

export interface ScheduleSession {
  id: string;
  title: string;
  time: string;
  student: string;
  studentInitials: string;
  status: SessionStatus;
}

// Store types (global state data)
export interface StoreTypes {
  currentUser: User;
}

// Query types (API response data)
export interface QueryTypes {
  courses: Course[];
  weeklySchedule: WeeklyScheduleDay[];
  topTeachers: Teacher[];
  topStudents: Student[];
  upcomingClasses: ClassSession[];
  teacherSchedule: ScheduleSession[];
}