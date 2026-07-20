import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import html2canvas from 'html2canvas';

export default function Home({ fontSize }) {
  const [poem, setPoem] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const { fetchRandom, loading } = useApi();
  const navigate = useNavigate();
  const posterRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
    loadRandomPoem();
  }, []);

  const loadRandomPoem = async () => {
    try {
      const data = await fetchRandom();
      setPoem(data);
    } catch (err) {
      console.error('Failed to load poem:', err);
    }
  };

  const toggleFavorite = () => {
    if (!poem) return;
    const isFavorited = favorites.includes(poem.id);
    const newFavorites = isFavorited
      ? favorites.filter(id => id !== poem.id)
      : [...favorites, poem.id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const handleShare = async () => {
    if (!poem) return;
    setShowPosterModal(true);
  };

  const handleSavePoster = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `诗歌-${poem.title}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate poster:', err);
      alert('生成海报失败，请重试');
    }
  };

  const getTruncatedContent = (content) => {
    const lines = content.split('\n');
    if (lines.length <= 8) return content;
    return lines.slice(0, 8).join('\n') + '\n...';
  };

  const isFavorited = poem && favorites.includes(poem.id);

  if (loading && !poem) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">加载失败，请重试</p>
        <button
          onClick={loadRandomPoem}
          className="mt-4 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-200"
        >
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-200"
        onClick={() => navigate(`/poem/${poem.id}`)}
      >
        <h1 className="font-serif text-3xl text-center mb-4 text-gray-900 dark:text-gray-100">
          {poem.title}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {poem.author} · {poem.dynasty}
        </p>
        <div className={`font-serif ${fontSize} leading-loose whitespace-pre-line text-gray-800 dark:text-gray-200`}>
          {poem.content}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={(e) => {
            e.stopPropagation();
            loadRandomPoem();
          }}
          disabled={loading}
          className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50 transition-all duration-200 font-medium"
        >
          {loading ? '加载中...' : '下一首'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          className="px-6 py-3 border-2 border-amber-700 text-amber-700 dark:text-amber-500 dark:border-amber-500 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
        >
          {isFavorited ? '♥' : '♡'} 收藏
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          className="px-6 py-3 border-2 border-amber-700 text-amber-700 dark:text-amber-500 dark:border-amber-500 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
        >
          海报
        </button>
      </div>

      {/* Poster Modal */}
      {showPosterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPosterModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            {/* Poster Preview */}
            <div ref={posterRef} className="bg-white rounded-xl p-8 mb-6 shadow-lg">
              <h1 className="font-serif text-2xl text-center mb-3 text-gray-900">
                {poem.title}
              </h1>
              <p className="text-center text-gray-600 text-sm mb-4">
                {poem.author} · {poem.dynasty}
              </p>
              <div className="border-t border-gray-200 mb-4"></div>
              <div className="font-serif text-base leading-loose whitespace-pre-line text-gray-800 mb-6 min-h-[200px]">
                {getTruncatedContent(poem.content)}
              </div>
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                  二维码
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  诗歌阅读
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSavePoster}
                className="flex-1 px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-200 font-medium"
              >
                保存图片
              </button>
              <button
                onClick={() => setShowPosterModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
