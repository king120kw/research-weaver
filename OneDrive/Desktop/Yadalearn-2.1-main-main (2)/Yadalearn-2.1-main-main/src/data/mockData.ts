// Mock data for YadaLearn application
import { UserRole, SessionStatus, DayOfWeek, CourseLevel, BadgeType } from '../types/enums';

// Data for global state store
// Try to hydrate some student preferences from onboarding saved in localStorage
const _savedOnboarding = (() => {
  try {
    const raw = localStorage.getItem('yadalearn-onboarding-data');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
})();

const _initialLearningSubjects = (
  _savedOnboarding && _savedOnboarding.role === 'student' && _savedOnboarding.answers?.languages
) ? _savedOnboarding.answers.languages : ['Spanish', 'Mathematics'];

export const mockStore = {
  currentUser: {
    id: 'user-1' as const,
    name: 'Sarah Johnson' as const,
    role: UserRole.STUDENT,
    avatar: 'https://i.pravatar.cc/150?img=1' as const,
    performance: 86,
    sessionsCompleted: 24,
    interviewsCompleted: 8,
    totalHours: 32,
    // hydrate learningSubjects from onboarding if available
    learningSubjects: _initialLearningSubjects
  }
};

// Data returned by API queries
export const mockQuery = {
  courses: [
    {
      id: 'course-1' as const,
      title: 'Study Of English' as const,
      instructor: 'Mike William' as const,
      instructorAvatar: 'https://i.pravatar.cc/150?img=12' as const,
      lessonCount: 20,
      level: CourseLevel.ADVANCED,
      badge: BadgeType.ADVANCE_COURSE,
      enrolledStudents: ['https://i.pravatar.cc/150?img=2', 'https://i.pravatar.cc/150?img=3', 'https://i.pravatar.cc/150?img=4'],
      enrollmentCount: '1k' as const,
      thumbnail: 'https://images.unsplash.com/photo-1553605455-51e389af5d1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHx3b21hbiUyMHN0dWRlbnQlMjBzdHVkeWluZyUyMGdsYXNzZXN8ZW58MHwxfHx8MTc2MDczMDc4M3ww&ixlib=rb-4.1.0&q=85' as const,
      backgroundColor: '#C9B4E8' as const
    },
    {
      id: 'course-2' as const,
      title: 'Study Of Bangla' as const,
      instructor: 'Robert Fox' as const,
      instructorAvatar: 'https://i.pravatar.cc/150?img=13' as const,
      lessonCount: 22,
      level: CourseLevel.ADVANCED,
      badge: BadgeType.ADVANCE_COURSE,
      enrolledStudents: ['https://i.pravatar.cc/150?img=5', 'https://i.pravatar.cc/150?img=6', 'https://i.pravatar.cc/150?img=7'],
      enrollmentCount: '2k' as const,
      thumbnail: 'https://images.unsplash.com/photo-1755140242069-471516b38aae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxtYW4lMjBzdHVkZW50JTIwZ2xhc3NlcyUyMHN0dWR5aW5nfGVufDB8MXx8fDE3NjA3MzA3ODJ8MA&ixlib=rb-4.1.0&q=85' as const,
      backgroundColor: '#4A9B8E' as const
    }
  ],
  weeklySchedule: [
    { day: DayOfWeek.MON, hours: 0.8, isHighest: false },
    { day: DayOfWeek.TUE, hours: 1.2, isHighest: false },
    { day: DayOfWeek.WED, hours: 1.5, isHighest: false },
    { day: DayOfWeek.THU, hours: 3.5, isHighest: true },
    { day: DayOfWeek.FRI, hours: 0, isHighest: false },
    { day: DayOfWeek.SAT, hours: 1.8, isHighest: false },
    { day: DayOfWeek.SUN, hours: 2.0, isHighest: false }
  ],
  topTeachers: [
    {
      id: 'teacher-1' as const,
      name: 'Emily Kim' as const,
      role: 'Founder' as const,
      avatar: 'https://i.pravatar.cc/150?img=1' as const,
      rating: 4.9,
      subjects: ['English', 'Mathematics'],
      languages: ['English', 'Spanish'],
      bio: 'Experienced educator with 10+ years of teaching' as const,
      profession: 'Language Teacher' as const,
      rateMin: 35,
      rateMax: 42,
      yearsExperience: 10
    },
    // ... existing code ...
    {
      id: 'teacher-2' as const,
      name: 'Michael Steward' as const,
      role: 'Creative Director' as const,
      avatar: 'https://i.pravatar.cc/150?img=2' as const,
      rating: 4.8,
      subjects: ['Science', 'Physics'],
      languages: ['English'],
      bio: 'Passionate about making science fun and accessible' as const,
      profession: 'Science Teacher' as const,
      rateMin: 40,
      rateMax: 50,
      yearsExperience: 8
    },
    {
      id: 'teacher-3' as const,
      name: 'Emma Rodriguez' as const,
      role: 'Lead Developer' as const,
      avatar: 'https://i.pravatar.cc/150?img=3' as const,
      rating: 4.95,
      subjects: ['Mathematics', 'Computer Science'],
      languages: ['English', 'French'],
      bio: 'Specializing in advanced mathematics and programming' as const,
      profession: 'Math & CS Teacher' as const,
      rateMin: 45,
      rateMax: 55,
      yearsExperience: 12
    },
    {
      id: 'teacher-4' as const,
      name: 'Julia Gimmel' as const,
      role: 'UX Designer' as const,
      avatar: 'https://i.pravatar.cc/150?img=4' as const,
      rating: 4.7,
      subjects: ['Art', 'Design'],
      languages: ['English', 'German'],
      bio: 'Creative arts and design specialist' as const,
      profession: 'Art Teacher' as const,
      rateMin: 30,
      rateMax: 38,
      yearsExperience: 6
    },
    {
      id: 'teacher-5' as const,
      name: 'Lisa Anderson' as const,
      role: 'Marketing Manager' as const,
      avatar: 'https://i.pravatar.cc/150?img=5' as const,
      rating: 4.85,
      subjects: ['Business', 'Economics'],
      languages: ['English'],
      bio: 'Business and economics expert with real-world experience' as const,
      profession: 'Business Teacher' as const,
      rateMin: 38,
      rateMax: 45,
      yearsExperience: 9
    },
    {
      id: 'teacher-6' as const,
      name: 'James Wilson' as const,
      role: 'Product Manager' as const,
      avatar: 'https://i.pravatar.cc/150?img=6' as const,
      rating: 4.92,
      subjects: ['History', 'Geography'],
      languages: ['English', 'Italian'],
      bio: 'Bringing history and geography to life' as const,
      profession: 'History Teacher' as const,
      rateMin: 32,
      rateMax: 40,
      yearsExperience: 11
    }
  ],
  topStudents: [
    {
      id: 'student-1' as const,
      name: 'David Kim' as const,
      avatar: 'https://i.pravatar.cc/150?img=11' as const,
      performance: 95,
      learningSubjects: ['Mathematics', 'Physics'],
      country: 'South Korea' as const,
      sessionsCompleted: 48,
      currentStreak: 15
    },
    // ... existing code ...
    {
      id: 'student-2' as const,
      name: 'Sophie Chen' as const,
      avatar: 'https://i.pravatar.cc/150?img=12' as const,
      performance: 92,
      learningSubjects: ['English', 'Literature'],
      country: 'China' as const,
      sessionsCompleted: 42,
      currentStreak: 12
    },
    {
      id: 'student-3' as const,
      name: 'Alex Johnson' as const,
      avatar: 'https://i.pravatar.cc/150?img=13' as const,
      performance: 89,
      learningSubjects: ['Chemistry', 'Biology'],
      country: 'United States' as const,
      sessionsCompleted: 38,
      currentStreak: 10
    },
    {
      id: 'student-4' as const,
      name: 'Maria Garcia' as const,
      avatar: 'https://i.pravatar.cc/150?img=14' as const,
      performance: 94,
      learningSubjects: ['Spanish', 'History'],
      country: 'Spain' as const,
      sessionsCompleted: 45,
      currentStreak: 18
    },
    {
      id: 'student-5' as const,
      name: 'Yuki Tanaka' as const,
      avatar: 'https://i.pravatar.cc/150?img=15' as const,
      performance: 87,
      learningSubjects: ['Mathematics', 'Computer Science'],
      country: 'Japan' as const,
      sessionsCompleted: 35,
      currentStreak: 8
    },
    {
      id: 'student-6' as const,
      name: 'Omar Hassan' as const,
      avatar: 'https://i.pravatar.cc/150?img=16' as const,
      performance: 91,
      learningSubjects: ['Economics', 'Business'],
      country: 'Egypt' as const,
      sessionsCompleted: 40,
      currentStreak: 14
    }
  ],
  upcomingClasses: [
    {
      id: 'class-1' as const,
      title: 'Spanish Conversation' as const,
      teacher: 'Maria Garcia' as const,
      teacherInitials: 'MG' as const,
      time: '10:00 AM - 11:00 AM' as const,
      day: 'Tomorrow' as const,
      status: SessionStatus.CONFIRMED
    },
    {
      id: 'class-2' as const,
      title: 'Advanced Mathematics' as const,
      teacher: 'John Peterson' as const,
      teacherInitials: 'JP' as const,
      time: '2:00 PM - 3:00 PM' as const,
      day: 'Friday' as const,
      status: SessionStatus.CONFIRMED
    }
  ],
  teacherSchedule: [
    {
      id: 'schedule-1' as const,
      title: 'Spanish Conversation - Beginner' as const,
      time: '10:00 AM - 11:00 AM' as const,
      student: 'Sarah Johnson' as const,
      studentInitials: 'SJ' as const,
      status: SessionStatus.CONFIRMED
    },
    {
      id: 'schedule-2' as const,
      title: 'Advanced Grammar' as const,
      time: '2:00 PM - 3:00 PM' as const,
      student: 'Michael Brown' as const,
      studentInitials: 'MB' as const,
      status: SessionStatus.PENDING
    }
  ]
};

// Data passed as props to the root component
export const mockRootProps = {
  userRole: UserRole.STUDENT,
  totalHours: 6,
  totalMinutes: 30,
  totalClassesWatched: 3.5,
  totalLessonsSubmitted: 20,
  teacherStats: {
    totalStudents: 48,
    thisWeek: 16,
    completed: 124,
    rating: 4.9
  },
  studentProgress: {
    avgProgress: 85,
    completedTasks: 72,
    pendingTasks: 28
  }
};