import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { InteractiveModuleCard } from "@/components/InteractiveModuleCard";
import { UploadDialog } from "@/components/UploadDialog";
import { FileText, Sparkles, FileEdit, MessageSquare } from "lucide-react";

const Index = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState("");
  const navigate = useNavigate();

  const modules = [
    {
      icon: FileText,
      title: "Template Adaptation",
      description: "Transform existing research documents with surgical precision while preserving academic style and structure.",
      capabilities: [
        "Preserve original formatting and citation style",
        "Replace domain-specific content with verified data",
        "Extract and maintain structural frameworks"
      ],
      gradient: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1))",
      onClick: () => {
        setSelectedModule("Template Adaptation");
        setUploadDialogOpen(true);
      }
    },
    {
      icon: Sparkles,
      title: "Contextual Generation",
      description: "Generate comprehensive research documents from minimal context with AI-powered evidence synthesis.",
      capabilities: [
        "Build 10-200 page documents with chapter structures",
        "Verify every claim against academic databases",
        "Maintain objective fidelity throughout generation"
      ],
      gradient: "linear-gradient(135deg, hsl(var(--accent) / 0.1), hsl(var(--primary) / 0.1))",
      onClick: () => {
        setSelectedModule("Contextual Generation");
        setUploadDialogOpen(true);
      }
    },
    {
      icon: FileEdit,
      title: "PDF Manipulation",
      description: "Directly edit PDF content with advanced manipulation while maintaining document integrity.",
      capabilities: [
        "In-place text modification with font matching",
        "Smart reflow and citation renumbering",
        "Non-destructive edit layers with version control"
      ],
      gradient: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--secondary) / 0.1))",
      onClick: () => {
        setSelectedModule("PDF Manipulation");
        setUploadDialogOpen(true);
      }
    },
    {
      icon: MessageSquare,
      title: "Conversation Engine",
      description: "Engage in multi-turn dialogue with strict accuracy protocols and zero hallucination guarantee.",
      capabilities: [
        "Context-aware responses with source verification",
        "Three depth levels: Executive, Standard, Expert",
        "Real-time accuracy chain-of-custody tracking"
      ],
      gradient: "linear-gradient(135deg, hsl(var(--accent) / 0.1), hsl(var(--secondary) / 0.1))",
      onClick: () => navigate("/chat")
    }
  ];

  return (
    <div className="min-h-screen">
      <Hero />

      <section className="py-24 px-4 bg-gradient-to-b from-background to-accent/5" id="modules">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Interactive Research Modules
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hover over each module to explore capabilities. Click to begin your research workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {modules.map((module, index) => (
              <InteractiveModuleCard
                key={index}
                icon={module.icon}
                title={module.title}
                description={module.description}
                capabilities={module.capabilities}
                onClick={module.onClick}
                gradient={module.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection />
      <Footer />

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        moduleType={selectedModule}
      />
    </div>
  );
};

export default Index;
