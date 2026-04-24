import { useState, useRef } from 'react';
import { Upload as UploadIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadProps {
  onAnalyze: (file: File, conditions: string) => void;
  isLoading: boolean;
}

export default function Upload({ onAnalyze, isLoading }: UploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conditions, setConditions] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onAnalyze(selectedFile, conditions);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all ${
          dragActive
            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
            : 'border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-green-500'
        } backdrop-blur-lg`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          <div className="p-8">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-contain rounded-2xl"
            />
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="mb-2 text-slate-900 dark:text-white">
              Drop your food image here
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              or click to browse
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6"
      >
        <label className="block mb-2 text-slate-900 dark:text-white">
          Health Conditions (Optional)
        </label>
        <input
          type="text"
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          placeholder="e.g., diabetes, lactose intolerance"
          className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading}
        className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <UploadIcon className="w-5 h-5" />
            Analyze Food
          </>
        )}
      </motion.button>
    </div>
  );
}
