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

const enTranslations: Record<string, string> = {
  studentOnboarding: 'Student Onboarding',
  teacherOnboarding: 'Teacher Onboarding',
  startSetup: "Start Setup",
  startSetupComplete: "Go to Dashboard",
  stepOf: "Step {current} of {total}",
};

const translations: Record<string, Record<string, string>> = {
  en: enTranslations,
  id: { ...enTranslations },
  my: { ...enTranslations },
  sw: { ...enTranslations },
  ar: { ...enTranslations },
  zh: { ...enTranslations }
};

const Onboarding = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [language, setLanguage] = useState<string>(() => localStorage.getItem('yadalearn-lang') || 'en');

  // Track the study path selected for students (Languages vs IGCSE)
  const [studentPath, setStudentPath] = useState<'languages' | 'igcse' | null>(null);
  // Track the teaching focus for teachers (Languages vs IGCSE)
  const [teacherFocus, setTeacherFocus] = useState<string[]>([]);

  // Teacher profile
  const [teacherProfile, setTeacherProfile] = useState({
    name: '',
    subject: '',
    avatarUrl: '',
    rating: 4.8,
    earnings: 0,
    sessions: 0
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { setUserRole } = useAuth();
  
  const role = location.state?.role || localStorage.getItem('yadalearn-current-role') || 'student';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (role) {
      localStorage.setItem('yadalearn-current-role', role);
    }
  }, [role]);

  const t = (key: string, vars?: Record<string, any>) => {
    const txt = (translations[language] && translations[language][key]) || translations.en[key] || key;
    if (!vars) return txt;
    return Object.keys(vars).reduce((s, k) => s.replace(`{${k}}`, String(vars[k])), txt);
  };

  const handleAnswer = (question: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [question]: answer }));
  };

  // Calculate total steps based on path
  const getTotalSteps = () => {
    if (role === 'student') {
      return studentPath ? 8 : 2; // Step 1 (welcome) + Step 2 (path selection) or 8 if path selected
    } else {
      // Teacher: 1 (welcome) + path selection + 7 more based on focus
      return 9;
    }
  };

  const nextStep = () => {
    const totalSteps = getTotalSteps();
    
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Onboarding complete - save everything
      const onboardingData = {
        role,
        studentPath: role === 'student' ? studentPath : undefined,
        teacherFocus: role === 'teacher' ? teacherFocus : undefined,
        answers,
        completedAt: new Date().toISOString()
      };

      if (role === 'teacher') {
        const profileToSave = {
          ...teacherProfile,
          teacherFocus,
          subjects: answers.subjects || []
        };
        localStorage.setItem('yadalearn-teacher-profile', JSON.stringify(profileToSave));
      }

      localStorage.setItem('yadalearn-onboarding-data', JSON.stringify(onboardingData));
      localStorage.setItem('yadalearn-user-role', role);
      localStorage.setItem('yadalearn-current-role', role);
      
      if (setUserRole) {
        setUserRole(role);
      }

      console.log('✅ Onboarding completed:', {
        role,
        studentPath: role === 'student' ? studentPath : undefined,
        teacherFocus: role === 'teacher' ? teacherFocus : undefined,
        answers,
        userRoleSet: localStorage.getItem('yadalearn-user-role')
      });

      const dashboardPath = role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
      navigate(dashboardPath, { replace: true });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onChangeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('yadalearn-lang', lang);
  };

  // STUDENT ONBOARDING - Branching logic
  const renderStudentStep = () => {
    // Step 1: Welcome
    if (currentStep === 1) {
      return (
        <div className="text-center py-8">
          <img
            src="/images/welcome.png"
            alt="Welcome"
            className="mx-auto mb-6 w-28 sm:w-36 md:w-48 lg:w-56 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Hi 👋 Welcome to YadaLearn!
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Let's get to know you so we can make every lesson a treasure for you.
          </p>
          <Button onClick={nextStep} size="lg" className="bg-black hover:bg-gray-900 text-white px-8 py-3">
            {t('startSetup')}
          </Button>
        </div>
      );
    }

    // Step 2: Study Path Selection (Languages vs IGCSE)
    if (currentStep === 2) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              What would you like to study?
            </h2>
            <p className="text-sm text-gray-600 mb-6">Choose one to get started</p>
            <div className="space-y-4">
              <Button
                onClick={() => {
                  setStudentPath('languages');
                  setAnswers({});
                  handleAnswer('studyPath', 'Languages');
                  nextStep();
                }}
                variant={studentPath === 'languages' ? 'default' : 'outline'}
                className="w-full h-auto py-4 flex items-center justify-start space-x-4"
              >
                <span className="text-2xl">🌐</span>
                <div className="text-left">
                  <div className="font-bold">Languages</div>
                  <div className="text-xs text-gray-500">Learn a new language</div>
                </div>
              </Button>

              <Button
                onClick={() => {
                  setStudentPath('igcse');
                  setAnswers({});
                  handleAnswer('studyPath', 'IGCSE');
                  nextStep();
                }}
                variant={studentPath === 'igcse' ? 'default' : 'outline'}
                className="w-full h-auto py-4 flex items-center justify-start space-x-4"
              >
                <span className="text-2xl">📘</span>
                <div className="text-left">
                  <div className="font-bold">IGCSE Subjects</div>
                  <div className="text-xs text-gray-500">Prepare for IGCSE exams</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // LANGUAGES PATH
    if (studentPath === 'languages') {
      // Step 3: Language Selection
      if (currentStep === 3) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Which language are you interested in learning?
            </h2>
            <p className="text-sm text-gray-600 mb-6">You can choose one or more.</p>
            <div className="space-y-4">
              {['Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Arabic'].map((lang, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <Checkbox
                    id={`lang-${idx}`}
                    checked={answers.languages?.includes(lang) || false}
                    onCheckedChange={(checked) => {
                      const current = answers.languages || [];
                      if (checked) {
                        handleAnswer('languages', [...current, lang]);
                      } else {
                        handleAnswer('languages', current.filter((l: string) => l !== lang));
                      }
                    }}
                  />
                  <Label htmlFor={`lang-${idx}`} className="text-gray-700 cursor-pointer">
                    {lang}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Step 4: Current Level
      if (currentStep === 4) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              How would you describe your current skill level?
            </h2>
            <RadioGroup
              value={answers.currentLevel || ""}
              onValueChange={(value) => handleAnswer('currentLevel', value)}
              className="space-y-4"
            >
              {[
                { value: 'Beginner', label: "Beginner – I'm just starting out" },
                { value: 'Intermediate', label: "Intermediate – I can hold simple conversations" },
                { value: 'Advanced', label: "Advanced – I want to refine fluency and accuracy" }
              ].map((option, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`level-${idx}`} />
                  <Label htmlFor={`level-${idx}`} className="text-gray-700 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 5: Learning Objective
      if (currentStep === 5) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              What's your main goal for learning this language?
            </h2>
            <RadioGroup
              value={answers.learningObjective || ""}
              onValueChange={(value) => handleAnswer('learningObjective', value)}
              className="space-y-4"
            >
              {[
                'Communicate confidently in everyday situations',
                'Prepare for an exam or certification',
                'Learn for career or business purposes',
                'Study abroad preparation',
                'Personal or cultural interest'
              ].map((goal, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={goal} id={`obj-${idx}`} />
                  <Label htmlFor={`obj-${idx}`} className="text-gray-700 cursor-pointer">
                    {goal}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 6: Class Preference
      if (currentStep === 6) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              How do you prefer to study?
            </h2>
            <RadioGroup
              value={answers.classPreference || ""}
              onValueChange={(value) => handleAnswer('classPreference', value)}
              className="space-y-4"
            >
              {[
                'One-on-one private lessons',
                'Group sessions',
                'Self-paced learning'
              ].map((pref, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={pref} id={`pref-${idx}`} />
                  <Label htmlFor={`pref-${idx}`} className="text-gray-700 cursor-pointer">
                    {pref}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 7: Time Availability
      if (currentStep === 7) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              When do you prefer to take your lessons?
            </h2>
            <RadioGroup
              value={answers.timeAvailability || ""}
              onValueChange={(value) => handleAnswer('timeAvailability', value)}
              className="space-y-4"
            >
              {['Weekdays', 'Weekends', 'Flexible'].map((time, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={time} id={`time-${idx}`} />
                  <Label htmlFor={`time-${idx}`} className="text-gray-700 cursor-pointer">
                    {time}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 8: Confirmation
      if (currentStep === 8) {
        const selectedLanguages = answers.languages?.join(', ') || 'Languages';
        return (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Great! We're curating teachers who specialize in {selectedLanguages}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              and share your learning goals. You'll be matched with your best-fit options shortly.
            </p>
            <Button onClick={nextStep} size="lg" className="bg-black hover:bg-gray-900 text-white px-8 py-3">
              {t('startSetupComplete')}
            </Button>
          </div>
        );
      }
    }

    // IGCSE PATH
    if (studentPath === 'igcse') {
      // Step 3: Subject Choice
      if (currentStep === 3) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Which IGCSE subject do you want to focus on first?
            </h2>
            <p className="text-sm text-gray-600 mb-6">You can add more subjects later.</p>
            <div className="space-y-4">
              {['Mathematics', 'English Language', 'Science (Combined)', 'History', 'Geography', 'Economics'].map((subject, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <Checkbox
                    id={`subject-${idx}`}
                    checked={answers.subjects?.includes(subject) || false}
                    onCheckedChange={(checked) => {
                      const current = answers.subjects || [];
                      if (checked) {
                        handleAnswer('subjects', [...current, subject]);
                      } else {
                        handleAnswer('subjects', current.filter((s: string) => s !== subject));
                      }
                    }}
                  />
                  <Label htmlFor={`subject-${idx}`} className="text-gray-700 cursor-pointer">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Step 4: Current Grade Level
      if (currentStep === 4) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              What grade level are you currently in?
            </h2>
            <RadioGroup
              value={answers.gradeLevel || ""}
              onValueChange={(value) => handleAnswer('gradeLevel', value)}
              className="space-y-4"
            >
              {['Year 9', 'Year 10', 'Year 11'].map((year, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={year} id={`year-${idx}`} />
                  <Label htmlFor={`year-${idx}`} className="text-gray-700 cursor-pointer">
                    {year}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 5: Learning Objective (IGCSE version)
      if (currentStep === 5) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              What's your main study goal?
            </h2>
            <RadioGroup
              value={answers.igcseObjective || ""}
              onValueChange={(value) => handleAnswer('igcseObjective', value)}
              className="space-y-4"
            >
              {[
                'Prepare for upcoming exams',
                'Strengthen weak topics',
                'Practice with past papers',
                'General improvement and understanding'
              ].map((goal, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={goal} id={`igcse-obj-${idx}`} />
                  <Label htmlFor={`igcse-obj-${idx}`} className="text-gray-700 cursor-pointer">
                    {goal}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 6: Study Preference (IGCSE version)
      if (currentStep === 6) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              How do you prefer to study?
            </h2>
            <RadioGroup
              value={answers.studyPreference || ""}
              onValueChange={(value) => handleAnswer('studyPreference', value)}
              className="space-y-4"
            >
              {[
                'Private one-on-one sessions',
                'Group lessons',
                'Self-paced recorded modules'
              ].map((pref, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={pref} id={`igcse-pref-${idx}`} />
                  <Label htmlFor={`igcse-pref-${idx}`} className="text-gray-700 cursor-pointer">
                    {pref}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 7: Schedule
      if (currentStep === 7) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              How often do you plan to study?
            </h2>
            <RadioGroup
              value={answers.schedule || ""}
              onValueChange={(value) => handleAnswer('schedule', value)}
              className="space-y-4"
            >
              {['Daily', '3 times per week', 'Once a week', 'Flexible'].map((sched, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={sched} id={`sched-${idx}`} />
                  <Label htmlFor={`sched-${idx}`} className="text-gray-700 cursor-pointer">
                    {sched}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 8: Confirmation (IGCSE)
      if (currentStep === 8) {
        const selectedSubjects = answers.subjects?.join(', ') || 'IGCSE Subjects';
        return (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Perfect! We're preparing your personalized IGCSE study plan.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              You'll be matched with the best tutors in your chosen subjects: {selectedSubjects}
            </p>
            <Button onClick={nextStep} size="lg" className="bg-black hover:bg-gray-900 text-white px-8 py-3">
              {t('startSetupComplete')}
            </Button>
          </div>
        );
      }
    }

    return null;
  };

  // TEACHER ONBOARDING
  const renderTeacherStep = () => {
    // Step 1: Welcome
    if (currentStep === 1) {
      return (
        <div className="text-center py-8">
          <img
            src="/images/welcome-teacher.png"
            alt="Welcome Teacher"
            className="mx-auto mb-6 w-28 sm:w-36 md:w-48 lg:w-56 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Welcome to YadaLearn, where skilled educators meet motivated learners.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Let's personalize your teaching profile so you can start connecting with the right students.
          </p>
          <Button onClick={nextStep} size="lg" className="bg-black hover:bg-gray-900 text-white px-8 py-3">
            {t('startSetup')}
          </Button>
        </div>
      );
    }

    // Step 2: Teaching Focus Selection (Languages vs IGCSE)
    if (currentStep === 2) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              What do you teach?
            </h2>
            <p className="text-sm text-gray-600 mb-6">You can select both.</p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="teach-languages"
                  checked={teacherFocus.includes('Languages')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTeacherFocus([...teacherFocus, 'Languages']);
                    } else {
                      setTeacherFocus(teacherFocus.filter(f => f !== 'Languages'));
                    }
                  }}
                />
                <Label htmlFor="teach-languages" className="text-gray-700 cursor-pointer flex items-center space-x-2">
                  <span className="text-2xl">🌐</span>
                  <span>Languages</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="teach-igcse"
                  checked={teacherFocus.includes('IGCSE')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTeacherFocus([...teacherFocus, 'IGCSE']);
                    } else {
                      setTeacherFocus(teacherFocus.filter(f => f !== 'IGCSE'));
                    }
                  }}
                />
                <Label htmlFor="teach-igcse" className="text-gray-700 cursor-pointer flex items-center space-x-2">
                  <span className="text-2xl">📘</span>
                  <span>IGCSE Subjects</span>
                </Label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If Languages selected
    if (teacherFocus.includes('Languages')) {
      // Step 3: Language Specialization
      if (currentStep === 3 && !teacherFocus.includes('IGCSE')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Which languages do you teach?
            </h2>
            <p className="text-sm text-gray-600 mb-6">Select all that apply.</p>
            <div className="space-y-4">
              {['Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Arabic'].map((lang, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <Checkbox
                    id={`teach-lang-${idx}`}
                    checked={answers.languages?.includes(lang) || false}
                    onCheckedChange={(checked) => {
                      const current = answers.languages || [];
                      if (checked) {
                        handleAnswer('languages', [...current, lang]);
                      } else {
                        handleAnswer('languages', current.filter((l: string) => l !== lang));
                      }
                    }}
                  />
                  <Label htmlFor={`teach-lang-${idx}`} className="text-gray-700 cursor-pointer">
                    {lang}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Step 4: Teaching Levels (Languages)
      if (currentStep === 4 && !teacherFocus.includes('IGCSE')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              What levels do you teach?
            </h2>
            <p className="text-sm text-gray-600 mb-6">You can choose multiple.</p>
            <div className="space-y-4">
              {['Beginner', 'Intermediate', 'Advanced'].map((level, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <Checkbox
                    id={`teach-level-${idx}`}
                    checked={answers.teachingLevels?.includes(level) || false}
                    onCheckedChange={(checked) => {
                      const current = answers.teachingLevels || [];
                      if (checked) {
                        handleAnswer('teachingLevels', [...current, level]);
                      } else {
                        handleAnswer('teachingLevels', current.filter((l: string) => l !== level));
                      }
                    }}
                  />
                  <Label htmlFor={`teach-level-${idx}`} className="text-gray-700 cursor-pointer">
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Step 5: Teaching Approach (Languages)
      if (currentStep === 5 && !teacherFocus.includes('IGCSE')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              How would you describe your teaching style?
            </h2>
            <RadioGroup
              value={answers.teachingApproach || ""}
              onValueChange={(value) => handleAnswer('teachingApproach', value)}
              className="space-y-4"
            >
              {[
                { value: 'Structured', label: 'Structured – syllabus-driven lessons' },
                { value: 'Conversational', label: 'Conversational – real-world communication focus' },
                { value: 'Flexible', label: 'Flexible – tailored to each student\'s needs' }
              ].map((option, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={`approach-${idx}`} />
                  <Label htmlFor={`approach-${idx}`} className="text-gray-700 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 6: Lesson Format (Languages)
      if (currentStep === 6 && !teacherFocus.includes('IGCSE')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              What kind of lessons will you provide?
            </h2>
            <RadioGroup
              value={answers.lessonFormat || ""}
              onValueChange={(value) => handleAnswer('lessonFormat', value)}
              className="space-y-4"
            >
              {[
                'Live one-on-one sessions',
                'Group classes',
                'Recorded video lessons'
              ].map((format, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={format} id={`format-${idx}`} />
                  <Label htmlFor={`format-${idx}`} className="text-gray-700 cursor-pointer">
                    {format}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 7: Availability (Languages)
      if (currentStep === 7 && !teacherFocus.includes('IGCSE')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              When are you usually available to teach?
            </h2>
            <RadioGroup
              value={answers.availability || ""}
              onValueChange={(value) => handleAnswer('availability', value)}
              className="space-y-4"
            >
              {['Weekdays', 'Weekends', 'Both'].map((time, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={time} id={`avail-${idx}`} />
                  <Label htmlFor={`avail-${idx}`} className="text-gray-700 cursor-pointer">
                    {time}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 8: Rate Preference (Languages)
      if (currentStep === 8 && !teacherFocus.includes('IGCSE')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              What's your preferred hourly rate range?
            </h2>
            <p className="text-sm text-gray-600 mb-6">Example: $10–$25 per hour</p>
            <Input
              placeholder="e.g., $10-$25"
              value={answers.rateRange || ""}
              onChange={(e) => handleAnswer('rateRange', e.target.value)}
            />
          </div>
        );
      }

      // Step 9: Confirmation (Languages)
      if (currentStep === 9 && !teacherFocus.includes('IGCSE')) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Excellent! Your teaching preferences have been saved.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Next, we'll help you complete your profile and make you discoverable to students.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Your name</Label>
                <Input
                  placeholder="Your name"
                  value={teacherProfile.name}
                  onChange={(e) => setTeacherProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-sm">Primary subject</Label>
                <Input
                  placeholder="e.g., English Instructor"
                  value={teacherProfile.subject}
                  onChange={(e) => setTeacherProfile(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-sm">Avatar image URL</Label>
                <Input
                  placeholder="Avatar image URL"
                  value={teacherProfile.avatarUrl}
                  onChange={(e) => setTeacherProfile(prev => ({ ...prev, avatarUrl: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-2">Use an absolute image URL — this will sync with your profile.</p>
              </div>
            </div>

            <div className="text-right">
              <Button onClick={nextStep} className="bg-black hover:bg-gray-900 text-white">
                {t('startSetupComplete')}
              </Button>
            </div>
          </div>
        );
      }
    }

    // If IGCSE selected
    if (teacherFocus.includes('IGCSE')) {
      // Step 3 or adjusted: Subject Specialization
      if (currentStep === 3 && !teacherFocus.includes('Languages')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Which IGCSE subjects do you teach?
            </h2>
            <p className="text-sm text-gray-600 mb-6">Select all that apply.</p>
            <div className="space-y-4">
              {['Mathematics', 'English Language', 'Science (Combined)', 'History', 'Geography', 'Economics'].map((subject, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <Checkbox
                    id={`igcse-subject-${idx}`}
                    checked={answers.igcseSubjects?.includes(subject) || false}
                    onCheckedChange={(checked) => {
                      const current = answers.igcseSubjects || [];
                      if (checked) {
                        handleAnswer('igcseSubjects', [...current, subject]);
                      } else {
                        handleAnswer('igcseSubjects', current.filter((s: string) => s !== subject));
                      }
                    }}
                  />
                  <Label htmlFor={`igcse-subject-${idx}`} className="text-gray-700 cursor-pointer">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Step 4 or adjusted: Grade Level Focus
      if (currentStep === 4 && !teacherFocus.includes('Languages')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              What levels do you teach?
            </h2>
            <p className="text-sm text-gray-600 mb-6">You can choose multiple.</p>
            <div className="space-y-4">
              {['Year 9', 'Year 10', 'Year 11'].map((year, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <Checkbox
                    id={`igcse-year-${idx}`}
                    checked={answers.gradeLevel?.includes(year) || false}
                    onCheckedChange={(checked) => {
                      const current = answers.gradeLevel || [];
                      if (checked) {
                        handleAnswer('gradeLevel', [...current, year]);
                      } else {
                        handleAnswer('gradeLevel', current.filter((g: string) => g !== year));
                      }
                    }}
                  />
                  <Label htmlFor={`igcse-year-${idx}`} className="text-gray-700 cursor-pointer">
                    {year}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      }

      // Step 5 or adjusted: Teaching Style
      if (currentStep === 5 && !teacherFocus.includes('Languages')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              How do you usually approach your lessons?
            </h2>
            <RadioGroup
              value={answers.teachingStyle || ""}
              onValueChange={(value) => handleAnswer('teachingStyle', value)}
              className="space-y-4"
            >
              {[
                'Curriculum-based',
                'Conceptual & practice-focused',
                'Exam-oriented'
              ].map((style, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={style} id={`igcse-style-${idx}`} />
                  <Label htmlFor={`igcse-style-${idx}`} className="text-gray-700 cursor-pointer">
                    {style}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 6 or adjusted: Class Type
      if (currentStep === 6 && !teacherFocus.includes('Languages')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              What format of classes will you offer?
            </h2>
            <RadioGroup
              value={answers.classFormat || ""}
              onValueChange={(value) => handleAnswer('classFormat', value)}
              className="space-y-4"
            >
              {['One-on-one', 'Group', 'Recorded modules'].map((format, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={format} id={`class-format-${idx}`} />
                  <Label htmlFor={`class-format-${idx}`} className="text-gray-700 cursor-pointer">
                    {format}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 7 or adjusted: Schedule
      if (currentStep === 7 && !teacherFocus.includes('Languages')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              When are you generally available to teach?
            </h2>
            <RadioGroup
              value={answers.schedule || ""}
              onValueChange={(value) => handleAnswer('schedule', value)}
              className="space-y-4"
            >
              {['Weekdays', 'Weekends', 'Flexible'].map((sched, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <RadioGroupItem value={sched} id={`igcse-sched-${idx}`} />
                  <Label htmlFor={`igcse-sched-${idx}`} className="text-gray-700 cursor-pointer">
                    {sched}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }

      // Step 8 or adjusted: Rate Range
      if (currentStep === 8 && !teacherFocus.includes('Languages')) {
        return (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              What's your preferred hourly rate?
            </h2>
            <p className="text-sm text-gray-600 mb-6">Example: $8–$20 per hour</p>
            <Input
              placeholder="e.g., $8-$20"
              value={answers.hourlyRate || ""}
              onChange={(e) => handleAnswer('hourlyRate', e.target.value)}
            />
          </div>
        );
      }

      // Step 9 or adjusted: Confirmation (IGCSE)
      if (currentStep === 9 && !teacherFocus.includes('Languages')) {
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Perfect! Your teaching preferences are set.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Next, you'll complete your profile and make your teaching experience visible to students.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Your name</Label>
                <Input
                  placeholder="Your name"
                  value={teacherProfile.name}
                  onChange={(e) => setTeacherProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-sm">Primary subject</Label>
                <Input
                  placeholder="e.g., Math Tutor"
                  value={teacherProfile.subject}
                  onChange={(e) => setTeacherProfile(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="text-sm">Avatar image URL</Label>
                <Input
                  placeholder="Avatar image URL"
                  value={teacherProfile.avatarUrl}
                  onChange={(e) => setTeacherProfile(prev => ({ ...prev, avatarUrl: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-2">Use an absolute image URL — this will sync with your profile.</p>
              </div>
            </div>

            <div className="text-right">
              <Button onClick={nextStep} className="bg-black hover:bg-gray-900 text-white">
                {t('startSetupComplete')}
              </Button>
            </div>
          </div>
        );
      }
    }

    // Both Languages AND IGCSE selected - merged steps
    if (teacherFocus.includes('Languages') && teacherFocus.includes('IGCSE')) {
      // Steps merge here with appropriate questions
      // This handles the combined path
      
      // For now, show a combined flow - can be optimized
      return (
        <div className="space-y-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
            You selected both Languages and IGCSE Subjects
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Your profile will showcase expertise in both areas. Let's gather more details...
          </p>
          <Button onClick={nextStep} className="bg-black hover:bg-gray-900 text-white">
            Continue
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen gradient-lavender flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border border-white/40">
        <CardContent className="p-8 space-y-6">
          {/* Language selector + Progress Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Label className="text-sm">Language</Label>
              <select
                value={language}
                onChange={(e) => onChangeLanguage(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
                <option value="my">Burmese</option>
                <option value="sw">Swahili</option>
                <option value="ar">Arabic</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {t('stepOf', { current: currentStep, total: getTotalSteps() })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {role === 'student' ? t('studentOnboarding') : t('teacherOnboarding')}
              </span>
              <span className="text-sm text-gray-600">
                {t('stepOf', { current: currentStep, total: getTotalSteps() })}
              </span>
            </div>
            <Progress value={(currentStep / getTotalSteps()) * 100} className="h-2" />
          </div>

          {/* Step Content */}
          {role === 'student' ? renderStudentStep() : renderTeacherStep()}

          {/* Navigation Buttons */}
          {currentStep > 1 && (
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
              <Button
                onClick={nextStep}
                className="bg-black hover:bg-gray-900 text-white"
                disabled={
                  (role === 'student' && currentStep === 2 && !studentPath) ||
                  (role === 'student' && currentStep === 3 && !answers.languages && !answers.subjects) ||
                  (role === 'student' && currentStep === 4 && !answers.currentLevel && !answers.gradeLevel) ||
                  (role === 'student' && currentStep === 5 && !answers.learningObjective && !answers.igcseObjective) ||
                  (role === 'student' && currentStep === 6 && !answers.classPreference && !answers.studyPreference) ||
                  (role === 'student' && currentStep === 7 && !answers.timeAvailability && !answers.schedule) ||
                  (role === 'teacher' && currentStep === 2 && teacherFocus.length === 0)
                }
              >
                {currentStep === getTotalSteps() ? 'Complete' : 'Next'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
