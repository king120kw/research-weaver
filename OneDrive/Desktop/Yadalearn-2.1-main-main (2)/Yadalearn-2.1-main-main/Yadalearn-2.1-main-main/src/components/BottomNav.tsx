import { Home, Search, Calendar, User, Users, Video, DollarSign } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  action?: () => void;
}

const getNavItems = (isTeacherDashboard: boolean): NavItem[] => {
  if (isTeacherDashboard) {
    return [
      {
        icon: Home,
        label: "Home",
        path: "/teacher-dashboard",
        action: () => {
          // Always refreshes the teacher's data snapshot (e.g., latest income, sessions)
          // Scroll position resets to top when returning from another tab
          window.scrollTo({ top: 0, behavior: 'smooth' });
          // Simulate data refresh
          setTimeout(() => {
            console.log('📊 Dashboard data refreshed');
          }, 300);
        }
      },
      {
        icon: Search,
        label: "Search",
        path: "/teacher-dashboard",
        action: () => {
          // Opens the exploration interface where teachers can find students seeking tutors
          const searchInfo = `🔍 Student Discovery Interface

Search bar at top (by subject, language, or region)
Filter Options:
• Subject (Math, Science, English, etc.)
• Age range and student level
• Rating and experience requirements
• Availability and time preferences

Advanced Features:
• Filtered by your teaching preferences
• Language selection affects visibility
• Global student discovery
• Real-time availability matching

Each student card shows:
• Profile image and basic info
• Subject interests and goals
• Location and time zone
• "View Profile" for detailed information`;

          alert(searchInfo);
        }
      },
      {
        icon: Calendar,
        label: "Calendar",
        path: "/teacher-dashboard",
        action: () => {
          // Opens the teacher's full calendar view for managing availability and classes
          const calendarInfo = `📅 Teacher Schedule Management

View Options:
• Daily, Weekly, and Monthly toggle
• Color-coded session types
• Student name and class details

Interactive Features:
• Tap on session → view/edit details
• Add new class → opens "Add Session" modal
• Block time slots → mark unavailable
• Drag & drop rescheduling

Smart Integration:
• Auto-sync with Quick Actions Schedule card
• Real-time updates to student dashboards
• Conflict prevention system
• Free slot suggestions for new students

Current Schedule Preview:
• Today's sessions with join buttons
• Upcoming week overview
• Availability status indicators`;

          alert(calendarInfo);
        }
      },
      {
        icon: User,
        label: "Profile",
        path: "/settings",
        action: () => {
          // Redirects to the Teacher Settings Page with all editable information
          const profileInfo = `👤 Teacher Settings Page

📋 Profile Information:
• Edit full name and professional bio
• Upload/change profile picture
• Update contact information

📄 CV Upload:
• Upload PDF/DOCX files (≤5MB)
• Preview and download options
• Secure cloud storage

🎓 Teaching Preferences:
• Choose subjects (Math, Science, English, etc.)
• Set hourly/session rates
• Select educational systems (IGCSE, IB, etc.)

⏰ Availability:
• Set teaching schedule
• Block time slots
• Manage free/busy status

💰 Earnings:
• Monthly/yearly income summaries
• Transaction history
• Payment method setup (bank/PayPal)
• Payout requests

🌐 Language Selection:
• Indonesian 🇮🇩
• Swahili 🇰🇪
• Bahasa (Malay) 🇲🇾
• Arabic 🇸🇦
• English 🇬🇧
• Burmese 🇲🇲
• Chinese 🇨🇳

🎨 Theme Options:
• Light Mode
• Dark Mode
• Neutral Mode

🌍 Globe (International View):
• Interactive world map
• Global student availability
• Country-specific requests

🚪 Logout:
• Secure session termination
• Return to Welcome Screen

✨ Profile Picture Sync:
Updates reflect instantly across all dashboard locations`;

          alert(profileInfo);
        }
      },
    ];
  } else {
    return [
      { icon: Home, label: "Home", path: "/student-dashboard" },
      {
        icon: Search,
        label: "Search",
        path: "/student-dashboard",
        action: () => {
          alert('🔍 Teacher Search\n\nFind teachers based on:\n• Subject expertise\n• Rating and reviews\n• Availability\n• Teaching style');
        }
      },
      {
        icon: Calendar,
        label: "Calendar",
        path: "/student-dashboard",
        action: () => {
          alert('📅 My Classes\n\nView your scheduled classes:\n• Upcoming sessions\n• Class history\n• Teacher information\n• Session recordings');
        }
      },
      { icon: User, label: "Profile", path: "/profile" },
    ];
  }
};

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're on teacher or student dashboard
  const isTeacherDashboard = location.pathname.includes('/teacher-dashboard') || location.pathname.includes('/settings');
  const isStudentDashboard = location.pathname.includes('/student-dashboard') || location.pathname.includes('/profile');
  const navItems = getNavItems(isTeacherDashboard);

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-white/20 bg-white/95 backdrop-blur-sm z-50 pb-safe">
      <div className="mx-auto flex w-full max-w-lg items-center justify-around px-2 py-3 sm:px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => {
                // Haptic feedback simulation
                if (navigator.vibrate) {
                  navigator.vibrate(50);
                }

                if (item.action) {
                  item.action();
                }
                navigate(item.path);
              }}
              className={cn(
                "flex flex-col items-center gap-1 transition-all p-2 rounded-lg min-w-[60px] active:scale-95",
                isActive
                  ? "text-purple-600 bg-purple-50 shadow-sm"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              )}
            >
              <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs sm:text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
