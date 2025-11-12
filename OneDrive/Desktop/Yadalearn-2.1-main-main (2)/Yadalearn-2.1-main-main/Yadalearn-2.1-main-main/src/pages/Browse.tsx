import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { TeacherCard } from "@/components/TeacherCard";

interface Teacher {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  languages: string[];
  hourlyRate: number;
  avatar?: string;
}

const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "Maria Garcia",
    rating: 4.9,
    reviews: 156,
    languages: ["Spanish", "English"],
    hourlyRate: 25,
  },
  {
    id: "2",
    name: "John Smith",
    rating: 4.8,
    reviews: 203,
    languages: ["English", "French"],
    hourlyRate: 30,
  },
  {
    id: "3",
    name: "Li Wei",
    rating: 5.0,
    reviews: 89,
    languages: ["Chinese", "English"],
    hourlyRate: 28,
  },
];

const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            Find Your Teacher
          </h1>
          
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by language, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full"
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Teacher List */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {mockTeachers.length} teachers found
          </p>
        </div>

        <div className="space-y-4">
          {mockTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              {...teacher}
              isTopRated={teacher.rating >= 4.8}
              onViewProfile={(id) => navigate(`/teacher/${id}`)}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Browse;
