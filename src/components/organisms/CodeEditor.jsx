import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import PropTypes from 'prop-types';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function CodeEditor({ 
  code, 
  setCode, 
  output, 
  onRun, 
  language = 'python', 
  isRunning = false,
  onClear
}) {
  const textareaRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Keyboard shortcuts
  useHotkeys('ctrl+enter, cmd+enter', () => {
    if (!isRunning && code.trim()) {
      onRun();
    }
  }, { enableOnFormTags: true });

  useHotkeys('ctrl+shift+c, cmd+shift+c', () => {
    if (onClear) onClear();
  }, { enableOnFormTags: true });

  // Update cursor position
  const updateCursorPosition = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = code.slice(0, cursorPos);
      const lines = textBeforeCursor.split('\n');
      setCursorPosition({
        line: lines.length,
        column: lines[lines.length - 1].length + 1
      });
    }
  };

  useEffect(() => {
    updateCursorPosition();
  }, [code]);

  const handleKeyDown = (e) => {
    const textarea = textareaRef.current;
    
    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '  '; // 2 spaces for indentation
      
      if (e.shiftKey) {
        // Shift+Tab: Remove indentation
        const lines = code.split('\n');
        const startLine = code.slice(0, start).split('\n').length - 1;
        const endLine = code.slice(0, end).split('\n').length - 1;
        
        const newLines = lines.map((line, index) => {
          if (index >= startLine && index <= endLine && line.startsWith(spaces)) {
            return line.slice(spaces.length);
          }
          return line;
        });
        
        setCode(newLines.join('\n'));
      } else {
        // Tab: Add indentation
        if (start === end) {
          // Single cursor
          const newCode = code.slice(0, start) + spaces + code.slice(end);
          setCode(newCode);
          setTimeout(() => {
            textarea.setSelectionRange(start + spaces.length, start + spaces.length);
          }, 0);
        } else {
          // Selection: indent all selected lines
          const lines = code.split('\n');
          const startLine = code.slice(0, start).split('\n').length - 1;
          const endLine = code.slice(0, end).split('\n').length - 1;
          
          const newLines = lines.map((line, index) => {
            if (index >= startLine && index <= endLine) {
              return spaces + line;
            }
            return line;
          });
          
          setCode(newLines.join('\n'));
        }
      }
    }
    
    // Auto-close brackets and quotes
    if (['(', '[', '{', '"', "'"].includes(e.key)) {
      const closingChar = {
        '(': ')',
        '[': ']',
        '{': '}',
        '"': '"',
        "'": "'"
      }[e.key];
      
      if (textarea.selectionStart === textarea.selectionEnd) {
        e.preventDefault();
        const start = textarea.selectionStart;
        const newCode = code.slice(0, start) + e.key + closingChar + code.slice(start);
        setCode(newCode);
        setTimeout(() => {
          textarea.setSelectionRange(start + 1, start + 1);
        }, 0);
      }
    }
    
    // Auto-indent on Enter
    if (e.key === 'Enter') {
      const start = textarea.selectionStart;
      const lines = code.slice(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      const indent = currentLine.match(/^(\s*)/)[1];
      
      // Add extra indent for lines ending with : { (
      const shouldIndent = /[:{\(]\s*$/.test(currentLine.trim());
      const extraIndent = shouldIndent ? '  ' : '';
      
      e.preventDefault();
      const newCode = code.slice(0, start) + '\n' + indent + extraIndent + code.slice(start);
      setCode(newCode);
      setTimeout(() => {
        const newPos = start + 1 + indent.length + extraIndent.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
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

  const getLanguageIcon = (lang) => {
    switch (lang.toLowerCase()) {
      case 'python': return 'FileCode';
      case 'javascript': return 'FileCode';
      case 'java': return 'FileCode';
      default: return 'FileCode';
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Could add toast notification here if toast is available
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const pasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newCode = code.slice(0, start) + text + code.slice(end);
        setCode(newCode);
        setTimeout(() => {
          textareaRef.current.setSelectionRange(start + text.length, start + text.length);
        }, 0);
      }
    } catch (error) {
      console.error('Failed to paste code:', error);
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
          <div className="flex items-center space-x-2">
            <ApperIcon name={getLanguageIcon(language)} className={`w-4 h-4 ${getLanguageColor(language)}`} />
            <span className={`text-sm font-medium ${getLanguageColor(language)}`}>
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Editor Actions */}
          <div className="hidden sm:flex items-center space-x-1">
            <button
              onClick={copyCode}
              className="p-1.5 text-surface-400 hover:text-white hover:bg-surface-600 rounded transition-colors"
              title="Copy (Ctrl+C)"
            >
              <ApperIcon name="Copy" className="w-4 h-4" />
            </button>
            <button
              onClick={pasteCode}
              className="p-1.5 text-surface-400 hover:text-white hover:bg-surface-600 rounded transition-colors"
              title="Paste (Ctrl+V)"
            >
              <ApperIcon name="Clipboard" className="w-4 h-4" />
            </button>
            {onClear && (
              <button
                onClick={onClear}
                className="p-1.5 text-surface-400 hover:text-white hover:bg-surface-600 rounded transition-colors"
                title="Clear (Ctrl+Shift+C)"
              >
                <ApperIcon name="RotateCcw" className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="w-px h-6 bg-surface-600"></div>
          
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRun}
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
                <span className="hidden sm:inline">Running...</span>
              </>
            ) : (
              <>
                <ApperIcon name="Play" className="w-4 h-4" />
                <span className="hidden sm:inline">Run Code</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code Input */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onSelect={updateCursorPosition}
          onClick={updateCursorPosition}
          placeholder={`Write your ${language} code here...\n\nKeyboard shortcuts:\n- Ctrl+Enter: Run code\n- Tab: Indent\n- Shift+Tab: Unindent\n- Ctrl+Shift+C: Clear code`}
          className="absolute inset-0 w-full h-full pl-16 pr-4 py-4 bg-secondary text-white font-mono text-sm resize-none outline-none border-none leading-6"
          style={{ 
            tabSize: 2,
            whiteSpace: 'pre'
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-14 bg-secondary/90 border-r border-surface-600 pointer-events-none">
          <div className="py-4 pr-2 text-xs text-surface-400 font-mono leading-6">
            {code.split('\n').map((_, index) => (
              <div key={index + 1} className="text-right px-2">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex-shrink-0 bg-secondary border-t border-surface-600 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-surface-400">
          <div className="flex items-center space-x-4">
            <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
            <span>{code.length} characters</span>
            <span>{code.split('\n').length} lines</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span>Ctrl+Enter to run</span>
            <span>Tab to indent</span>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="flex-shrink-0 border-t border-surface-600">
        <div className="bg-secondary/50 px-4 py-2 border-b border-surface-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Terminal" className="w-4 h-4 text-surface-400" />
              <span className="text-sm font-medium text-surface-300">Output</span>
            </div>
            {output && (
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="p-1.5 text-surface-400 hover:text-white hover:bg-surface-600 rounded transition-colors"
                title="Copy output"
              >
                <ApperIcon name="Copy" className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <div className="bg-secondary p-4 h-32 overflow-y-auto">
          <pre className="text-sm text-surface-200 font-mono whitespace-pre-wrap">
            {output || 'Click "Run Code" to see output...\n\nWelcome to the Code Playground! Write your code above and click Run to execute it.'}
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
  isRunning: PropTypes.bool,
  onClear: PropTypes.func,
};

export default CodeEditor;