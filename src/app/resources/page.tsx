import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources - Mousetrap Media Agency',
  description: 'Free resources, tools, and guides to help you grow your business and improve your marketing efforts.',
};

const resources = [
  {
    title: "Marketing Strategy Template",
    description: "A comprehensive template to help you plan and execute your marketing strategy.",
    type: "Template",
    category: "Strategy",
    downloadUrl: "#"
  },
  {
    title: "Brand Guidelines Checklist",
    description: "Ensure your brand consistency with this detailed checklist.",
    type: "Checklist",
    category: "Branding",
    downloadUrl: "#"
  },
  {
    title: "Social Media Content Calendar",
    description: "Plan and organize your social media content with this easy-to-use calendar.",
    type: "Template",
    category: "Social Media",
    downloadUrl: "#"
  },
  {
    title: "ROI Measurement Guide",
    description: "Learn how to measure and improve your marketing return on investment.",
    type: "Guide",
    category: "Analytics",
    downloadUrl: "#"
  },
  {
    title: "Email Marketing Best Practices",
    description: "Proven strategies to improve your email marketing performance.",
    type: "Guide",
    category: "Email Marketing",
    downloadUrl: "#"
  },
  {
    title: "Website Optimization Checklist",
    description: "Optimize your website for better performance and conversions.",
    type: "Checklist",
    category: "Web Development",
    downloadUrl: "#"
  }
];

const tools = [
  {
    name: "Brand Color Palette Generator",
    description: "Generate professional color palettes for your brand.",
    url: "/tools"
  },
  {
    name: "Marketing Budget Calculator",
    description: "Calculate and allocate your marketing budget effectively.",
    url: "/tools"
  },
  {
    name: "Content Calendar Planner",
    description: "Plan your content strategy with our interactive calendar.",
    url: "/tools"
  }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container-custom py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              Resources & Tools
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Free resources, templates, and tools to help you grow your business and improve your marketing efforts.
            </p>
          </div>

          {/* Free Resources Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Free Downloads</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource, index) => (
                <div key={index} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-accent-500/50 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-accent-400 font-medium">
                      {resource.type}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent-400 transition-colors">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                  
                  <button className="btn-primary w-full">
                    Download Free
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Tools Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Marketing Tools</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool, index) => (
                <div key={index} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-accent-500/50 transition-all duration-300 group">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent-400 transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <a
                    href={tool.url}
                    className="btn-secondary w-full inline-block text-center"
                  >
                    Use Tool
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 rounded-2xl p-8 border border-accent-500/20">
              <h2 className="text-2xl font-bold mb-4">Need Custom Resources?</h2>
              <p className="text-gray-300 mb-6">
                Looking for something specific? We can create custom templates, guides, and tools tailored to your business needs.
              </p>
              <a
                href="/contact"
                className="btn-primary inline-block"
              >
                Request Custom Resource
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
