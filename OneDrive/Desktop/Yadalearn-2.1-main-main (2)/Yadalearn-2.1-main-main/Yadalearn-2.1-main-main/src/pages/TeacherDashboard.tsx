import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Users, Calendar, Upload, Video, Clock, BookOpen, Settings, Star, DollarSign, Play } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { StatCard } from '@/components/StatCard';
import { Carousel3D } from '@/components/Carousel3D';
import { StudentProfileModal } from '@/components/ProfileModals';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { mockQuery, mockRootProps } from '@/data/mockData';
import { SessionStatus } from '@/types/enums';
import type { Student } from '@/types/schema';
import { useAuth } from '@/contexts/AuthContext';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoaded, userRole } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { topStudents, teacherSchedule } = mockQuery;
  const { teacherStats, studentProgress } = mockRootProps;

  // ALL hooks must be called before any conditional logic
  useEffect(() => {
    if (isLoaded) {
      // Check both userRole from context and localStorage as fallback
      const savedRole = localStorage.getItem('yadalearn-user-role');
      const savedUser = localStorage.getItem('yadalearn-user');
      const isTeacher = userRole === 'teacher' || savedRole === 'teacher';
      const hasUser = user || savedUser;
      
      if (!hasUser || !isTeacher) {
        navigate('/role-selection');
      }
    }
  }, [user, isLoaded, userRole, navigate]);

  // Listen for custom events from BottomNav - must be called unconditionally
  useEffect(() => {
    const handleOpenStudentsModal = () => setActiveModal('students');
    const handleOpenClassModal = () => setActiveModal('class');
    const handleOpenEarningsModal = () => setActiveModal('earnings');

    window.addEventListener('openStudentsModal', handleOpenStudentsModal);
    window.addEventListener('openClassModal', handleOpenClassModal);
    window.addEventListener('openEarningsModal', handleOpenEarningsModal);

    return () => {
      window.removeEventListener('openStudentsModal', handleOpenStudentsModal);
      window.removeEventListener('openClassModal', handleOpenClassModal);
      window.removeEventListener('openEarningsModal', handleOpenEarningsModal);
    };
  }, []);

  // Compute derived values after all hooks are called
  // Check both userRole from context and localStorage as fallback
  const savedRole = localStorage.getItem('yadalearn-user-role');
  const savedUser = localStorage.getItem('yadalearn-user');
  const isTeacher = userRole === 'teacher' || savedRole === 'teacher';
  const hasUser = user || savedUser;
  const currentUser = user || (savedUser ? JSON.parse(savedUser) : null);
  const isReady = isLoaded && hasUser && isTeacher;
  const shouldRedirectToLogin = isLoaded && !hasUser;
  const shouldRedirectToRoleSelection = isLoaded && hasUser && !isTeacher;

  // Handle redirects after hooks but before render
  if (shouldRedirectToLogin) {
    navigate('/login');
    return null;
  }

  if (shouldRedirectToRoleSelection) {
    navigate('/role-selection');
    return null;
  }

  // Show loading state after hooks are called
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const carouselItems = topStudents.map(s => ({
    id: s.id,
    name: s.name,
    role: `${s.performance}% Performance`,
    avatar: s.avatar
  }));

  const progressData = [
    { name: 'Completed', value: studentProgress.completedTasks, color: '#C9B4E8' },
    { name: 'Pending', value: studentProgress.pendingTasks, color: '#E5E7EB' }
  ];

  // All hooks are now called at the top of the component
  // No more conditional hook calls

  // 4) Main render (hooks remain in same order every render)
  return (
    <div className="min-h-screen gradient-lavender pb-24">
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Welcome Back Card - Responsive Design */}
        <section className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                  {/* Profile Picture - Responsive sizing */}
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white shadow-lg">
                    <AvatarImage src={currentUser?.imageUrl || "/teacher-avatar.jpg"} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-500 text-white text-xl sm:text-2xl">
                      {currentUser?.firstName?.[0] || currentUser?.name?.[0] || 'T'}{currentUser?.lastName?.[0] || ''}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-fluid-md">
                    <h1 className="text-fluid-2xl sm:text-fluid-3xl font-bold text-gray-800 mb-2">
                      Welcome back, {currentUser?.firstName || currentUser?.name || 'Teacher'}! 👋
                    </h1>
                    <p className="text-fluid-base sm:text-fluid-lg text-gray-600 mb-3">
                      Mathematics Teacher
                    </p>

                    {/* Rating and Stats - Responsive layout */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="font-bold text-gray-800 text-sm sm:text-base">4.9</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        <span className="font-bold text-gray-800 text-sm sm:text-base">$2,450</span>
                        <span className="text-xs sm:text-sm text-gray-600">This Month</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="font-bold text-gray-800 text-sm sm:text-base">35</span>
                        <span className="text-xs sm:text-sm text-gray-600">sessions completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Pictures - Top Right - Responsive */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white shadow-md">
                    <AvatarImage src={currentUser?.imageUrl || "/teacher-avatar.jpg"} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-500 text-white text-sm sm:text-base">
                      {currentUser?.firstName?.[0] || currentUser?.name?.[0] || 'T'}{currentUser?.lastName?.[0] || ''}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions Section - Responsive Grid */}
        <section className="mb-8">
          <h2 className="mb-6 text-fluid-xl sm:text-fluid-2xl font-bold text-gray-800">Quick Actions</h2>
          <div className="grid-fluid-2">
            {/* My Students */}
            <Card
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group card-fluid"
              onClick={() => setActiveModal('students')}
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div className="rounded-full bg-blue-100 p-3 sm:p-4 transition-transform group-hover:scale-110">
                    <Users className="icon-fluid-md text-blue-600" />
                  </div>
                </div>
                <h3 className="font-bold text-fluid-base sm:text-fluid-lg text-gray-800 mb-2">My Students</h3>
                <p className="text-fluid-sm text-gray-600 mb-0">View and manage your students</p>
              </CardContent>
            </Card>

            {/* Start Class */}
            <Card
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group card-fluid"
              onClick={() => setActiveModal('class')}
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div className="rounded-full bg-green-100 p-3 sm:p-4 transition-transform group-hover:scale-110">
                    <Video className="icon-fluid-md text-green-600" />
                  </div>
                </div>
                <h3 className="font-bold text-fluid-base sm:text-fluid-lg text-gray-800 mb-2">Start Class</h3>
                <p className="text-fluid-sm text-gray-600 mb-0">Generate class link & QR code</p>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group card-fluid"
              onClick={() => setActiveModal('schedule')}
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div className="rounded-full bg-purple-100 p-3 sm:p-4 transition-transform group-hover:scale-110">
                    <Calendar className="icon-fluid-md text-purple-600" />
                  </div>
                </div>
                <h3 className="font-bold text-fluid-base sm:text-fluid-lg text-gray-800 mb-2">Schedule</h3>
                <p className="text-fluid-sm text-gray-600 mb-0">Manage your availability</p>
              </CardContent>
            </Card>

            {/* Earnings */}
            <Card
              className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group card-fluid"
              onClick={() => setActiveModal('earnings')}
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div className="rounded-full bg-orange-100 p-3 sm:p-4 transition-transform group-hover:scale-110">
                    <DollarSign className="icon-fluid-md text-orange-600" />
                  </div>
                </div>
                <h3 className="font-bold text-fluid-base sm:text-fluid-lg text-gray-800 mb-2">Earnings</h3>
                <p className="text-fluid-sm text-gray-600 mb-0">View financial summary</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Today's Schedule */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Today's Schedule</h2>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {teacherSchedule.map((session) => (
              <Card key={session.id} className="bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold">
                        {session.studentInitials}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{session.title}</h3>
                        <p className="text-sm text-gray-600">{session.student}</p>
                        <p className="text-xs text-gray-500">{session.time}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={
                        session.status === SessionStatus.CONFIRMED
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }>
                        {session.status === SessionStatus.CONFIRMED ? 'Confirmed' : 'Pending Approval'}
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

        {/* Data and Progress Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Progress Pie Chart */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Student Progress</h3>
                <div className="relative">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={progressData}
                        cx={100}
                        cy={100}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {progressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{studentProgress.avgProgress}%</p>
                      <p className="text-xs text-gray-600">Avg. Progress</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Students / Completed Sessions */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">This Week</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Active Students</p>
                    <p className="text-3xl font-bold text-gray-800">{teacherStats.totalStudents}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sessions Completed</p>
                    <p className="text-3xl font-bold text-gray-800">{teacherStats.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Rating */}
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Average Rating</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{teacherStats.rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-600">Based on student feedback</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Top Students Carousel */}
        <section className="mb-8">
          <Carousel3D
            items={carouselItems}
            title="TOP STUDENTS"
            subtitle="Meet our exceptional learners"
            onItemClick={(item) => {
              const student = topStudents.find(s => s.id === item.id);
              if (student) handleStudentClick(student);
            }}
          />
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav />
      <StudentProfileModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* My Students Modal - Enhanced with Assignment Management */}
      {activeModal === 'students' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <span className="text-fluid-lg">My Students</span>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[calc(90vh-80px)] overflow-y-auto">
              <div className="p-6 space-y-4">
                {topStudents.slice(0, 8).map((student) => (
                  <div key={student.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    {/* Student Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-gray-800 text-fluid-base">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.country} • {student.learningSubjects?.[0] || 'Mathematics'}</p>
                          <p className="text-xs text-gray-500">{student.sessionsCompleted} sessions completed</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-black hover:bg-gray-900 text-white rounded-full"
                        onClick={() => {
                          handleStudentClick(student);
                          setActiveModal(null);
                        }}
                      >
                        View Profile
                      </Button>
                    </div>

                    {/* Assignments Section */}
                    <div className="bg-white rounded-md p-3 mb-3">
                      <h4 className="font-semibold text-sm text-gray-800 mb-2">Current Assignments</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Mathematics Homework #5</span>
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs">Due Tomorrow</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Algebra Practice Set</span>
                          <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Geometry Quiz Review</span>
                          <Badge className="bg-red-100 text-red-700 text-xs">Overdue</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Upload Materials Section */}
                    <div className="bg-white rounded-md p-3">
                      <h4 className="font-semibold text-sm text-gray-800 mb-2">Study Materials</h4>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.pdf,.doc,.docx,.ppt,.pptx';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                alert(`📁 "${file.name}" uploaded successfully for ${student.name}!`);
                              }
                            };
                            input.click();
                          }}
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Upload Material
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => {
                            alert(`📚 Recent uploads for ${student.name}:\n• Algebra Formulas.pdf\n• Geometry Cheat Sheet.docx\n• Practice Problems Set 3.pdf`);
                          }}
                        >
                          View Materials
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Start Class Modal */}
      {activeModal === 'class' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Start Class</span>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Choose Your Option</h3>
                <p className="text-sm text-gray-600">Generate class link or QR code for students to join</p>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
                  onClick={() => {
                    alert('🎥 Class Link Generated!\n\nLink: https://yadalearn.com/class/abc123\n\nStudents can join using this link.');
                    setActiveModal(null);
                  }}
                >
                  <Video className="w-5 h-5 mr-2" />
                  Generate Class Link
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:border-gray-400 py-3 rounded-lg"
                  onClick={() => {
                    alert('📱 QR Code Generated!\n\nQR Code displayed for students to scan and join the class.');
                    setActiveModal(null);
                  }}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Generate QR Code
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Students will join via WebRTC-based video hosting (like Google Meet)
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Schedule Modal */}
      {activeModal === 'schedule' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Schedule Management</span>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Set Availability</h3>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <button
                        key={day}
                        className="p-2 text-sm bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Time Slots</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['9:00 AM', '2:00 PM', '7:00 PM'].map((time) => (
                      <button
                        key={time}
                        className="p-3 text-sm bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-black hover:bg-gray-900 text-white"
                    onClick={() => {
                      alert('✅ Availability updated successfully!');
                      setActiveModal(null);
                    }}
                  >
                    Save Schedule
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setActiveModal(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Earnings Modal */}
      {activeModal === 'earnings' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Earnings Summary</span>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-green-600">$2,450</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-blue-600">$15,750</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Recent Transactions</h3>
                  <div className="space-y-3">
                    {[
                      { student: 'John Smith', amount: '$50', status: 'Completed', date: 'Today' },
                      { student: 'Sarah Johnson', amount: '$75', status: 'Completed', date: 'Yesterday' },
                      { student: 'Mike Davis', amount: '$60', status: 'Pending', date: '2 days ago' },
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{transaction.student}</p>
                          <p className="text-sm text-gray-600">{transaction.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{transaction.amount}</p>
                          <Badge className={
                            transaction.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      alert('💳 Payout requested successfully!');
                      setActiveModal(null);
                    }}
                  >
                    Request Payout
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setActiveModal(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
