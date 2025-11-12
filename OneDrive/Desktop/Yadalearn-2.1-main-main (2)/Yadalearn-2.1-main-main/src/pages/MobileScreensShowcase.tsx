import { ChevronDown } from 'lucide-react';
import { MobileScreenFrame } from '@/components/MobileScreenFrame';
import { CourseCard } from '@/components/CourseCard';
import { WeeklyBarChart } from '@/components/WeeklyBarChart';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockQuery, mockRootProps } from '@/data/mockData';

const MobileScreensShowcase = () => {
  const { courses, weeklySchedule } = mockQuery;
  const { totalHours, totalMinutes, totalClassesWatched, totalLessonsSubmitted } = mockRootProps;

  return (
    <div className="min-h-screen gradient-lavender py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          YadaLearn Mobile Experience
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {/* Screen 1: Welcome/Onboarding */}
          <MobileScreenFrame>
            <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 mb-8 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center">
                  <span className="text-6xl">👍</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Learn More &<br />Improve Your<br />Skills
              </h2>
              <button className="mt-6 bg-black text-white px-12 py-4 rounded-full font-semibold hover:bg-gray-900 transition-colors">
                Get Started
              </button>
            </div>
          </MobileScreenFrame>

          {/* Screen 2: Learning Progress */}
          <MobileScreenFrame>
            <div className="h-full bg-white overflow-y-auto">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                      <AvatarFallback>AW</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs text-gray-600">Welcome Back</p>
                      <p className="text-sm font-bold">Adam William</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    ☰
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Learning<br />Progress</h1>
                
                {/* Filter */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-full">
                    <span className="text-sm">😊</span>
                    <span className="text-sm font-medium">Popular Lessons</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    🔍
                  </button>
                </div>
              </div>

              {/* Course Cards */}
              <div className="p-4 space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="scale-90 origin-top">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            </div>
          </MobileScreenFrame>

          {/* Screen 3: Lesson Schedule */}
          <MobileScreenFrame>
            <div className="h-full bg-white overflow-y-auto">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                      <AvatarFallback>AW</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs text-gray-600">Welcome Back</p>
                      <p className="text-sm font-bold">Adam William</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    ☰
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Lesson<br />Schedule</h1>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <div className="scale-90 origin-top">
                  <WeeklyBarChart 
                    data={weeklySchedule}
                    totalHours={totalHours}
                    totalMinutes={totalMinutes}
                  />
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="gradient-pink-card rounded-2xl p-4">
                    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center mb-3">
                      <span className="text-xl">⏰</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{totalClassesWatched} Hour</p>
                    <p className="text-sm text-gray-600 mt-1">Total Classed Watched</p>
                  </div>
                  <div className="gradient-blue-card rounded-2xl p-4">
                    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center mb-3">
                      <span className="text-xl">📚</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{totalLessonsSubmitted} Lessons</p>
                    <p className="text-sm text-gray-600 mt-1">Total Submission This Course</p>
                  </div>
                </div>
              </div>
            </div>
          </MobileScreenFrame>
        </div>
      </div>
    </div>
  );
};

export default MobileScreensShowcase;