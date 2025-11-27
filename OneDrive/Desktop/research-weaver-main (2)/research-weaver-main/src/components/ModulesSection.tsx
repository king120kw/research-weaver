import ModuleCard from "./ModuleCard";
import { FileSearch, Layers, FilePen, MessageSquare } from "lucide-react";

const ModulesSection = () => {
  const modules = [
    {
      icon: FileSearch,
      title: "Template Adaptation",
      description: "Ingest existing research documents, extract structural frameworks, and enable surgical content replacement with verified data.",
      badge: "Module 1",
      features: [
        "Structural decomposition of academic papers",
        "Content replacement with verified sources",
        "Maintains original tone and formatting",
        "Cross-reference verification pipeline",
        "Reliability scoring for all sources"
      ]
    },
    {
      icon: Layers,
      title: "Contextual Generation",
      description: "Build comprehensive research documents from minimal context through intelligent scaffolding and evidence synthesis.",
      badge: "Module 2",
      features: [
        "Generate 10-200 page research documents",
        "Chapter-level blueprint processing",
        "Parallel generation with continuity assurance",
        "Objective parsing and validation",
        "Multi-source evidence retrieval"
      ]
    },
    {
      icon: FilePen,
      title: "PDF Manipulation",
      description: "Directly modify PDF content layers while preserving document integrity and academic formatting standards.",
      badge: "Module 3",
      features: [
        "In-place text modification with font matching",
        "Smart reflow and pagination",
        "Citation injection with auto-renumbering",
        "Figure and table editing",
        "Non-destructive edit layers"
      ]
    },
    {
      icon: MessageSquare,
      title: "Conversation Engine",
      description: "Multi-turn dialogue to refine research parameters, clarify objectives, and provide accurate, context-aware responses.",
      badge: "Module 4",
      features: [
        "Context-aware query responses",
        "Zero hallucination guarantee",
        "Proactive clarification triggers",
        "Source verification in real-time",
        "Multi-level detail responses"
      ]
    }
  ];

  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Integrated Research Modules
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four powerful engines working in harmony to transform your research workflow
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((module, index) => (
            <ModuleCard key={index} {...module} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
