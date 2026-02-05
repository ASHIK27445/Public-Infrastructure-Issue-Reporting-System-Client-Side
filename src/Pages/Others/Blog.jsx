import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { 
  Calendar,
  User,
  Clock,
  Tag,
  ArrowRight,
  Eye,
  MessageSquare,
  Share2,
  BookOpen,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  ChevronRight,
  ThumbsUp,
  Bookmark,
  Globe,
  Award,
  Target,
  Users,
  Zap,
  Leaf
} from 'lucide-react';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Articles', count: 24 },
    { id: 'community', name: 'Community', count: 8 },
    { id: 'infrastructure', name: 'Infrastructure', count: 6 },
    { id: 'sustainability', name: 'Sustainability', count: 4 },
    { id: 'tech', name: 'Technology', count: 5 },
    { id: 'guides', name: 'Guides', count: 7 }
  ];

  const featuredArticles = [
    {
      id: 1,
      title: 'How Citizens Transformed a Neighborhood Through Collective Action',
      excerpt: 'Discover how residents of Green Valley worked together to fix 50+ infrastructure issues in just 6 months.',
      author: 'Maria Gonzalez',
      date: 'Dec 15, 2024',
      readTime: '8 min read',
      category: 'community',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop',
      views: '2.4k',
      comments: 42,
      featured: true
    },
    {
      id: 2,
      title: 'The Future of Smart City Infrastructure',
      excerpt: 'Exploring how IoT and AI are revolutionizing how we monitor and maintain public infrastructure.',
      author: 'Dr. Alex Chen',
      date: 'Dec 10, 2024',
      readTime: '12 min read',
      category: 'tech',
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=500&fit=crop',
      views: '3.1k',
      comments: 28,
      featured: true
    }
  ];

  const articles = [
    {
      id: 3,
      title: '5 Essential Tips for Effective Issue Reporting',
      excerpt: 'Learn how to report infrastructure issues that get noticed and resolved quickly.',
      author: 'Sarah Johnson',
      date: 'Dec 5, 2024',
      readTime: '5 min read',
      category: 'guides',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w-600&h=400&fit=crop',
      views: '1.8k',
      comments: 15
    },
    {
      id: 4,
      title: 'Sustainable Urban Development: Lessons from Scandinavia',
      excerpt: 'How Nordic cities are leading the way in eco-friendly infrastructure solutions.',
      author: 'Lars Bergström',
      date: 'Nov 28, 2024',
      readTime: '10 min read',
      category: 'sustainability',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
      views: '2.2k',
      comments: 31
    },
    {
      id: 5,
      title: 'The Psychology of Community Engagement',
      excerpt: 'Understanding what motivates people to participate in civic improvement projects.',
      author: 'Dr. Rachel Wong',
      date: 'Nov 20, 2024',
      readTime: '7 min read',
      category: 'community',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop',
      views: '1.5k',
      comments: 22
    },
    {
      id: 6,
      title: 'AI-Powered Infrastructure Monitoring',
      excerpt: 'How machine learning is helping cities predict and prevent infrastructure failures.',
      author: 'Tech Innovations Team',
      date: 'Nov 15, 2024',
      readTime: '9 min read',
      category: 'tech',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      views: '2.7k',
      comments: 19
    },
    {
      id: 7,
      title: 'Case Study: Revitalizing Urban Parks',
      excerpt: 'How community-led initiatives transformed 5 neglected parks into thriving public spaces.',
      author: 'David Miller',
      date: 'Nov 8, 2024',
      readTime: '6 min read',
      category: 'community',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop',
      views: '1.9k',
      comments: 27
    },
    {
      id: 8,
      title: 'The Economics of Infrastructure Maintenance',
      excerpt: 'Why preventive maintenance saves cities millions and improves quality of life.',
      author: 'Economic Insights',
      date: 'Nov 2, 2024',
      readTime: '11 min read',
      category: 'infrastructure',
      image: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=600&h=400&fit=crop',
      views: '1.4k',
      comments: 14
    }
  ];

  const popularTags = [
    'Community Action', 'Urban Planning', 'Sustainability', 'Tech Innovation',
    'Case Studies', 'How-to Guides', 'Policy', 'Success Stories'
  ];

  const filteredArticles = articles.filter(article => {
    if (activeCategory !== 'all' && article.category !== activeCategory) return false;
    if (searchTerm && !article.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getCategoryColor = (category) => {
    const colors = {
      community: 'from-purple-500 to-pink-500',
      infrastructure: 'from-blue-500 to-cyan-500',
      sustainability: 'from-emerald-500 to-teal-500',
      tech: 'from-amber-500 to-orange-500',
      guides: 'from-indigo-500 to-purple-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  const getCategoryName = (category) => {
    const names = {
      community: 'Community',
      infrastructure: 'Infrastructure',
      sustainability: 'Sustainability',
      tech: 'Technology',
      guides: 'Guides'
    };
    return names[category] || 'General';
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-950 to-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-900/20 via-teal-900/20 to-cyan-900/20" />
          <div className="absolute inset-0 bg-[radial-linear(circle_at_70%_20%,rgba(16,185,129,0.15),transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-2 bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-full mb-6">
              <BookOpen className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">
                Community Insights
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              Community<span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Blog</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Stories, insights, and guides from citizens making a difference in their communities.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles, topics, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 backdrop-blur-sm"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-medium hover:shadow-emerald-500/50 transition-all">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeCategory === category.id
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                    : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                <span>{category.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeCategory === category.id
                    ? 'bg-white/20'
                    : 'bg-zinc-700'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Featured <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Stories</span>
            </h2>
            <div className="flex items-center text-emerald-400 font-medium hover:text-emerald-300 transition-colors cursor-pointer">
              <span>View All Featured</span>
              <ChevronRight className="w-5 h-5 ml-1" />
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredArticles.map((article) => (
              <div key={article.id} className="group relative bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:scale-[1.02]">
                {/* Featured Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="px-3 py-1 bg-linear-to-r from-amber-500 to-orange-500 rounded-full flex items-center space-x-1 shadow-lg">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-bold">FEATURED</span>
                  </div>
                </div>
                
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 bg-linear-to-r ${getCategoryColor(article.category)} rounded-full text-white text-xs font-bold`}>
                      {getCategoryName(article.category)}
                    </span>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {article.date}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-700">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {article.comments}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 bg-linear-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Articles Grid */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-white mb-6">
                  Latest Articles {activeCategory !== 'all' && `in ${getCategoryName(activeCategory)}`}
                </h3>
                
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No articles found with your search criteria</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredArticles.map((article) => (
                      <div key={article.id} className="group bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden hover:border-emerald-500/50 transition-all duration-500">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 bg-linear-to-r ${getCategoryColor(article.category)} rounded-full text-white text-xs font-bold`}>
                              {getCategoryName(article.category)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h4 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center text-gray-500 text-xs">
                                <Calendar className="w-3 h-3 mr-1" />
                                {article.date}
                              </div>
                              <div className="flex items-center text-gray-500 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {article.readTime}
                              </div>
                            </div>
                            
                            <button className="flex items-center text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between">
                <button className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors">
                  Previous
                </button>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                        num === 1
                          ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white'
                          : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <span className="text-gray-500">...</span>
                  <button className="w-10 h-10 bg-zinc-800 rounded-xl text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors">
                    12
                  </button>
                </div>
                <button className="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-medium hover:shadow-emerald-500/50 transition-all">
                  Next
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Popular Tags */}
              <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Tag className="w-6 h-6 text-emerald-500" />
                  <h4 className="text-xl font-bold text-white">Popular Topics</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-2 bg-zinc-700/50 hover:bg-zinc-700 rounded-xl text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-linear-to-br from-emerald-900/30 to-teal-900/30 rounded-3xl border border-emerald-500/30 p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                  <h4 className="text-xl font-bold text-white">Weekly Digest</h4>
                </div>
                <p className="text-gray-300 mb-4 text-sm">
                  Get the latest community stories and insights delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button className="w-full py-3 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-medium hover:shadow-emerald-500/50 transition-all">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="w-6 h-6 text-amber-500" />
                  <h4 className="text-xl font-bold text-white">Top Contributors</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Maria Gonzalez', articles: 12, role: 'Community Leader' },
                    { name: 'Dr. Alex Chen', articles: 8, role: 'Tech Expert' },
                    { name: 'Sarah Johnson', articles: 6, role: 'Guide Writer' }
                  ].map((contributor, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-zinc-800/50 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                        {contributor.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-white">{contributor.name}</div>
                        <div className="text-gray-400 text-sm">{contributor.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold">{contributor.articles}</div>
                        <div className="text-gray-500 text-xs">articles</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <h4 className="text-xl font-bold text-white">Blog Stats</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Articles</span>
                    <span className="text-white font-bold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Monthly Readers</span>
                    <span className="text-white font-bold">45.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Avg. Reading Time</span>
                    <span className="text-white font-bold">7 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Community Engagement</span>
                    <span className="text-white font-bold">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-3xl p-12 border border-zinc-700">
            <div className="w-20 h-20 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Share Your Community Story
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Have an inspiring story or valuable insights about community improvement? Contribute to our blog and inspire others.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group px-10 py-5 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg text-white shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3">
                <span>Submit an Article</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl font-bold text-lg text-white hover:bg-white/20 transition-all duration-300">
                View Guidelines
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;