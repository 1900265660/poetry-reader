import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const { searchPoems, loading } = useApi();
  const navigate = useNavigate();

  const popularTags = ['李白', '杜甫', '春江花月夜', '静夜思'];

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (q) => {
    try {
      const data = await searchPoems(q);
      setResults(data.results || data || []);
      setSearched(true);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
      setSearched(true);
    }
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
  };

  const truncateContent = (content) => {
    if (content.length <= 50) return content;
    return content.substring(0, 50) + '...';
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 搜索诗歌、作者..."
            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-amber-700 dark:focus:border-amber-500 focus:outline-none transition-all duration-200 text-lg"
          />
        </div>
      </div>

      {!query && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            热门搜索
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            未找到相关诗歌
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((poem) => (
            <div
              key={poem.id}
              onClick={() => navigate(`/poem/${poem.id}`)}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              <h3 className="font-serif text-xl mb-2 text-gray-900 dark:text-gray-100">
                {poem.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {poem.author} · {poem.dynasty}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {truncateContent(poem.content)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
