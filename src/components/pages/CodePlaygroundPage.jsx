import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import CodeEditor from '@/components/organisms/CodeEditor';
import { snippetService } from '@/services';

const LANGUAGES = [
  { value: 'python', label: 'Python', icon: 'FileCode' },
  { value: 'javascript', label: 'JavaScript', icon: 'FileCode' },
  { value: 'java', label: 'Java', icon: 'FileCode' }
];

const DEFAULT_CODE = {
  python: `# Welcome to Python Playground
def hello_world():
    print("Hello, World!")
    return "Python is awesome!"

# Run your code
result = hello_world()
print(f"Result: {result}")`,
  javascript: `// Welcome to JavaScript Playground
function helloWorld() {
    console.log("Hello, World!");
    return "JavaScript is powerful!";
}

// Run your code
const result = helloWorld();
console.log(\`Result: \${result}\`);`,
  java: `// Welcome to Java Playground
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        String result = getMessage();
        System.out.println("Result: " + result);
    }
    
    public static String getMessage() {
        return "Java is robust!";
    }
}`
};

function CodePlaygroundPage() {
  const [activeTab, setActiveTab] = useState('editor');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedUrl, setSharedUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  // Load saved data on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('playground-language');
    const savedCode = localStorage.getItem(`playground-code-${language}`);
    
    if (savedLanguage && LANGUAGES.find(l => l.value === savedLanguage)) {
      setLanguage(savedLanguage);
    }
    
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(DEFAULT_CODE[language]);
    }

    loadSavedSnippets();
  }, []);

  // Save language selection
  useEffect(() => {
    localStorage.setItem('playground-language', language);
    const savedCode = localStorage.getItem(`playground-code-${language}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(DEFAULT_CODE[language]);
    }
  }, [language]);

  // Save code changes
  useEffect(() => {
    if (code.trim()) {
      localStorage.setItem(`playground-code-${language}`, code);
    }
  }, [code, language]);

  const loadSavedSnippets = async () => {
    try {
      const snippets = await snippetService.getAll();
      setSavedSnippets(snippets);
    } catch (error) {
      console.error('Failed to load snippets:', error);
    }
  };

  const executeCode = async () => {
    if (!code.trim()) {
      toast.warn('Please write some code first!');
      return;
    }

    setIsRunning(true);
    setOutput('Running code...\n');

    try {
      // Simulate code execution with different outputs based on language
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      let result;
      switch (language) {
        case 'python':
          result = simulatePythonExecution(code);
          break;
        case 'javascript':
          result = simulateJavaScriptExecution(code);
          break;
        case 'java':
          result = simulateJavaExecution(code);
          break;
        default:
          result = 'Language not supported yet.';
      }
      
      setOutput(result);
      toast.success('Code executed successfully!');
    } catch (error) {
      setOutput(`Error: ${error.message}\n\nStack trace:\n${error.stack || 'No stack trace available'}`);
      toast.error('Code execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const simulatePythonExecution = (code) => {
    if (code.includes('print')) {
      const printMatches = code.match(/print\((.*?)\)/g);
      if (printMatches) {
        return printMatches.map(match => {
          const content = match.slice(6, -1).replace(/['"]/g, '');
          return content.includes('f"') || content.includes("f'") 
            ? content.replace(/f["'](.*)["']/, '$1').replace(/\{.*?\}/g, 'result_value')
            : content;
        }).join('\n') + '\n\nExecution completed successfully.';
      }
    }
    
    if (code.includes('def ')) {
      return 'Function defined successfully.\nHello, World!\nResult: Python is awesome!\n\nExecution completed successfully.';
    }
    
    return 'Code executed successfully.\nNo output to display.';
  };

  const simulateJavaScriptExecution = (code) => {
    if (code.includes('console.log')) {
      const logMatches = code.match(/console\.log\((.*?)\)/g);
      if (logMatches) {
        return logMatches.map(match => {
          const content = match.slice(12, -1).replace(/['"]/g, '');
          return content.includes('`') 
            ? content.replace(/`(.*)`/, '$1').replace(/\$\{.*?\}/g, 'result_value')
            : content;
        }).join('\n') + '\n\nExecution completed successfully.';
      }
    }
    
    if (code.includes('function ')) {
      return 'Hello, World!\nResult: JavaScript is powerful!\n\nExecution completed successfully.';
    }
    
    return 'Code executed successfully.\nNo output to display.';
  };

  const simulateJavaExecution = (code) => {
    if (code.includes('System.out.println')) {
      const printMatches = code.match(/System\.out\.println\((.*?)\)/g);
      if (printMatches) {
        return printMatches.map(match => {
          const content = match.slice(20, -1).replace(/['"]/g, '');
          return content.includes('" + ') 
            ? content.replace(/" \+ .*/, 'result_value')
            : content;
        }).join('\n') + '\n\nExecution completed successfully.';
      }
    }
    
    if (code.includes('public static void main')) {
      return 'Hello, World!\nResult: Java is robust!\n\nExecution completed successfully.';
    }
    
    return 'Code compiled and executed successfully.\nNo output to display.';
  };

  const clearCode = () => {
    setCode(DEFAULT_CODE[language]);
    setOutput('');
    localStorage.removeItem(`playground-code-${language}`);
    toast.info('Code cleared');
  };

  const saveSnippet = async () => {
    if (!code.trim()) {
      toast.warn('Cannot save empty code');
      return;
    }

    try {
      const snippet = {
        title: `${language.charAt(0).toUpperCase() + language.slice(1)} Snippet`,
        code,
        language,
        description: `Code snippet written in ${language}`
      };

      await snippetService.create(snippet);
      await loadSavedSnippets();
      toast.success('Snippet saved successfully!');
    } catch (error) {
      toast.error('Failed to save snippet');
    }
  };

  const shareSnippet = async () => {
    if (!code.trim()) {
      toast.warn('Cannot share empty code');
      return;
    }

    try {
      const snippet = {
        title: `Shared ${language.charAt(0).toUpperCase() + language.slice(1)} Code`,
        code,
        language,
        description: `Shared code snippet written in ${language}`,
        isPublic: true
      };

      const savedSnippet = await snippetService.create(snippet);
      const shareUrl = `${window.location.origin}/playground?snippet=${savedSnippet.id}`;
      const embedHtml = `<iframe src="${shareUrl}&embed=true" width="100%" height="400" frameborder="0"></iframe>`;
      
      setSharedUrl(shareUrl);
      setEmbedCode(embedHtml);
      setShowShareModal(true);
      
      toast.success('Snippet shared! URL generated.');
    } catch (error) {
      toast.error('Failed to share snippet');
    }
  };

  const loadSnippet = async (snippetId) => {
    try {
      const snippet = await snippetService.getById(snippetId);
      setLanguage(snippet.language);
      setCode(snippet.code);
      setOutput('');
      toast.success('Snippet loaded successfully!');
    } catch (error) {
      toast.error('Failed to load snippet');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const tabs = [
    { id: 'editor', label: 'Code Editor', icon: 'Code2' },
    { id: 'snippets', label: 'Saved Snippets', icon: 'Save' }
  ];

  return (
    <div className="h-full bg-background">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-secondary">Code Playground</h1>
                <p className="text-surface-600 mt-1">Write, run, and share code snippets</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="min-w-[140px]"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </Select>
                
                <Button
                  onClick={clearCode}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="RotateCcw" className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
                
                <Button
                  onClick={saveSnippet}
                  variant="outline" 
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="Save" className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
                
                <Button
                  onClick={shareSnippet}
                  className="flex items-center space-x-2 bg-primary text-white hover:bg-primary/90"
                >
                  <ApperIcon name="Share2" className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-shrink-0 mb-6">
            <div className="border-b border-surface-200">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-surface-600 hover:text-secondary hover:border-surface-300'
                    }`}
                  >
                    <ApperIcon name={tab.icon} className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'editor' && (
              <div className="h-full bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  output={output}
                  onRun={executeCode}
                  language={language}
                  isRunning={isRunning}
                  onClear={clearCode}
                />
              </div>
            )}

            {activeTab === 'snippets' && (
              <div className="h-full bg-white rounded-xl border border-surface-200 shadow-sm p-6 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary mb-2">Saved Snippets</h3>
                  <p className="text-surface-600">Your saved code snippets</p>
                </div>

                {savedSnippets.length === 0 ? (
                  <div className="text-center py-12">
                    <ApperIcon name="Code2" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-surface-600 mb-2">No saved snippets</h3>
                    <p className="text-surface-500">Save your first code snippet to see it here</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {savedSnippets.map((snippet) => (
                      <motion.div
                        key={snippet.id}
                        whileHover={{ scale: 1.02 }}
                        className="border border-surface-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => loadSnippet(snippet.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-secondary">{snippet.title}</h4>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {snippet.language}
                          </span>
                        </div>
                        <p className="text-surface-600 text-sm mb-3">{snippet.description}</p>
                        <div className="bg-surface-50 rounded p-2 font-mono text-xs text-surface-700 overflow-hidden">
                          <pre className="truncate">{snippet.code.split('\n')[0]}...</pre>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary">Share Snippet</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-surface-50 rounded-lg"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Share URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={sharedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-surface-300 rounded-lg bg-surface-50 text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(sharedUrl)}
                    size="sm"
                    variant="outline"
                  >
                    <ApperIcon name="Copy" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Embed Code
                </label>
                <div className="flex items-start space-x-2">
                  <textarea
                    value={embedCode}
                    readOnly
                    rows={3}
                    className="flex-1 px-3 py-2 border border-surface-300 rounded-lg bg-surface-50 text-sm font-mono resize-none"
                  />
                  <Button
                    onClick={() => copyToClipboard(embedCode)}
                    size="sm"
                    variant="outline"
                  >
                    <ApperIcon name="Copy" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowShareModal(false)}>
                Done
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default CodePlaygroundPage;