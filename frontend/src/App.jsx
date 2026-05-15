import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Results from './pages/Results';
import History from './pages/History';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results/:fileId" element={<Results />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
