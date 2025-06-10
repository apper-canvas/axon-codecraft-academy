// Mock storage for code snippets
let snippets = [];
let nextId = 1;

// Load initial data from localStorage
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('code-snippets');
    if (stored) {
      const data = JSON.parse(stored);
      snippets = data.snippets || [];
      nextId = data.nextId || 1;
    }
  } catch (error) {
    console.error('Failed to load snippets from storage:', error);
  }
};

// Save to localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem('code-snippets', JSON.stringify({
      snippets,
      nextId
    }));
  } catch (error) {
    console.error('Failed to save snippets to storage:', error);
  }
};

// Initialize storage
loadFromStorage();

// Generate unique share URL
const generateShareUrl = (snippetId) => {
  return `${window.location.origin}/playground?snippet=${snippetId}`;
};

// Generate embed code
const generateEmbedCode = (snippetId) => {
  const url = generateShareUrl(snippetId);
  return `<iframe src="${url}&embed=true" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`;
};

export const snippetService = {
  // Get all snippets
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...snippets].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  // Get snippet by ID
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const snippet = snippets.find(s => s.id === parseInt(id));
    if (!snippet) {
      throw new Error('Snippet not found');
    }
    return { ...snippet };
  },

  // Create new snippet
  async create(snippetData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newSnippet = {
      id: nextId++,
      title: snippetData.title || 'Untitled Snippet',
      code: snippetData.code || '',
      language: snippetData.language || 'python',
      description: snippetData.description || '',
      isPublic: snippetData.isPublic || false,
      tags: snippetData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shareUrl: null,
      embedCode: null
    };

    // Generate share URLs if public
    if (newSnippet.isPublic) {
      newSnippet.shareUrl = generateShareUrl(newSnippet.id);
      newSnippet.embedCode = generateEmbedCode(newSnippet.id);
    }

    snippets.push(newSnippet);
    saveToStorage();
    
    return { ...newSnippet };
  },

  // Update snippet
  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = snippets.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new Error('Snippet not found');
    }

    const updatedSnippet = {
      ...snippets[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Update share URLs if made public
    if (updatedSnippet.isPublic && !updatedSnippet.shareUrl) {
      updatedSnippet.shareUrl = generateShareUrl(updatedSnippet.id);
      updatedSnippet.embedCode = generateEmbedCode(updatedSnippet.id);
    }

    snippets[index] = updatedSnippet;
    saveToStorage();
    
    return { ...updatedSnippet };
  },

  // Delete snippet
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const index = snippets.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new Error('Snippet not found');
    }

    snippets.splice(index, 1);
    saveToStorage();
    
    return { success: true };
  },

  // Share snippet (make public and get URLs)
  async share(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const snippet = snippets.find(s => s.id === parseInt(id));
    if (!snippet) {
      throw new Error('Snippet not found');
    }

    snippet.isPublic = true;
    snippet.shareUrl = generateShareUrl(snippet.id);
    snippet.embedCode = generateEmbedCode(snippet.id);
    snippet.updatedAt = new Date().toISOString();
    
    saveToStorage();
    
    return {
      shareUrl: snippet.shareUrl,
      embedCode: snippet.embedCode
    };
  },

  // Get public snippets (for sharing/embedding)
  async getPublicSnippets() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return snippets
      .filter(s => s.isPublic)
      .map(s => ({ ...s }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  // Search snippets
  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const searchTerm = query.toLowerCase();
    return snippets
      .filter(snippet => 
        snippet.title.toLowerCase().includes(searchTerm) ||
        snippet.description.toLowerCase().includes(searchTerm) ||
        snippet.code.toLowerCase().includes(searchTerm) ||
        snippet.language.toLowerCase().includes(searchTerm) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .map(s => ({ ...s }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  // Filter by language
  async getByLanguage(language) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return snippets
      .filter(s => s.language === language)
      .map(s => ({ ...s }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  // Get snippet statistics
  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const stats = {
      total: snippets.length,
      public: snippets.filter(s => s.isPublic).length,
      private: snippets.filter(s => !s.isPublic).length,
      byLanguage: {}
    };

    snippets.forEach(snippet => {
      stats.byLanguage[snippet.language] = (stats.byLanguage[snippet.language] || 0) + 1;
    });

    return stats;
  }
};