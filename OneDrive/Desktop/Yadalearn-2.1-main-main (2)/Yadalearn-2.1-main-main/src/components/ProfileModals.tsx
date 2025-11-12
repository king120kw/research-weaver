import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Teacher, Student } from '@/types/schema';
import { formatPriceRange, formatRating, formatPercentage } from '@/utils/formatters';

interface TeacherProfileModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherProfileModal = ({ teacher, isOpen, onClose }: TeacherProfileModalProps) => {
  if (!teacher) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle className="text-center">Teacher Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-3">
              <AvatarImage src={teacher.avatar} alt={teacher.name} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-bold text-gray-800">{teacher.name}</h3>
            <p className="text-gray-600">{teacher.profession}</p>
          </div>

          {/* Rate & Rating */}
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Rate</p>
              <p className="text-lg font-bold text-gray-800">
                {formatPriceRange(teacher.rateMin, teacher.rateMax)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Rating</p>
              <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
                ⭐ {formatRating(teacher.rating)}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Bio</p>
            <p className="text-sm text-gray-600">{teacher.bio}</p>
          </div>

          {/* Languages */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {teacher.languages.map((lang) => (
                <Badge key={lang} variant="secondary">{lang}</Badge>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Subjects</p>
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map((subject) => (
                <Badge key={subject} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Years of Experience</p>
            <p className="text-sm text-gray-600">{teacher.yearsExperience} years</p>
          </div>

          {/* CTA Button */}
          <Button className="w-full bg-black hover:bg-gray-900 text-white rounded-full py-6">
            Book a Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileModal = ({ student, isOpen, onClose }: StudentProfileModalProps) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle className="text-center">Student Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-3">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-400 to-teal-400 text-white">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-bold text-gray-800">{student.name}</h3>
            <p className="text-gray-600">{student.country}</p>
          </div>

          {/* Performance */}
          <div className="text-center gradient-green-card rounded-2xl p-4">
            <p className="text-sm text-gray-700 mb-1">Performance</p>
            <p className="text-4xl font-bold text-gray-800">{formatPercentage(student.performance)}</p>
          </div>

          {/* Learning Subjects */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Learning Subjects</p>
            <div className="flex flex-wrap gap-2">
              {student.learningSubjects.map((subject) => (
                <Badge key={subject} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="gradient-pink-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{student.sessionsCompleted}</p>
              <p className="text-sm text-gray-600">Sessions Completed</p>
            </div>
            <div className="gradient-yellow-card rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{student.currentStreak}</p>
              <p className="text-sm text-gray-600">Current Streak</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};