import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfUploadProps {
  onFileUpload: (file: File) => void;
}

export const PdfUpload: React.FC<PdfUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setStatus('Uploading file...');
    
    try {
      // Step 1: Call Smart Feedback API
      const formData = new FormData();
      formData.append('buttonid', 'O.c117bd44-8cfa-42df-99df-c4ad2ba6c6f5-F6je');
      formData.append('pdffile', file, file.name);
      formData.append('warn_cases', '{"trackid1": "sessionid"}');

      const smartFeedbackResponse = await fetch('https://api.diro.io/textract/smartFeedback', {
        method: 'POST',
        headers: {
          'x-api-key': '1bfd958aabcec0f6c3bd5dfa47fc3c88',
          'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkaHJ1ditkZW1vQGRpcm8uaW8iLCJhcGlrZXkiOiIxYmZkOTU4YWFiY2VjMGY2YzNiZDVkZmE0N2ZjM2M4OCJ9.K6J2BhY2g6rCdEDfgeF1KSbaoSKb7jwUFoOjkpM8oGRrLbFYvUTlBD2wpISjmBK_1-0EFAqwp5PjWPjI6x_HQw'
        },
        body: formData
      });

      if (!smartFeedbackResponse.ok) {
        throw new Error('Smart Feedback API failed');
      }

      const smartFeedbackData = await smartFeedbackResponse.json();
      const docId = smartFeedbackData.docid;

      if (!docId) {
        throw new Error('No docid received from Smart Feedback API');
      }

      setStatus('Processing document...');

      // Step 2: Call Smart Upload API
      const smartUploadResponse = await fetch('https://api.dirolabs.com/v3/smartUpload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '1bfd958aabcec0f6c3bd5dfa47fc3c88',
          'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkaHJ1ditkZW1vQGRpcm8uaW8iLCJhcGlrZXkiOiIxYmZkOTU4YWFiY2VjMGY2YzNiZDVkZmE0N2ZjM2M4OCJ9.K6J2BhY2g6rCdEDfgeF1KSbaoSKb7jwUFoOjkpM8oGRrLbFYvUTlBD2wpISjmBK_1-0EFAqwp5PjWPjI6x_HQw'
        },
        body: JSON.stringify({
          docid: docId
        })
      });

      if (!smartUploadResponse.ok) {
        throw new Error('Smart Upload API failed');
      }

      const smartUploadData = await smartUploadResponse.json();
      setStatus('Document processed successfully!');
      
      console.log('Smart Upload Response:', smartUploadData);
      
    } catch (error) {
      console.error('Error processing file:', error);
      setStatus('Error processing document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setUploadedFile(pdfFile);
      onFileUpload(pdfFile);
      processFile(pdfFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      onFileUpload(file);
      processFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h2 className="font-medium text-gray-800 mb-4 text-lg">Upload PDF Document</h2>
      
      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop your PDF file here, or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Only PDF files are accepted
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="mt-4 flex items-center space-x-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">{status}</span>
        </div>
      )}
      
      {status && !isProcessing && (
        <div className={`mt-4 text-sm ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {status}
        </div>
      )}
    </div>
  );
};