import { Shield, Zap, BookOpen, RefreshCcw } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Zero Hallucination",
      description: "Every claim traceable to verified sources. Fabrication detection and explicit speculation flagging."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process 10 pages in 60 seconds. Parallel generation for large-scale documents."
    },
    {
      icon: BookOpen,
      title: "Academic Rigor",
      description: "Maintains citation standards, logical progression, and methodological integrity."
    },
    {
      icon: RefreshCcw,
      title: "Continuous Verification",
      description: "Real-time source validation against peer-reviewed databases and institutional repositories."
    }
  ];

  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Built for Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade features ensuring research integrity and academic standards
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center space-y-4 group">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
