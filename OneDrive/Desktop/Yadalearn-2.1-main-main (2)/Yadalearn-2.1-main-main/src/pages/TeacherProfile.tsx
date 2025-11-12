import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, Calendar, Video, Heart, Share2, MapPin, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TeacherProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock teacher data
  const teacher = {
    id: id || "1",
    name: "Maria Garcia",
    headline: "Native Spanish Teacher with 10+ Years Experience",
    rating: 4.9,
    reviews: 156,
    languages: ["Spanish", "English", "French"],
    hourlyRate: 25,
    lessonsCompleted: 1240,
    students: 87,
    bio: "Hello! I'm Maria, a passionate language teacher from Spain. I specialize in helping students achieve fluency through conversational practice and cultural immersion. My teaching style is interactive, fun, and tailored to each student's needs.",
    experience: [
      { title: "Language Instructor", institution: "International Language School", years: "2015-Present" },
      { title: "Private Tutor", institution: "Self-Employed", years: "2012-2015" },
    ],
    education: [
      { degree: "Master in Education", institution: "University of Barcelona", year: "2014" },
      { degree: "BA in Spanish Literature", institution: "University of Madrid", year: "2011" },
    ],
    certifications: ["DELE Examiner", "TEFL Certified", "Spanish Language Expert"],
  };

  const reviews = [
    {
      id: "1",
      studentName: "John D.",
      rating: 5,
      comment: "Maria is an excellent teacher! Very patient and knowledgeable.",
      date: "2025-09-15",
    },
    {
      id: "2",
      studentName: "Sarah K.",
      rating: 5,
      comment: "Best Spanish teacher I've had. Highly recommend!",
      date: "2025-09-10",
    },
    {
      id: "3",
      studentName: "Michael R.",
      rating: 4,
      comment: "Great lessons, very professional and well-prepared.",
      date: "2025-09-05",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={isFavorite ? "h-5 w-5 fill-destructive text-destructive" : "h-5 w-5"} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="animate-fade-in rounded-2xl border border-border bg-card p-6 mb-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-3xl font-bold text-white">
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                {teacher.name}
              </h1>
              <p className="mb-3 text-muted-foreground">{teacher.headline}</p>
              
              <div className="mb-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-semibold">{teacher.rating}</span>
                  <span className="text-muted-foreground">({teacher.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{teacher.lessonsCompleted} lessons</span>
                </div>
              </div>

              {/* Languages */}
              <div className="mb-4 flex flex-wrap justify-center sm:justify-start gap-2">
                {teacher.languages.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-3xl font-bold text-primary">${teacher.hourlyRate}</p>
                  <p className="text-xs text-muted-foreground">per hour</p>
                </div>
                <Button size="lg" className="w-full sm:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Lesson
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="animate-fade-in rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-3 text-xl font-semibold text-foreground">About Me</h2>
              <p className="text-muted-foreground leading-relaxed">{teacher.bio}</p>
            </div>

            <div className="animate-fade-in rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Experience</h2>
              <div className="space-y-4">
                {teacher.experience.map((exp, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{exp.title}</h3>
                      <p className="text-sm text-muted-foreground">{exp.institution}</p>
                      <p className="text-xs text-muted-foreground">{exp.years}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fade-in rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Education</h2>
              <div className="space-y-4">
                {teacher.education.map((edu, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                      <BookOpen className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fade-in rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {teacher.certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="text-sm">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <div className="animate-fade-in rounded-2xl border border-border bg-card p-6 mb-6">
              <div className="text-center">
                <p className="mb-2 text-5xl font-bold text-foreground">{teacher.rating}</p>
                <div className="mb-2 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${star <= Math.round(teacher.rating) ? "fill-warning text-warning" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {teacher.reviews} reviews
                </p>
              </div>
            </div>

            {reviews.map((review) => (
              <div key={review.id} className="animate-fade-in rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {review.studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{review.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? "fill-warning text-warning" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
            <div className="animate-fade-in rounded-2xl border border-border bg-card p-6 text-center">
              <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Calendar Coming Soon
              </h3>
              <p className="mb-4 text-muted-foreground">
                Select available time slots to book a lesson
              </p>
              <Button onClick={() => navigate("/bookings")}>
                View My Bookings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherProfile;
