import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Globe, BookOpen, GraduationCap, Target, Clock, Calendar, 
  CheckCircle2, Languages, BookMarked, TrendingUp, Users, 
  UserCircle, Star, Award, Zap, Video, DollarSign, 
  Sparkles, Rocket, Trophy, Heart
} from 'lucide-react';

const Onboarding = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [language, setLanguage] = useState<string>(() => localStorage.getItem('yadalearn-lang') || 'en');

  const navigate = useNavigate();
  const location = useLocation();
  const { setUserRole, user } = useAuth();
  const role = location.state?.role || 'student';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedRole = localStorage.getItem('yadalearn-user-role');
    if (savedRole === 'teacher') {
      setUserRole?.('teacher');
    }
    const lang = localStorage.getItem('yadalearn-lang');
    if (lang) setLanguage(lang);
  }, []);

  const onChangeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('yadalearn-lang', lang);
  };

  const handleAnswer = (question: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [question]: answer }));
  };

  // Calculate total steps based on path
  const getTotalSteps = () => {
    if (role === 'student') {
      if (!answers.studyPath) return 8; // Welcome + Step 1 + 7 steps
      return answers.studyPath === 'Languages' || answers.studyPath === 'IGCSE' ? 8 : 8;
    } else {
      if (currentStep === 1) return 10; // Welcome + Step 1 + up to 8 steps
      if (!answers.teachingFocus) return 10;
      return 10; // Welcome + Step 1 + 8 steps
    }
  };

  const getMaxStep = () => {
    if (role === 'student') {
      if (!answers.studyPath) return 7;
      return 7; // Both paths have 7 steps
    } else {
      if (!answers.teachingFocus) return 8;
      return 8; // Both paths have 8 steps
    }
  };

  const nextStep = () => {
    const maxStep = getMaxStep();
    if (currentStep < maxStep) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      if (!user) {
        const defaultUser = {
          email: 'onboarding@yadalearn.com',
          name: role === 'teacher' ? 'Teacher' : 'Student',
          firstName: role === 'teacher' ? 'Teacher' : 'Student',
          lastName: '',
          imageUrl: ''
        };
        localStorage.setItem('yadalearn-user', JSON.stringify(defaultUser));
      }
      
      localStorage.setItem('yadalearn-user-role', role);
      localStorage.setItem('yadalearn-lang', language);
      localStorage.setItem('yadalearn-onboarding-answers', JSON.stringify(answers));
      setUserRole?.(role);
      
      const dashboardPath = role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 100);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't interfere with inputs or textareas
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'BUTTON') {
        return;
      }
      
      const maxStep = getMaxStep();
      const isValid = isStepValid();
      
      if (e.key === 'ArrowLeft' && currentStep > 1) {
        e.preventDefault();
        setCurrentStep(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && isValid && currentStep < maxStep) {
        e.preventDefault();
        const max = getMaxStep();
        if (currentStep < max) {
          setCurrentStep(prev => prev + 1);
        } else {
          nextStep();
        }
      } else if (e.key === 'Enter' && isValid) {
        e.preventDefault();
        nextStep();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, answers]);

  // STUDENT ONBOARDING
  const renderStudentStep = () => {
    // Step 1: Study Path
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 mb-4">
              <Rocket className="h-10 w-10 text-purple-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              What would you like to study?
            </h2>
            <p className="text-gray-600">Choose your learning path</p>
          </div>
          <RadioGroup
            value={answers.studyPath || ""}
            onValueChange={(value) => handleAnswer('studyPath', value)}
            className="space-y-4"
          >
            <div 
              className={`relative flex items-center space-x-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                answers.studyPath === 'Languages' 
                  ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105' 
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
              }`}
              onClick={() => handleAnswer('studyPath', 'Languages')}
            >
              <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                answers.studyPath === 'Languages' ? 'bg-purple-500' : 'bg-purple-100'
              }`}>
                <Globe className={`h-8 w-8 ${answers.studyPath === 'Languages' ? 'text-white' : 'text-purple-600'}`} />
              </div>
              <div className="flex-1">
                <RadioGroupItem value="Languages" id="path-languages" className="absolute opacity-0" />
                <Label htmlFor="path-languages" className="text-xl font-bold text-gray-800 cursor-pointer block">
                  Languages
                </Label>
                <p className="text-sm text-gray-600 mt-1">Learn new languages and communicate globally</p>
              </div>
              {answers.studyPath === 'Languages' && (
                <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />
              )}
            </div>
            <div 
              className={`relative flex items-center space-x-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                answers.studyPath === 'IGCSE' 
                  ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-teal-50 shadow-lg scale-105' 
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
              onClick={() => handleAnswer('studyPath', 'IGCSE')}
            >
              <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                answers.studyPath === 'IGCSE' ? 'bg-blue-500' : 'bg-blue-100'
              }`}>
                <BookOpen className={`h-8 w-8 ${answers.studyPath === 'IGCSE' ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <div className="flex-1">
                <RadioGroupItem value="IGCSE" id="path-igcse" className="absolute opacity-0" />
                <Label htmlFor="path-igcse" className="text-xl font-bold text-gray-800 cursor-pointer block">
                  IGCSE Subjects
                </Label>
                <p className="text-sm text-gray-600 mt-1">Excel in IGCSE exams and academic subjects</p>
              </div>
              {answers.studyPath === 'IGCSE' && (
                <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0" />
              )}
            </div>
          </RadioGroup>
        </div>
      );
    }

    // Languages Path
    if (answers.studyPath === 'Languages') {
      if (currentStep === 2) {
        const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi'];
        const colors = [
          'from-purple-100 to-pink-100 border-purple-300',
          'from-blue-100 to-teal-100 border-blue-300',
          'from-yellow-100 to-orange-100 border-yellow-300',
          'from-green-100 to-emerald-100 border-green-300',
          'from-indigo-100 to-purple-100 border-indigo-300',
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 mb-3">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Which language are you interested in learning?
              </h2>
              <p className="text-sm text-gray-600">You can choose one or more</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {languages.map((lang, index) => {
                const isSelected = answers.selectedLanguages?.includes(lang) || false;
                const colorClass = colors[index % colors.length];
                return (
                  <div
                    key={lang}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${colorClass} shadow-lg scale-105` 
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => {
                      const current = answers.selectedLanguages || [];
                      if (isSelected) {
                        handleAnswer('selectedLanguages', current.filter((l: string) => l !== lang));
                      } else {
                        handleAnswer('selectedLanguages', [...current, lang]);
                      }
                    }}
                  >
                    <Checkbox
                      id={`lang-${lang}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        const current = answers.selectedLanguages || [];
                        if (checked) {
                          handleAnswer('selectedLanguages', [...current, lang]);
                        } else {
                          handleAnswer('selectedLanguages', current.filter((l: string) => l !== lang));
                        }
                      }}
                      className="absolute top-2 right-2"
                    />
                    <Label htmlFor={`lang-${lang}`} className="text-gray-800 font-semibold cursor-pointer block text-center">
                      {lang}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      if (currentStep === 3) {
        const levels = [
          { value: 'Beginner', label: "Beginner", sublabel: "I'm just starting out", icon: Sparkles, color: 'from-yellow-100 to-orange-100 border-yellow-300', iconBg: 'bg-yellow-500' },
          { value: 'Intermediate', label: "Intermediate", sublabel: "I can hold simple conversations", icon: TrendingUp, color: 'from-blue-100 to-teal-100 border-blue-300', iconBg: 'bg-blue-500' },
          { value: 'Advanced', label: "Advanced", sublabel: "I want to refine fluency and accuracy", icon: Trophy, color: 'from-purple-100 to-pink-100 border-purple-300', iconBg: 'bg-purple-500' }
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-teal-200 mb-3">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                How would you describe your current skill level?
              </h2>
            </div>
            <RadioGroup
              value={answers.currentLevel || ""}
              onValueChange={(value) => handleAnswer('currentLevel', value)}
              className="space-y-4"
            >
              {levels.map((option) => {
                const Icon = option.icon;
                const isSelected = answers.currentLevel === option.value;
                return (
                  <div
                    key={option.value}
                    className={`relative flex items-center space-x-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${option.color} shadow-lg scale-105` 
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => handleAnswer('currentLevel', option.value)}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${option.iconBg}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <RadioGroupItem value={option.value} id={`level-${option.value}`} className="absolute opacity-0" />
                      <Label htmlFor={`level-${option.value}`} className="cursor-pointer block">
                        <span className="text-lg font-bold text-gray-800 block">{option.label}</span>
                        <span className="text-sm text-gray-600">{option.sublabel}</span>
                      </Label>
                    </div>
                    {isSelected && <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 4) {
        const goals = [
          { text: "Communicate confidently in everyday situations", icon: Users, color: 'from-purple-100 to-pink-100' },
          { text: "Prepare for an exam or certification", icon: Award, color: 'from-blue-100 to-teal-100' },
          { text: "Learn for career or business purposes", icon: TrendingUp, color: 'from-yellow-100 to-orange-100' },
          { text: "Study abroad preparation", icon: Globe, color: 'from-green-100 to-emerald-100' },
          { text: "Personal or cultural interest", icon: Heart, color: 'from-pink-100 to-rose-100' }
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 mb-3">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                What's your main goal for learning this language?
              </h2>
            </div>
            <RadioGroup
              value={answers.learningObjective || ""}
              onValueChange={(value) => handleAnswer('learningObjective', value)}
              className="space-y-3"
            >
              {goals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = answers.learningObjective === goal.text;
                return (
                  <div
                    key={goal.text}
                    className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${goal.color} border-purple-400 shadow-lg` 
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => handleAnswer('learningObjective', goal.text)}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${goal.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <RadioGroupItem value={goal.text} id={`goal-${goal.text.slice(0, 10)}`} className="absolute opacity-0" />
                      <Label htmlFor={`goal-${goal.text.slice(0, 10)}`} className="text-gray-700 cursor-pointer font-medium">
                        {goal.text}
                      </Label>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 5) {
        const preferences = [
          { text: "One-on-one private lessons", icon: UserCircle, color: 'from-purple-100 to-pink-100', iconBg: 'bg-purple-500' },
          { text: "Group sessions", icon: Users, color: 'from-blue-100 to-teal-100', iconBg: 'bg-blue-500' },
          { text: "Self-paced learning", icon: BookOpen, color: 'from-yellow-100 to-orange-100', iconBg: 'bg-yellow-500' }
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 mb-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                How do you prefer to study?
              </h2>
            </div>
            <RadioGroup
              value={answers.classPreference || ""}
              onValueChange={(value) => handleAnswer('classPreference', value)}
              className="space-y-3"
            >
              {preferences.map((pref) => {
                const Icon = pref.icon;
                const isSelected = answers.classPreference === pref.text;
                return (
                  <div
                    key={pref.text}
                    className={`relative flex items-center space-x-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${pref.color} border-purple-400 shadow-lg scale-105` 
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => handleAnswer('classPreference', pref.text)}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${pref.iconBg}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <RadioGroupItem value={pref.text} id={`pref-${pref.text.slice(0, 10)}`} className="absolute opacity-0" />
                      <Label htmlFor={`pref-${pref.text.slice(0, 10)}`} className="text-gray-700 cursor-pointer font-semibold text-lg">
                        {pref.text}
                      </Label>
                    </div>
                    {isSelected && <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 6) {
        const timeOptions = [
          { text: 'Weekdays', icon: Calendar, color: 'from-blue-100 to-teal-100', iconBg: 'bg-blue-500' },
          { text: 'Weekends', icon: Clock, color: 'from-purple-100 to-pink-100', iconBg: 'bg-purple-500' },
          { text: 'Flexible', icon: Zap, color: 'from-yellow-100 to-orange-100', iconBg: 'bg-yellow-500' }
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-teal-200 mb-3">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                When do you prefer to take your lessons?
              </h2>
            </div>
            <RadioGroup
              value={answers.timeAvailability || ""}
              onValueChange={(value) => handleAnswer('timeAvailability', value)}
              className="space-y-3"
            >
              {timeOptions.map((time) => {
                const Icon = time.icon;
                const isSelected = answers.timeAvailability === time.text;
                return (
                  <div
                    key={time.text}
                    className={`relative flex items-center space-x-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${time.color} border-purple-400 shadow-lg scale-105` 
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => handleAnswer('timeAvailability', time.text)}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${time.iconBg}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <RadioGroupItem value={time.text} id={`time-${time.text}`} className="absolute opacity-0" />
                      <Label htmlFor={`time-${time.text}`} className="text-gray-700 cursor-pointer font-semibold text-lg">
                        {time.text}
                      </Label>
                    </div>
                    {isSelected && <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 7) {
        const selectedLang = answers.selectedLanguages?.[0] || 'your chosen language';
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 mb-6 animate-pulse">
              <Rocket className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              🎉 All set!
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2 font-medium">
                Great! We're curating teachers who specialize in <span className="text-purple-600 font-bold">{selectedLang}</span> and share your learning goals.
              </p>
              <p className="text-base sm:text-lg text-gray-600">
                You'll be matched with your best-fit options shortly.
              </p>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-8">
              Your dashboard is ready— start exploring, connect, and make learning happen.
            </p>
            <Button 
              onClick={nextStep} 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full shadow-lg text-lg font-semibold"
            >
              Go to Dashboard →
            </Button>
          </div>
        );
      }
    }

    // IGCSE Path
    if (answers.studyPath === 'IGCSE') {
      if (currentStep === 2) {
        const subjects = [
          { name: 'Mathematics', icon: TrendingUp, color: 'from-blue-100 to-teal-100', iconBg: 'bg-blue-500' },
          { name: 'Physics', icon: Zap, color: 'from-purple-100 to-pink-100', iconBg: 'bg-purple-500' },
          { name: 'Chemistry', icon: Sparkles, color: 'from-yellow-100 to-orange-100', iconBg: 'bg-yellow-500' },
          { name: 'Biology', icon: Heart, color: 'from-green-100 to-emerald-100', iconBg: 'bg-green-500' },
          { name: 'English Language', icon: Languages, color: 'from-indigo-100 to-purple-100', iconBg: 'bg-indigo-500' },
          { name: 'English Literature', icon: BookOpen, color: 'from-pink-100 to-rose-100', iconBg: 'bg-pink-500' },
          { name: 'History', icon: BookMarked, color: 'from-amber-100 to-orange-100', iconBg: 'bg-amber-500' },
          { name: 'Geography', icon: Globe, color: 'from-teal-100 to-cyan-100', iconBg: 'bg-teal-500' },
          { name: 'Economics', icon: DollarSign, color: 'from-emerald-100 to-green-100', iconBg: 'bg-emerald-500' },
          { name: 'Business Studies', icon: TrendingUp, color: 'from-blue-100 to-indigo-100', iconBg: 'bg-blue-600' },
          { name: 'Computer Science', icon: Zap, color: 'from-violet-100 to-purple-100', iconBg: 'bg-violet-500' }
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-teal-200 mb-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Which IGCSE subject do you want to focus on first?
              </h2>
              <p className="text-sm text-gray-600">You can add more subjects later</p>
            </div>
            <RadioGroup
              value={answers.subjectChoice || ""}
              onValueChange={(value) => handleAnswer('subjectChoice', value)}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {subjects.map((subject) => {
                const Icon = subject.icon;
                const isSelected = answers.subjectChoice === subject.name;
                return (
                  <div
                    key={subject.name}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${subject.color} border-purple-400 shadow-lg scale-105` 
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                    onClick={() => handleAnswer('subjectChoice', subject.name)}
                  >
                    <RadioGroupItem value={subject.name} id={`subject-${subject.name}`} className="absolute opacity-0" />
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${subject.iconBg}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <Label htmlFor={`subject-${subject.name}`} className="text-gray-800 cursor-pointer font-semibold text-sm">
                        {subject.name}
                      </Label>
                    </div>
                    {isSelected && <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-purple-600" />}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 3) {
        const grades = [
          { text: 'Year 9', icon: GraduationCap, color: 'from-purple-100 to-pink-100', iconBg: 'bg-purple-500' },
          { text: 'Year 10', icon: TrendingUp, color: 'from-blue-100 to-teal-100', iconBg: 'bg-blue-500' },
          { text: 'Year 11', icon: Trophy, color: 'from-yellow-100 to-orange-100', iconBg: 'bg-yellow-500' }
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 mb-3">
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                What grade level are you currently in?
              </h2>
            </div>
            <RadioGroup
              value={answers.gradeLevel || ""}
              onValueChange={(value) => handleAnswer('gradeLevel', value)}
              className="space-y-3"
            >
              {grades.map((grade) => {
                const Icon = grade.icon;
                const isSelected = answers.gradeLevel === grade.text;
                return (
                  <div
                    key={grade.text}
                    className={`relative flex items-center space-x-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${grade.color} border-purple-400 shadow-lg scale-105` 
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => handleAnswer('gradeLevel', grade.text)}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${grade.iconBg}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <RadioGroupItem value={grade.text} id={`grade-${grade.text}`} className="absolute opacity-0" />
                      <Label htmlFor={`grade-${grade.text}`} className="text-gray-700 cursor-pointer font-semibold text-lg">
                        {grade.text}
                      </Label>
                    </div>
                    {isSelected && <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 4) {
        const goals = [
          { text: "Prepare for upcoming exams", icon: Target, color: 'from-red-100 to-pink-100', iconBg: 'bg-red-500' },
          { text: "Strengthen weak topics", icon: TrendingUp, color: 'from-blue-100 to-teal-100', iconBg: 'bg-blue-500' },
          { text: "Practice with past papers", icon: BookOpen, color: 'from-purple-100 to-pink-100', iconBg: 'bg-purple-500' },
          { text: "General improvement and understanding", icon: Sparkles, color: 'from-yellow-100 to-orange-100', iconBg: 'bg-yellow-500' }
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-teal-200 mb-3">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                What's your main study goal?
              </h2>
            </div>
            <RadioGroup
              value={answers.studyGoal || ""}
              onValueChange={(value) => handleAnswer('studyGoal', value)}
              className="space-y-3"
            >
              {goals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = answers.studyGoal === goal.text;
                return (
                  <div
                    key={goal.text}
                    className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${goal.color} border-purple-400 shadow-lg` 
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                    onClick={() => handleAnswer('studyGoal', goal.text)}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${goal.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <RadioGroupItem value={goal.text} id={`goal-${goal.text.slice(0, 10)}`} className="absolute opacity-0" />
                      <Label htmlFor={`goal-${goal.text.slice(0, 10)}`} className="text-gray-700 cursor-pointer font-medium">
                        {goal.text}
                      </Label>
                    </div>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 5) {
        const preferences = [
          { text: "Private one-on-one sessions", icon: UserCircle, color: 'from-purple-100 to-pink-100', iconBg: 'bg-purple-500' },
          { text: "Group lessons", icon: Users, color: 'from-blue-100 to-teal-100', iconBg: 'bg-blue-500' },
          { text: "Self-paced recorded modules", icon: Video, color: 'from-yellow-100 to-orange-100', iconBg: 'bg-yellow-500' }
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 mb-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                How do you prefer to study?
              </h2>
            </div>
            <RadioGroup
              value={answers.studyPreference || ""}
              onValueChange={(value) => handleAnswer('studyPreference', value)}
              className="space-y-3"
            >
              {preferences.map((pref) => {
                const Icon = pref.icon;
                const isSelected = answers.studyPreference === pref.text;
                return (
                  <div
                    key={pref.text}
                    className={`relative flex items-center space-x-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${pref.color} border-purple-400 shadow-lg scale-105` 
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => handleAnswer('studyPreference', pref.text)}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${pref.iconBg}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <RadioGroupItem value={pref.text} id={`pref-${pref.text.slice(0, 10)}`} className="absolute opacity-0" />
                      <Label htmlFor={`pref-${pref.text.slice(0, 10)}`} className="text-gray-700 cursor-pointer font-semibold text-lg">
                        {pref.text}
                      </Label>
                    </div>
                    {isSelected && <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 6) {
        const schedules = [
          { text: 'Daily', icon: Zap, color: 'from-purple-100 to-pink-100', iconBg: 'bg-purple-500' },
          { text: '3 times per week', icon: Calendar, color: 'from-blue-100 to-teal-100', iconBg: 'bg-blue-500' },
          { text: 'Once a week', icon: Clock, color: 'from-yellow-100 to-orange-100', iconBg: 'bg-yellow-500' },
          { text: 'Flexible', icon: Sparkles, color: 'from-green-100 to-emerald-100', iconBg: 'bg-green-500' }
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-teal-200 mb-3">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                How often do you plan to study?
              </h2>
            </div>
            <RadioGroup
              value={answers.studySchedule || ""}
              onValueChange={(value) => handleAnswer('studySchedule', value)}
              className="space-y-3"
            >
              {schedules.map((schedule) => {
                const Icon = schedule.icon;
                const isSelected = answers.studySchedule === schedule.text;
                return (
                  <div
                    key={schedule.text}
                    className={`relative flex items-center space-x-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${schedule.color} border-purple-400 shadow-lg scale-105` 
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => handleAnswer('studySchedule', schedule.text)}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${schedule.iconBg}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <RadioGroupItem value={schedule.text} id={`schedule-${schedule.text}`} className="absolute opacity-0" />
                      <Label htmlFor={`schedule-${schedule.text}`} className="text-gray-700 cursor-pointer font-semibold text-lg">
                        {schedule.text}
                      </Label>
                    </div>
                    {isSelected && <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />}
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 7) {
        const selectedSubject = answers.subjectChoice || 'your chosen subject';
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 via-teal-200 to-purple-200 mb-6 animate-pulse">
              <Trophy className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              🎉 All set!
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
              <p className="text-base sm:text-lg text-gray-700 mb-2 font-medium">
                Perfect! We're preparing your personalized IGCSE study plan.
              </p>
              <p className="text-base sm:text-lg text-gray-600">
                You'll be matched with the best tutors in <span className="text-blue-600 font-bold">{selectedSubject}</span>.
              </p>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-8">
              Your dashboard is ready— start exploring, connect, and make learning happen.
            </p>
            <Button 
              onClick={nextStep} 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 rounded-full shadow-lg text-lg font-semibold"
            >
              Go to Dashboard →
            </Button>
          </div>
        );
      }
    }

    return null;
  };

  // TEACHER ONBOARDING
  const renderTeacherStep = () => {
    // Welcome Screen
    if (currentStep === 1) {
      return (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 mb-6">
            <GraduationCap className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome to YadaLearn
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Where skilled educators meet motivated learners
          </p>
          <p className="text-base text-gray-500 mb-8">
            Let's personalize your teaching profile so you can start connecting with the right students.
          </p>
          <Button 
            onClick={nextStep} 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full shadow-lg text-lg font-semibold"
          >
            Get Started →
          </Button>
        </div>
      );
    }

    // Step 1: Teaching Focus
    if (currentStep === 2) {
      const focuses = [
        { name: 'Languages', icon: Globe, color: 'from-purple-50 to-pink-50', border: 'border-purple-400', iconBg: 'bg-purple-500', selectedBg: 'from-purple-100 to-pink-100' },
        { name: 'IGCSE Subjects', icon: BookOpen, color: 'from-blue-50 to-teal-50', border: 'border-blue-400', iconBg: 'bg-blue-500', selectedBg: 'from-blue-100 to-teal-100' }
      ];
      
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 mb-3">
              <GraduationCap className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              What do you teach?
            </h2>
            <p className="text-sm text-gray-600">You can select both</p>
          </div>
          <div className="space-y-4">
            {focuses.map((focus) => {
              const Icon = focus.icon;
              const isSelected = answers.teachingFocus?.includes(focus.name) || false;
              return (
                <div
                  key={focus.name}
                  className={`relative flex items-center space-x-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? `bg-gradient-to-br ${focus.selectedBg} ${focus.border} shadow-lg scale-105` 
                      : `bg-gradient-to-br ${focus.color} border-gray-200 hover:${focus.border} hover:shadow-md`
                  }`}
                  onClick={() => {
                    const current = answers.teachingFocus || [];
                    if (isSelected) {
                      handleAnswer('teachingFocus', current.filter((f: string) => f !== focus.name));
                    } else {
                      handleAnswer('teachingFocus', [...current, focus.name]);
                    }
                  }}
                >
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${focus.iconBg}`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <Checkbox
                      id={`focus-${focus.name}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        const current = answers.teachingFocus || [];
                        if (checked) {
                          handleAnswer('teachingFocus', [...current, focus.name]);
                        } else {
                          handleAnswer('teachingFocus', current.filter((f: string) => f !== focus.name));
                        }
                      }}
                      className="absolute opacity-0"
                    />
                    <Label htmlFor={`focus-${focus.name}`} className="text-xl font-bold text-gray-800 cursor-pointer block">
                      {focus.name}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {focus.name === 'Languages' ? 'Teach languages and help students communicate globally' : 'Excel in IGCSE subjects and guide students to success'}
                    </p>
                  </div>
                  {isSelected && <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Languages Path for Teachers
    if (answers.teachingFocus?.includes('Languages')) {
      if (currentStep === 3) {
        const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi'];
        const colors = [
          'from-purple-100 to-pink-100 border-purple-300',
          'from-blue-100 to-teal-100 border-blue-300',
          'from-yellow-100 to-orange-100 border-yellow-300',
          'from-green-100 to-emerald-100 border-green-300',
          'from-indigo-100 to-purple-100 border-indigo-300',
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 mb-3">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Which languages do you teach?
              </h2>
              <p className="text-sm text-gray-600">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {languages.map((lang, index) => {
                const isSelected = answers.languageSpecialization?.includes(lang) || false;
                const colorClass = colors[index % colors.length];
                return (
                  <div
                    key={lang}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${colorClass} shadow-lg scale-105` 
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => {
                      const current = answers.languageSpecialization || [];
                      if (isSelected) {
                        handleAnswer('languageSpecialization', current.filter((l: string) => l !== lang));
                      } else {
                        handleAnswer('languageSpecialization', [...current, lang]);
                      }
                    }}
                  >
                    <Checkbox
                      id={`teach-lang-${lang}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        const current = answers.languageSpecialization || [];
                        if (checked) {
                          handleAnswer('languageSpecialization', [...current, lang]);
                        } else {
                          handleAnswer('languageSpecialization', current.filter((l: string) => l !== lang));
                        }
                      }}
                      className="absolute top-2 right-2"
                    />
                    <Label htmlFor={`teach-lang-${lang}`} className="text-gray-800 font-semibold cursor-pointer block text-center">
                      {lang}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      if (currentStep === 4) {
        const levels = [
          { name: 'Beginner', icon: Sparkles, color: 'from-yellow-100 to-orange-100', iconBg: 'bg-yellow-500' },
          { name: 'Intermediate', icon: TrendingUp, color: 'from-blue-100 to-teal-100', iconBg: 'bg-blue-500' },
          { name: 'Advanced', icon: Trophy, color: 'from-purple-100 to-pink-100', iconBg: 'bg-purple-500' }
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-teal-200 mb-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                What levels do you teach?
              </h2>
              <p className="text-sm text-gray-600">You can choose multiple</p>
            </div>
            <div className="space-y-3">
              {levels.map((level) => {
                const Icon = level.icon;
                const isSelected = answers.teachingLevel?.includes(level.name) || false;
                return (
                  <div
                    key={level.name}
                    className={`relative flex items-center space-x-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? `bg-gradient-to-br ${level.color} border-purple-400 shadow-lg scale-105` 
                        : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                    }`}
                    onClick={() => {
                      const current = answers.teachingLevel || [];
                      if (isSelected) {
                        handleAnswer('teachingLevel', current.filter((l: string) => l !== level.name));
                      } else {
                        handleAnswer('teachingLevel', [...current, level.name]);
                      }
                    }}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${level.iconBg}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <Checkbox
                        id={`level-${level.name}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const current = answers.teachingLevel || [];
                          if (checked) {
                            handleAnswer('teachingLevel', [...current, level.name]);
                          } else {
                            handleAnswer('teachingLevel', current.filter((l: string) => l !== level.name));
                          }
                        }}
                        className="absolute opacity-0"
                      />
                      <Label htmlFor={`level-${level.name}`} className="text-gray-700 cursor-pointer font-semibold text-lg">
                        {level.name}
                      </Label>
                    </div>
                    {isSelected && <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      if (currentStep === 5) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              How would you describe your teaching style?
            </h2>
            <RadioGroup
              value={answers.teachingApproach || ""}
              onValueChange={(value) => handleAnswer('teachingApproach', value)}
              className="space-y-4"
            >
              {[
                "Structured – syllabus-driven lessons",
                "Conversational – real-world communication focus",
                "Flexible – tailored to each student's needs"
              ].map((style) => (
                <div key={style} className="flex items-center space-x-3">
                  <RadioGroupItem value={style} id={`style-${style.slice(0, 10)}`} />
                  <Label htmlFor={`style-${style.slice(0, 10)}`} className="text-gray-700 cursor-pointer">
                    {style}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 6) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              What kind of lessons will you provide?
            </h2>
            <RadioGroup
              value={answers.lessonFormat || ""}
              onValueChange={(value) => handleAnswer('lessonFormat', value)}
              className="space-y-4"
            >
              {[
                "Live one-on-one sessions",
                "Group classes",
                "Recorded video lessons"
              ].map((format) => (
                <div key={format} className="flex items-center space-x-3">
                  <RadioGroupItem value={format} id={`format-${format.slice(0, 10)}`} />
                  <Label htmlFor={`format-${format.slice(0, 10)}`} className="text-gray-700 cursor-pointer">
                    {format}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 7) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              When are you usually available to teach?
            </h2>
            <RadioGroup
              value={answers.availability || ""}
              onValueChange={(value) => handleAnswer('availability', value)}
              className="space-y-4"
            >
              {['Weekdays', 'Weekends', 'Both'].map((avail) => (
                <div key={avail} className="flex items-center space-x-3">
                  <RadioGroupItem value={avail} id={`avail-${avail}`} />
                  <Label htmlFor={`avail-${avail}`} className="text-gray-700 cursor-pointer">
                    {avail}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 8) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              What's your preferred hourly rate range?
            </h2>
            <p className="text-sm text-gray-600 mb-4">(Example: $10–$25 per hour)</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Minimum Rate ($)</Label>
                <Input
                  type="number"
                  placeholder="10"
                  value={answers.minRate || ""}
                  onChange={(e) => handleAnswer('minRate', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm">Maximum Rate ($)</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={answers.maxRate || ""}
                  onChange={(e) => handleAnswer('maxRate', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      }
      if (currentStep === 9) {
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🎉 All set!
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              Excellent! Your teaching preferences have been saved.
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              Next, we'll help you complete your profile and upload your credentials to make you discoverable to students.
            </p>
            <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-8">
              Your dashboard is ready— start exploring, connect, and make learning happen.
            </p>
            <Button onClick={nextStep} size="lg" className="bg-black hover:bg-gray-900 text-white px-8 py-3">
              Go to Dashboard
            </Button>
          </div>
        );
      }
    }

    // IGCSE Path for Teachers (show only if Languages not selected, or after Languages path completed)
    // For simplicity: if both selected, do Languages first. If only IGCSE, do IGCSE.
    // Note: If both are selected, user completes Languages path first, then can complete IGCSE separately
    const showIGCSEPath = answers.teachingFocus?.includes('IGCSE Subjects') && 
        (!answers.teachingFocus?.includes('Languages') || !answers.languageSpecialization || currentStep > 9);
    
    if (showIGCSEPath) {
      if (currentStep === 3) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Which IGCSE subjects do you teach?
            </h2>
            <p className="text-sm text-gray-600 mb-4">(Select all that apply.)</p>
            <div className="space-y-4">
              {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Language', 'English Literature', 'History', 'Geography', 'Economics', 'Business Studies', 'Computer Science'].map((subject) => (
                <div key={subject} className="flex items-center space-x-3">
                  <Checkbox
                    id={`teach-subject-${subject}`}
                    checked={answers.subjectSpecialization?.includes(subject) || false}
                    onCheckedChange={(checked) => {
                      const current = answers.subjectSpecialization || [];
                      if (checked) {
                        handleAnswer('subjectSpecialization', [...current, subject]);
                      } else {
                        handleAnswer('subjectSpecialization', current.filter((s: string) => s !== subject));
                      }
                    }}
                  />
                  <Label htmlFor={`teach-subject-${subject}`} className="text-gray-700 cursor-pointer">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      }
      if (currentStep === 4) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              What levels do you teach?
            </h2>
            <RadioGroup
              value={answers.gradeLevelFocus || ""}
              onValueChange={(value) => handleAnswer('gradeLevelFocus', value)}
              className="space-y-4"
            >
              {['Year 9', 'Year 10', 'Year 11'].map((grade) => (
                <div key={grade} className="flex items-center space-x-3">
                  <RadioGroupItem value={grade} id={`grade-${grade}`} />
                  <Label htmlFor={`grade-${grade}`} className="text-gray-700 cursor-pointer">
                    {grade}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 5) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              How do you usually approach your lessons?
            </h2>
            <RadioGroup
              value={answers.teachingStyle || ""}
              onValueChange={(value) => handleAnswer('teachingStyle', value)}
              className="space-y-4"
            >
              {[
                "Curriculum-based",
                "Conceptual & practice-focused",
                "Exam-oriented"
              ].map((style) => (
                <div key={style} className="flex items-center space-x-3">
                  <RadioGroupItem value={style} id={`style-${style.slice(0, 10)}`} />
                  <Label htmlFor={`style-${style.slice(0, 10)}`} className="text-gray-700 cursor-pointer">
                    {style}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 6) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              What format of classes will you offer?
            </h2>
            <RadioGroup
              value={answers.classType || ""}
              onValueChange={(value) => handleAnswer('classType', value)}
              className="space-y-4"
            >
              {[
                "One-on-one",
                "Group",
                "Recorded modules"
              ].map((type) => (
                <div key={type} className="flex items-center space-x-3">
                  <RadioGroupItem value={type} id={`type-${type}`} />
                  <Label htmlFor={`type-${type}`} className="text-gray-700 cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 7) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              When are you generally available to teach?
            </h2>
            <RadioGroup
              value={answers.schedule || ""}
              onValueChange={(value) => handleAnswer('schedule', value)}
              className="space-y-4"
            >
              {['Weekdays', 'Weekends', 'Flexible'].map((sched) => (
                <div key={sched} className="flex items-center space-x-3">
                  <RadioGroupItem value={sched} id={`sched-${sched}`} />
                  <Label htmlFor={`sched-${sched}`} className="text-gray-700 cursor-pointer">
                    {sched}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }
      if (currentStep === 8) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              What's your preferred hourly rate?
            </h2>
            <p className="text-sm text-gray-600 mb-4">(Example: $8–$20 per hour)</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Minimum Rate ($)</Label>
                <Input
                  type="number"
                  placeholder="8"
                  value={answers.minRate || ""}
                  onChange={(e) => handleAnswer('minRate', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm">Maximum Rate ($)</Label>
                <Input
                  type="number"
                  placeholder="20"
                  value={answers.maxRate || ""}
                  onChange={(e) => handleAnswer('maxRate', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      }
      if (currentStep === 9) {
        return (
          <div className="text-center py-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Perfect! Your teaching preferences are set.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              Next, you'll complete your profile and make your teaching experience visible to students.
            </p>
            <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-8">
              Your dashboard is ready— start exploring, connect, and make learning happen.
            </p>
            <Button onClick={nextStep} size="lg" className="bg-black hover:bg-gray-900 text-white px-8 py-3">
              Go to Dashboard
            </Button>
          </div>
        );
      }
    }

    return null;
  };

  const getTotalStepsForProgress = () => {
    if (role === 'student') {
      return 7;
    } else {
      return 9; // Welcome + 8 steps
    }
  };

  const isStepValid = () => {
    if (role === 'student') {
      if (currentStep === 1) return !!answers.studyPath;
      if (answers.studyPath === 'Languages') {
        if (currentStep === 2) return answers.selectedLanguages?.length > 0;
        if (currentStep === 3) return !!answers.currentLevel;
        if (currentStep === 4) return !!answers.learningObjective;
        if (currentStep === 5) return !!answers.classPreference;
        if (currentStep === 6) return !!answers.timeAvailability;
      } else if (answers.studyPath === 'IGCSE') {
        if (currentStep === 2) return !!answers.subjectChoice;
        if (currentStep === 3) return !!answers.gradeLevel;
        if (currentStep === 4) return !!answers.studyGoal;
        if (currentStep === 5) return !!answers.studyPreference;
        if (currentStep === 6) return !!answers.studySchedule;
      }
    } else {
      if (currentStep === 1) return true; // Welcome screen - always valid
      if (currentStep === 2) return answers.teachingFocus?.length > 0;
      // Additional validation for teacher steps based on path
      if (answers.teachingFocus?.includes('Languages')) {
        if (currentStep === 3) return answers.languageSpecialization?.length > 0;
        if (currentStep === 4) return answers.teachingLevel?.length > 0;
        if (currentStep === 5) return !!answers.teachingApproach;
        if (currentStep === 6) return !!answers.lessonFormat;
        if (currentStep === 7) return !!answers.availability;
        if (currentStep === 8) return !!(answers.minRate && answers.maxRate);
      } else if (answers.teachingFocus?.includes('IGCSE Subjects') && 
                 (!answers.teachingFocus?.includes('Languages') || !answers.languageSpecialization)) {
        if (currentStep === 3) return answers.subjectSpecialization?.length > 0;
        if (currentStep === 4) return !!answers.gradeLevelFocus;
        if (currentStep === 5) return !!answers.teachingStyle;
        if (currentStep === 6) return !!answers.classType;
        if (currentStep === 7) return !!answers.schedule;
        if (currentStep === 8) return !!(answers.minRate && answers.maxRate);
      }
    }
    return true;
  };

  const maxStep = getTotalStepsForProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Language selector + Progress Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Languages className="h-4 w-4 text-purple-500" />
              <Label className="text-sm font-medium text-gray-700">Language</Label>
              <select
                value={language}
                onChange={(e) => onChangeLanguage(e.target.value)}
                className="border border-purple-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
                <option value="my">Burmese</option>
                <option value="sw">Swahili</option>
                <option value="ar">Arabic</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
              <span className="hidden sm:inline">{role === 'student' ? 'Student' : 'Teacher'}</span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                Step {currentStep} of {maxStep}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={(currentStep / maxStep) * 100} className="h-3 bg-purple-100" />
          </div>

          {/* Step Content */}
          {role === 'student' ? renderStudentStep() : renderTeacherStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 gap-4">
            {/* Previous Button - Show on all steps except first */}
            {currentStep > 1 ? (
              <Button 
                variant="outline" 
                onClick={prevStep} 
                className="min-w-[120px] border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50 rounded-full"
                type="button"
              >
                ← Previous
              </Button>
            ) : (
              <div className="text-xs text-gray-400 hidden sm:block">
                Use ← → arrow keys to navigate
              </div>
            )}
            
            {/* Next/Complete Button - Show on all steps */}
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-semibold rounded-full"
              disabled={!isStepValid()}
              type="button"
            >
              {currentStep === maxStep ? 'Complete →' : (currentStep === 1 && role === 'teacher' ? 'Get Started →' : 'Next →')}
            </Button>
          </div>
          
          {/* Keyboard hint for mobile */}
          <div className="text-xs text-gray-400 text-center mt-2 sm:hidden">
            Tap buttons to navigate
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;