import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Bell, Globe, Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { UserButton } from "@clerk/clerk-react";

const Settings = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  useEffect(() => {
    if (isLoaded && !user) {
      navigate("/login");
    }
  }, [user, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get user display name
  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.username) return user.username;
    return user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User';
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 pb-24">
      {/* Header */}
      <header className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="mx-auto max-w-4xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-3 sm:mb-4 text-gray-600 text-sm sm:text-base">
            ← Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Settings & Profile</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your account and preferences</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-purple-200 object-cover"
              />
            ) : (
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-purple-200">
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-xl sm:text-2xl text-white">{getInitials()}</AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-2 text-center sm:text-left">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={() => alert('Change photo functionality - Profile updates managed by Clerk')}
              >
                Change Photo
              </Button>
              <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
                <Input
                  id="name"
                  value={getDisplayName()}
                  className="pl-10 border-purple-200 focus:border-purple-400 bg-gray-50"
                  placeholder="Enter your full name"
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500">Name is managed by your authentication provider</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
                <Input
                  id="email"
                  type="email"
                  value={user.primaryEmailAddress?.emailAddress || ''}
                  className="pl-10 border-purple-200 focus:border-purple-400 bg-gray-50"
                  placeholder="Enter your email"
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500">Email is managed by your authentication provider</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700">Account Type</Label>
              <Select defaultValue="student" disabled>
                <SelectTrigger className="border-purple-200 focus:border-purple-400 bg-gray-50">
                  <SelectValue placeholder="Student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Account type is determined by your role selection</p>
            </div>

            <Button
              className="w-full bg-gradient-to-br from-purple-400 to-purple-600 text-white py-3 rounded-full font-medium hover:scale-105 transition-transform"
              onClick={() => alert('Profile information is managed by Clerk authentication')}
            >
              <User className="mr-2 h-4 w-4" />
              Manage in Authentication Provider
            </Button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div
          className="bg-white rounded-3xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => alert('Notification preferences - Coming soon!')}
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Push Notifications</p>
                <p className="text-sm text-gray-500">Get notified on your device</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive text messages</p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
              />
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div
          className="bg-white rounded-3xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => alert('Language settings - Coming soon!')}
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Language Settings</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Preferred Language</Label>
            <Select defaultValue="english">
              <SelectTrigger className="border-purple-200 focus:border-purple-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Security */}
        <div
          className="bg-white rounded-3xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => alert('Security settings - Coming soon!')}
        >
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Security</h2>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start py-3 border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={(e) => {
                e.stopPropagation();
                alert('Change password - Coming soon!');
              }}
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start py-3 border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={(e) => {
                e.stopPropagation();
                alert('Two-factor authentication - Coming soon!');
              }}
            >
              Two-Factor Authentication
            </Button>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <Button
            variant="destructive"
            className="w-full py-3"
            onClick={() => navigate("/logout")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;
