import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, ChevronRight, FileText, Lightbulb, Target, File } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Results() {
  const { fileId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    // If we have data passed from the Upload page, use it directly
    if (location.state?.resultData) {
      setData({
        id: fileId,
        filename: location.state.filename || 'Document',
        results: location.state.resultData
      });
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/history');
        const item = res.data.find(d => d.id === fileId);
        
        if (item) {
          setData(item);
        } else {
          setError("Results not found. The document might have expired or an error occurred.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load results.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [fileId, location.state]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Retrieving intelligent insights...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Link to="/upload" className="btn-primary inline-flex">Try Another Document</Link>
      </div>
    );
  }

  const { results, filename } = data;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <Link to="/history" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to History
          </Link>
          <h1 className="text-3xl font-bold font-headings text-gray-900 flex items-center">
            Analysis Results
            <ChevronRight className="w-6 h-6 text-gray-400 mx-2" />
            <span className="text-xl text-gray-500 font-medium font-sans truncate max-w-md" title={filename}>
              {filename}
            </span>
          </h1>
        </div>
        
        <button 
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(results, null, 2));
            toast.success("Copied to clipboard!");
          }}
          className="btn-secondary py-2 px-4 text-sm"
        >
          Export JSON
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-grow min-h-0">
        
        {/* Left Column - Extracted Text */}
        <div className="glass-card flex flex-col overflow-hidden h-full border border-gray-200">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-primary font-headings font-bold">
              <File className="w-5 h-5" />
              Document Text
            </div>
          </div>
          <div className="p-6 overflow-y-auto flex-grow bg-white text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-serif">
            {results.extracted_text ? results.extracted_text : <span className="text-gray-400 italic">No text extracted or text is too large to render.</span>}
          </div>
        </div>

        {/* Right Column - Insights Stack */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 h-full pb-8 custom-scrollbar">
          
          {/* Summary Card */}
          <div className="glass-card p-6 border-t-4 border-t-indigo-500 shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-headings">Executive Summary</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {results.summary}
            </p>
          </div>

          {/* Insights Card */}
          <div className="glass-card p-6 shrink-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-headings">Key Insights</h2>
            </div>
            <ul className="space-y-3">
              {results.insights && results.insights.length > 0 ? (
                results.insights.map((insight, idx) => (
                  <li key={idx} className="flex flex-start p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs mr-3 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{insight}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 italic text-sm">No insights extracted.</p>
              )}
            </ul>
          </div>

          {/* Action Points Card */}
          <div className="glass-card p-6 bg-gradient-to-br from-white to-[#F0FDFA] shrink-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 font-headings">Action Points</h2>
            </div>
            <ul className="space-y-3">
              {results.actions && results.actions.length > 0 ? (
                results.actions.map((action, idx) => (
                  <li key={idx} className="flex flex-start items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-accent mr-3 shrink-0" />
                    <p className="text-gray-800 text-sm font-medium">{action}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 italic text-sm">No actions extracted.</p>
              )}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
