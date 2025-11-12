import { useNavigate } from "react-router-dom";
import { Search, BookOpen, MessageSquare, Apple, Crown, Bell, User } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card px-4 py-4 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-foreground">
                Hi, Ofspace
              </h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
              <Bell className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-10 rounded-2xl border-muted bg-muted/30"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6 space-y-8">
        {/* Hero Card - "Let's learn More!" style */}
        <section className="animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl gradient-pink p-8 shadow-soft-lg text-white card-3d">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">
                Let's learn<br />More!
              </h2>
              <Button 
                onClick={() => navigate("/browse")}
                className="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
              >
                Get Start →
              </Button>
            </div>
            {/* Decorative blob */}
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-12 right-12 h-32 w-32 rounded-full gradient-purple opacity-50 blur-2xl" />
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Categories
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Math", icon: BookOpen, color: "bg-[hsl(var(--category-math))]" },
              { name: "Art", icon: MessageSquare, color: "bg-[hsl(var(--category-vocabulary))]" },
              { name: "Science", icon: Apple, color: "bg-[hsl(var(--category-proverbs))]" }
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => navigate("/browse")}
                className={`${category.color} rounded-2xl p-4 transition-all hover:scale-105 shadow-soft`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-white/50 p-3">
                    <category.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Enroll Course Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              Enroll Course
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/browse")}
              className="text-primary font-semibold"
            >
              See all
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Course Card 1 */}
            <div 
              onClick={() => navigate("/browse")}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200 p-4 shadow-soft card-3d cursor-pointer"
            >
              <div className="aspect-video rounded-xl bg-white/50 mb-3 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-pink-500" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-foreground mb-1">Science Technology</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      ⭐ 4.8
                    </span>
                    <span>•</span>
                    <span>👤 5.4 ETH</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Course Card 2 */}
            <div 
              onClick={() => navigate("/browse")}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-200 p-4 shadow-soft card-3d cursor-pointer"
            >
              <div className="aspect-video rounded-xl bg-white/50 mb-3 flex items-center justify-center">
                <MessageSquare className="h-12 w-12 text-blue-500" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-foreground mb-1">Science Technology</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      ⭐ 4.8
                    </span>
                    <span>•</span>
                    <span>👤 5.4 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Banner */}
        <section className="animate-fade-in">
          <button
            onClick={() => navigate("/premium")}
            className="w-full overflow-hidden rounded-3xl gradient-coral p-6 text-left transition-all hover:scale-[1.02] shadow-soft-lg"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white/20 backdrop-blur-sm p-3 border border-white/30">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-xl font-bold text-white">Go Premium</h3>
                <p className="text-sm text-white/80">
                  Get unlimited access to all features
                </p>
              </div>
            </div>
          </button>
        </section>

        {/* Quick Links to New Pages */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">Explore YadaLearn</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => navigate('/mobile-screens')}
              className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl py-6"
            >
              Mobile Screens
            </Button>
            <Button 
              onClick={() => navigate('/role-selection')}
              className="bg-gradient-to-br from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-2xl py-6"
            >
              Role Selection
            </Button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
