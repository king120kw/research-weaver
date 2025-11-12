import { useNavigate } from "react-router-dom";
import { User, Settings, CreditCard, Award, LogOut, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 pb-24">
      {/* Header */}
      <header className="px-3 sm:px-4 py-4 sm:py-6">
        <div className="mx-auto max-w-4xl text-center">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-3 sm:mb-4 text-gray-600 text-sm sm:text-base">
            ← Back
          </Button>
          {/* Avatar */}
          <div className="mb-3 sm:mb-4 flex justify-center">
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-2xl sm:text-3xl font-bold text-white">
              SJ
            </div>
          </div>

          <h1 className="mb-2 text-xl sm:text-2xl font-bold text-gray-800">
            Sarah Johnson
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Student</p>
        </div>
      </header>

      {/* Profile Cards */}
      <div className="mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-6">
        <div className="space-y-3 mb-6">
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4">
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-medium">sarah.johnson@email.com</p>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4">
            <p className="text-sm text-gray-600 mb-1">Academic Level</p>
            <p className="font-medium">IGCSE Year 10</p>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-4">
            <p className="text-sm text-gray-600 mb-1">Total Hours Learned</p>
            <p className="font-medium">45 hours</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-4">
            <p className="text-sm text-gray-600 mb-1">Completed Sessions</p>
            <p className="font-medium">12 sessions</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            className="w-full bg-gradient-to-br from-purple-400 to-purple-600 text-white py-4 rounded-full font-medium hover:scale-105 transition-transform"
            onClick={() => navigate("/settings")}
          >
            Edit Profile
          </Button>

          <Button
            variant="outline"
            className="w-full py-4 rounded-full font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => navigate("/logout")}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

const MenuItem = ({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: any;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <button 
    onClick={onClick}
    className="w-full rounded-xl bg-card p-4 text-left transition-all hover:shadow-md"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </button>
);

export default Profile;
