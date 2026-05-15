import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, ChevronRight, FileText, Clock } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const res = await axios.get(`${apiUrl}/api/history`);
        setHistory(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold font-headings text-gray-900 mb-2">Analysis History</h1>
        <p className="text-gray-600">Review your past document insights and summaries.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse flex gap-2">
            <div className="w-3 h-3 bg-primary/40 rounded-full"></div>
            <div className="w-3 h-3 bg-primary/40 rounded-full animation-delay-200"></div>
            <div className="w-3 h-3 bg-primary/40 rounded-full animation-delay-400"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 bg-red-50 rounded-2xl">{error}</div>
      ) : history.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No history yet</h2>
          <p className="text-gray-500 mb-8">Upload your first document to see it here.</p>
          <Link to="/upload" className="btn-primary inline-flex">Upload Document</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => {
            const { date, time } = formatDate(item.timestamp);
            return (
              <Link 
                key={item.id} 
                to={`/results/${item.id}`}
                className="group glass-card p-6 flex flex-col md:flex-row md:items-center justify-between hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4 md:mb-0">
                  <div className="p-3 bg-blue-50 text-primary rounded-xl group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {item.filename}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 ml-14 md:ml-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{item.results.insights?.length || 0}</div>
                    <div className="text-gray-500 text-xs">Insights</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{item.results.actions?.length || 0}</div>
                    <div className="text-gray-500 text-xs">Actions</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all ml-4" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
