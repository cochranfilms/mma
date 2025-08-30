import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Mousetrap Media Agency',
  description: 'Insights, tips, and industry news from the marketing and media experts at Mousetrap Media Agency.',
};

const blogPosts = [
  {
    title: "The Future of Digital Marketing in 2024",
    excerpt: "Explore the latest trends and technologies shaping the digital marketing landscape this year.",
    date: "March 15, 2024",
    category: "Digital Marketing",
    readTime: "5 min read"
  },
  {
    title: "Building Brand Authority Through Content Strategy",
    excerpt: "Learn how to establish your brand as a thought leader in your industry through strategic content creation.",
    date: "March 10, 2024",
    category: "Brand Strategy",
    readTime: "7 min read"
  },
  {
    title: "Maximizing ROI with Integrated Marketing Campaigns",
    excerpt: "Discover how to create cohesive campaigns that deliver results across multiple channels.",
    date: "March 5, 2024",
    category: "Marketing Strategy",
    readTime: "6 min read"
  },
  {
    title: "The Power of Visual Storytelling in Modern Marketing",
    excerpt: "Why visual content is more important than ever and how to leverage it for your brand.",
    date: "February 28, 2024",
    category: "Content Creation",
    readTime: "4 min read"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container-custom py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              Blog & Insights
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay ahead of the curve with expert insights, industry trends, and actionable marketing strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-accent-500/50 transition-all duration-300 group">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-accent-400 font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-3 group-hover:text-accent-400 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {post.date}
                    </span>
                    <button className="text-accent-400 hover:text-accent-300 transition-colors text-sm font-medium">
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-accent-500/10 to-accent-600/10 rounded-2xl p-8 border border-accent-500/20">
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-gray-300 mb-6">
                We're working on bringing you more valuable content. Subscribe to our newsletter to be notified when new articles are published.
              </p>
              <a
                href="/newsletter"
                className="btn-primary inline-block"
              >
                Subscribe to Newsletter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
