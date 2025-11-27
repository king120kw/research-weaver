const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Research AI Platform</h3>
            <p className="text-primary-foreground/80">
              Multi-modal research writing powered by verified intelligence.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Modules</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Template Adaptation</li>
              <li>Contextual Generation</li>
              <li>PDF Manipulation</li>
              <li>Conversation Engine</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Research Standards</li>
              <li>Contact Support</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/70">
          <p>© 2024 Research AI Platform. Built for academic excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
