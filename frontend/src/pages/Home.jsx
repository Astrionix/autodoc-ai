import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, FileText, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full pt-24 pb-32 px-4 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-secondary text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
          Academic Intelligence Platform
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold font-headings text-gray-900 max-w-4xl tracking-tight mb-8">
          Transform Complex Documents into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Actionable Insights</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          AutoDoc AI uses advanced LLMs to extract summaries, key insights, and actionable learning points from your academic papers instantly.
        </p>

        <div className="flex items-center gap-4">
          <Link to="/upload" className="btn-primary text-lg px-8 py-4">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/history" className="btn-secondary text-lg px-8 py-4">
            View History
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-24 border-t border-gray-100">
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={FileText}
            title="Smart Summaries"
            description="Our AI distills long research papers into concise, easy-to-read overviews, saving you hours of reading time."
          />
          <FeatureCard 
            icon={BrainCircuit}
            title="Extract Key Insights"
            description="Automatically identifies and highlights the most crucial data points, findings, and arguments from any document."
          />
          <FeatureCard 
            icon={Zap}
            title="Actionable Learnings"
            description="Goes beyond summarization to provide concrete, actionable steps and takeaways for your research or work."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="glass-card p-8 hover:-translate-y-1 transition-transform duration-300">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-headings">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
