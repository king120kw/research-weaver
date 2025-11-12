import { CirclePlay } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Course } from '@/types/schema';
import { formatLessonCount } from '@/utils/formatters';

interface CourseCardProps {
  course: Course;
  onStartLearning?: () => void;
}

export const CourseCard = ({ course, onStartLearning }: CourseCardProps) => {
  return (
    <div 
      className="rounded-3xl p-5 shadow-lg overflow-hidden"
      style={{ backgroundColor: course.backgroundColor }}
    >
      {/* Top Section - Enrollment & Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {course.enrolledStudents.slice(0, 3).map((student, idx) => (
              <Avatar key={idx} className="w-8 h-8 border-2 border-white">
                <AvatarImage src={student} alt="Student" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-sm font-medium text-white bg-black/20 px-2 py-1 rounded-full">
            {course.enrollmentCount}
          </span>
        </div>
        <Badge className="bg-white/90 text-gray-800 hover:bg-white">
          {course.badge}
        </Badge>
      </div>

      {/* Middle Section - Course Image & Info */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <p className="text-sm text-white/80 mb-1">By: {course.instructor}</p>
          <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
          <p className="text-sm text-white/90">{formatLessonCount(course.lessonCount)}</p>
        </div>
        <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg">
          <img 
            src={course.thumbnail} 
            alt={`${course.title} by ${course.instructor} on Unsplash`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Section - Instructor Avatar & Button */}
      <div className="flex items-center justify-between">
        <Avatar className="w-10 h-10 border-2 border-white">
          <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
          <AvatarFallback className="bg-white text-gray-800">
            {course.instructor.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <Button 
          onClick={onStartLearning}
          className="bg-black hover:bg-gray-900 text-white rounded-full px-6 py-2 flex items-center gap-2"
        >
          <CirclePlay className="w-4 h-4" />
          Start Learning
        </Button>
      </div>
    </div>
  );
};