import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function CodeEditor({ code, setCode, output, onRun, language = 'python' }) {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      await onRun();
    } finally {
      setTimeout(() => setIsRunning(false), 500);
    }
  };

  const getLanguageColor = (lang) => {
    switch (lang.toLowerCase()) {
      case 'python': return 'text-blue-400';
      case 'javascript': return 'text-yellow-400';
      case 'java': return 'text-red-400';
      default: return 'text-surface-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex-shrink-0 bg-secondary px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className={`text-sm font-medium ${getLanguageColor(language)}`}>
            {language}
          </span>
        </div>
        
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRun}
          disabled={isRunning || !code.trim()}
          className="flex items-center space-x-2 px-4 py-2 bg-success text-white text-sm font-medium rounded hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ApperIcon name="Loader2" className="w-4 h-4" />
              </motion.div>
              <span>Running...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Play" className="w-4 h-4" />
              <span>Run Code</span>
            </>
          )}
        </Button>
      </div>

      {/* Code Input */}
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`Write your ${language} code here...`}
          className="absolute inset-0 w-full h-full p-4 bg-secondary text-white font-mono text-sm resize-none outline-none border-none"
          style={{ 
            lineHeight: '1.5',
            tabSize: 2
          }}
        />
        
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-secondary/80 border-r border-surface-600 pointer-events-none">
          <div className="p-4 text-xs text-surface-400 font-mono leading-6">
            {code.split('\n').map((_, index) => (
              <div key={index + 1} className="text-right">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="flex-shrink-0 border-t border-surface-600">
        <div className="bg-secondary/50 px-4 py-2 border-b border-surface-600">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Terminal" className="w-4 h-4 text-surface-400" />
            <span className="text-sm font-medium text-surface-300">Output</span>
          </div>
        </div>
        <div className="bg-secondary p-4 h-32 overflow-y-auto">
          <pre className="text-sm text-surface-200 font-mono whitespace-pre-wrap">
            {output || 'Click "Run Code" to see output...'}
          </pre>
        </div>
      </div>
    </div>
  );
}

CodeEditor.propTypes = {
  code: PropTypes.string.isRequired,
  setCode: PropTypes.func.isRequired,
  output: PropTypes.string.isRequired,
  onRun: PropTypes.func.isRequired,
  language: PropTypes.string,
};

export default CodeEditor;