import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

export default function Detail({ fontSize }) {
  const { id } = useParams();
  const [poem, setPoem] = useState(null);
  const { fetchPoem, loading } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    loadPoem();
  }, [id]);

  const loadPoem = async () => {
    try {
      const data = await fetchPoem(id);
      setPoem(data);
    } catch (err) {
      console.error('Failed to load poem:', err);
    }
  };

  const handlePrevious = () => {
    const prevId = parseInt(id) - 1;
    if (prevId > 0) {
      navigate(`/poem/${prevId}`);
    }
  };

  const handleNext = () => {
    const nextId = parseInt(id) + 1;
    navigate(`/poem/${nextId}`);
  };

  if (loading) {
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
        <p className="text-gray-600 dark:text-gray-400 mb-4">未找到该诗歌</p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-200"
        >
          回到首页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="font-serif text-3xl text-center mb-4 text-gray-900 dark:text-gray-100">
          {poem.title}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-2">
          {poem.author}
        </p>
        <p className="text-center text-gray-500 dark:text-gray-500 text-sm mb-8">
          {poem.dynasty}
        </p>
        <div className={`font-serif ${fontSize} leading-loose whitespace-pre-line text-gray-800 dark:text-gray-200`}>
          {poem.content}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handlePrevious}
          disabled={parseInt(id) <= 1}
          className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          上一首
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-200 font-medium"
        >
          下一首
        </button>
      </div>

      <div className="text-center mt-6">
        <Link
          to="/"
          className="text-amber-700 dark:text-amber-500 hover:underline transition-all duration-200"
        >
          回到首页
        </Link>
      </div>
    </div>
  );
}
