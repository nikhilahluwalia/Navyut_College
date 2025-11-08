import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description,
  loading = false,
  delay = 0 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible && !loading) {
      let start = 0;
      const end = typeof value === 'number' ? value : 0;
      const duration = 1500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedValue(end);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible, loading, value]);

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return animatedValue.toLocaleString();
    }
    return val;
  };

  const getTrendColor = (trendValue) => {
    if (trendValue > 0) return 'text-green-600 dark:text-green-400';
    if (trendValue < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getTrendIcon = (trendValue) => {
    if (trendValue > 0) return <TrendingUp className="w-4 h-4" />;
    if (trendValue < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  const getGradient = (trendValue) => {
    if (trendValue > 0) return 'from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800';
    if (trendValue < 0) return 'from-red-500/10 to-red-600/5 border-red-200 dark:border-red-800';
    return 'from-blue-500/10 to-purple-600/5 border-gray-200 dark:border-gray-700';
  };

  if (loading) {
    return (
      <div className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="animate-pulse">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 overflow-hidden transform hover:scale-[1.02] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        transition: 'transform 0.3s ease, opacity 0.5s ease, box-shadow 0.3s ease'
      }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(trend)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-[1px] rounded-2xl bg-white dark:bg-gray-800"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200 group-hover:text-gray-700 dark:group-hover:text-gray-300">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-200">
              {formatValue(value)}
            </p>
            
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                {description}
              </p>
            )}
          </div>
          
          {/* Icon Container */}
          <div className="relative">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Icon Glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Trend Indicator */}
        {trend !== undefined && (
          <div className="flex items-center mt-4 space-x-2">
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              trend > 0 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 group-hover:bg-green-200 dark:group-hover:bg-green-900/50' 
                : trend < 0 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 group-hover:bg-red-200 dark:group-hover:bg-red-900/50'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-900/50'
            }`}>
              {getTrendIcon(trend)}
              <span className="ml-1 font-semibold">
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300">
              from last month
            </span>
          </div>
        )}
      </div>

      {/* Interactive Sparkle Effect */}
      <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
}