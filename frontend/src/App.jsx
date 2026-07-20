import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Search from './pages/Search';

function Layout({ children, darkMode, toggleDarkMode, fontSize, cycleFontSize }) {
  const location = useLocation();

  const getFontSizeLabel = () => {
    const labels = { 'text-base': '小', 'text-lg': '中', 'text-xl': '大' };
    return labels[fontSize] || '中';
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-amber-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
              诗歌阅读
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={cycleFontSize}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 relative"
                aria-label="切换字号"
              >
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" />
                </svg>
                <span className="absolute -bottom-1 -right-1 text-xs bg-amber-700 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {getFontSizeLabel()}
                </span>
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                aria-label="切换夜间模式"
              >
                {darkMode ? (
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-20">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-inset-bottom">
          <div className="max-w-md mx-auto px-4 py-3 flex justify-around items-center">
            <Link
              to="/"
              className={`flex flex-col items-center transition-all duration-200 ${
                location.pathname === '/'
                  ? 'text-amber-700 dark:text-amber-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-500'
              }`}
            >
              <div className={`p-3 rounded-full ${
                location.pathname === '/' ? 'bg-amber-100 dark:bg-amber-900/30' : ''
              }`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="text-xs mt-1">首页</span>
            </Link>
            <Link
              to="/search"
              className={`flex flex-col items-center transition-all duration-200 ${
                location.pathname === '/search'
                  ? 'text-amber-700 dark:text-amber-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-500'
              }`}
            >
              <div className={`p-3 rounded-full ${
                location.pathname === '/search' ? 'bg-amber-100 dark:bg-amber-900/30' : ''
              }`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs mt-1">搜索</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved || 'text-base';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const cycleFontSize = () => {
    const sizes = ['text-base', 'text-lg', 'text-xl'];
    const currentIndex = sizes.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setFontSize(sizes[nextIndex]);
  };

  return (
    <BrowserRouter>
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} fontSize={fontSize} cycleFontSize={cycleFontSize}>
        <Routes>
          <Route path="/" element={<Home fontSize={fontSize} />} />
          <Route path="/poem/:id" element={<Detail fontSize={fontSize} />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
