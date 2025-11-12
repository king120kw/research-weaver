import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Clock, CirclePlay, TrendingUp, Users, BookOpen, Video, FileText, Lightbulb, Calendar as CalendarIcon, Home, Search, Calendar, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { StatCard } from '@/components/StatCard';
import { Carousel3D } from '@/components/Carousel3D';
import { TeacherProfileModal } from '@/components/ProfileModals';
import { mockQuery, mockStore } from '@/data/mockData';
import type { Teacher } from '@/types/schema';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = mockStore;
  const { topTeachers, upcomingClasses } = mockQuery;

  const handleTeacherClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const carouselItems = topTeachers.map(t => ({
    id: t.id,
    name: t.name,
    role: t.role,
    avatar: t.avatar
  }));

  return (
    <div className="min-h-screen gradient-lavender pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-800">
                Welcome back, {currentUser.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-base text-gray-600">Let's continue your learning journey</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-700" />
              </button>
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard 
              icon={TrendingUp}
              label="Performance"
              value={`${currentUser.performance}%`}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <StatCard 
              icon={CirclePlay}
              label="Sessions"
              value={currentUser.sessionsCompleted}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <StatCard 
              icon={Users}
              label="Interviews"
              value={currentUser.interviewsCompleted}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
            <StatCard 
              icon={Clock}
              label="Hours"
              value={`${currentUser.totalHours}h`}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Progress Card */}
        <section className="mb-8">
          <Card className="gradient-yellow-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-4 border-white">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-base">{currentUser.name}</p>
                    <p className="text-sm text-gray-700">Learning Spanish & Mathematics</p>
                  </div>
                </div>
                <TrendingUp className="w-6 h-6 text-gray-700" />
              </div>
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">Course Progress</span>
                  <span className="text-sm font-bold text-gray-800">{currentUser.performance}%</span>
                </div>
                <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                    style={{ width: `${currentUser.performance}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3">My Teacher: Maria Garcia</p>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: Clock, label: 'Manage Time', color: 'bg-blue-100 text-blue-600' },
              { icon: CalendarIcon, label: 'Book a Class', color: 'bg-yellow-100 text-yellow-600' },
              { icon: FileText, label: 'Revision Notes', color: 'bg-green-100 text-green-600' },
              { icon: BookOpen, label: 'Flashcards', color: 'bg-pink-100 text-pink-600' },
              { icon: Video, label: 'Video Meeting', color: 'bg-purple-100 text-purple-600' },
              { icon: Lightbulb, label: 'AI Study Buddy', color: 'bg-orange-100 text-orange-600' },
            ].map((action, idx) => (
              <button
                key={idx}
                className="group rounded-2xl border-2 border-white bg-white p-6 text-center transition-all hover:border-purple-300 hover:shadow-lg"
              >
                <div className="mb-3 flex justify-center">
                  <div className={`rounded-full ${action.color} p-4 transition-transform group-hover:scale-110`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                </div>
                <p className="font-medium text-sm text-gray-700">{action.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Upcoming Classes */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Classes</h2>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <Card key={classItem.id} className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                        {classItem.teacherInitials}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{classItem.title}</h3>
                        <p className="text-sm text-gray-600">{classItem.teacher}</p>
                        <p className="text-xs text-gray-500">{classItem.time}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                        {classItem.day}
                      </Badge>
                      <Button size="sm" className="bg-black hover:bg-gray-900 text-white rounded-full">
                        Join
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Teachers Carousel */}
        <section className="mb-8">
          <Carousel3D
            items={carouselItems}
            title="TOP TEACHERS"
            subtitle="Discover our expert educators"
            onItemClick={(item) => {
              const teacher = topTeachers.find(t => t.id === item.id);
              if (teacher) handleTeacherClick(teacher);
            }}
          />
        </section>
      </main>

      <BottomNav />
      <TeacherProfileModal 
        teacher={selectedTeacher}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default StudentDashboard;
