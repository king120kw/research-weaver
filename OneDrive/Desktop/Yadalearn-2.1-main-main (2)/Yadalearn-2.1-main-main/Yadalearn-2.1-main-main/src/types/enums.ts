// Enums for YadaLearn application

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher'
}

export enum SessionStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export enum DayOfWeek {
  MON = 'Mon',
  TUE = 'Tue',
  WED = 'Wed',
  THU = 'Thu',
  FRI = 'Fri',
  SAT = 'Sat',
  SUN = 'Sun'
}

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum BadgeType {
  ADVANCE_COURSE = 'Advance Course',
  POPULAR = 'Popular',
  NEW = 'New'
}