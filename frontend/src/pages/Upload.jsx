import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  }, []);

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;
    
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.docx') && !selectedFile.name.endsWith('.txt') && !selectedFile.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    
    setFile(selectedFile);
  };

  const processFile = async () => {
    if (!file) return;
    
    setIsUploading(true);
    const toastId = toast.loading('Uploading and analyzing document... This may take a moment.');
    
    try {
      // 1. Upload
      const formData = new FormData();
      formData.append('file', file);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const uploadRes = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const fileId = uploadRes.data.file_id;
      
      // 2. Analyze
      const analyzeData = new FormData();
      analyzeData.append('filename', file.name);
      
      const analyzeRes = await axios.post(`${apiUrl}/api/analyze/${fileId}`, analyzeData);
      
      toast.success('Analysis complete!', { id: toastId });
      navigate(`/results/${fileId}`, { state: { resultData: analyzeRes.data, filename: file.name } });
      
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.detail || 'An error occurred during processing.';
      toast.error(`Error: ${errMsg}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headings text-gray-900 mb-4">Upload Document</h1>
        <p className="text-gray-600 text-lg">Upload your academic paper to extract intelligent insights.</p>
      </div>

      <div className="glass-card p-8 md:p-12">
        <div 
          className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all ${
            isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-gray-200 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
                <File className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
              <p className="text-gray-500 mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setFile(null)} 
                  className="btn-secondary px-8"
                  disabled={isUploading}
                >
                  Change File
                </button>
                <button 
                  onClick={processFile} 
                  className="btn-primary px-8"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Analyze Document'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Drag & drop your file here</h3>
              <p className="text-gray-500 mb-8">Supported formats: PDF, DOCX, TXT (Max 20MB)</p>
              
              <label className="btn-primary cursor-pointer px-8">
                Browse Files
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => validateAndSetFile(e.target.files[0])}
                />
              </label>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex items-start gap-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 text-gray-400 shrink-0" />
          <p>
            Your documents are processed securely. Complex formatting or scanned documents without OCR might take longer or yield partial results.
          </p>
        </div>
      </div>
    </div>
  );
}
