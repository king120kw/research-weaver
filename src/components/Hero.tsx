import { Button } from "@/components/ui/button";
import { FileText, Brain, Sparkles, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">AI-Powered Research Writing Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Transform Research
            <br />
            <span className="text-accent-foreground/90">With Intelligence</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Multi-modal AI engine combining template adaptation, contextual generation, 
            and precise PDF manipulation for academic excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2 shadow-strong"
              onClick={handleGetStarted}
            >
              {user ? (
                <>
                  <Brain className="w-5 h-5" />
                  Go to Dashboard
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Get Started
                </>
              )}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              onClick={() => {
                document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <FileText className="w-5 h-5" />
              Explore Modules
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
    </section>
  );
};

export default Hero;
