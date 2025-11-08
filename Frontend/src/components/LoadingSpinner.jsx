import { useEffect, useState } from 'react';

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  color = 'primary',
  text = '',
  centered = true,
  fullScreen = false 
}) {
  const [dots, setDots] = useState('');

  // Animated dots for text loading
  useEffect(() => {
    if (text) {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [text]);

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400',
    secondary: 'border-gray-200 border-t-gray-600 dark:border-gray-800 dark:border-t-gray-400',
    success: 'border-green-200 border-t-green-600 dark:border-green-800 dark:border-t-green-400',
    warning: 'border-yellow-200 border-t-yellow-600 dark:border-yellow-800 dark:border-t-yellow-400',
    error: 'border-red-200 border-t-red-600 dark:border-red-800 dark:border-t-red-400',
    white: 'border-white/30 border-t-white dark:border-gray-700 dark:border-t-white'
  };

  const colorBgClasses = {
    primary: 'bg-blue-600 dark:bg-blue-400',
    secondary: 'bg-gray-600 dark:bg-gray-400',
    success: 'bg-green-600 dark:bg-green-400',
    warning: 'bg-yellow-600 dark:bg-yellow-400',
    error: 'bg-red-600 dark:bg-red-400',
    white: 'bg-white dark:bg-white'
  };

  const variantStyles = {
    default: `border-4 rounded-full`,
    dots: `border-2 rounded-full`,
    bars: `border-0 bg-current rounded`,
    pulse: `border-0 bg-current rounded-full`,
    gradient: `border-0 rounded-full`
  };

  const getVariantSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`${sizeClasses[size]} ${colorClasses[color]} border-2 rounded-full animate-spin`} />
        );
      
      case 'bars':
        return (
          <div className="flex items-end justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-1 ${colorBgClasses[color]} rounded-full animate-bounce`}
                style={{
                  height: size === 'sm' ? '12px' : size === 'md' ? '16px' : '20px',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} ${colorClasses.primary.replace('border-t-', 'bg-')} rounded-full animate-pulse`} />
        );
      
      case 'gradient':
        return (
          <div className="relative">
            <div 
              className={`${sizeClasses[size]} rounded-full animate-spin`}
              style={{
                background: `conic-gradient(from 0deg, transparent, #6366f1, transparent)`
              }}
            />
            <div className={`absolute inset-1 rounded-full bg-white dark:bg-gray-900`} />
          </div>
        );
      
      default:
        return (
          <div 
            className={`${sizeClasses[size]} ${variantStyles.default} ${colorClasses[color]} animate-spin`}
            style={{
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent'
            }}
          />
        );
    }
  };

  const containerClasses = `
    ${centered ? 'flex items-center justify-center' : 'inline-flex'}
    ${fullScreen ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50' : ''}
  `;

  return (
    <div className={containerClasses}>
      <div className={`flex flex-col items-center justify-center space-y-3 ${fullScreen ? 'scale-125' : ''}`}>
        {/* Spinner */}
        <div className="relative">
          {getVariantSpinner()}
          
          {/* Ripple effect for default variant */}
          {variant === 'default' && (
            <div 
              className={`absolute inset-0 ${sizeClasses[size]} border-2 ${colorClasses[color].split(' ')[0]} rounded-full animate-ping`}
              style={{ animationDuration: '2s' }}
            />
          )}
        </div>

        {/* Loading Text */}
        {text && (
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-300">
              {text}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-4">
              {dots}
            </span>
          </div>
        )}

        {/* Progress indicator for full screen */}
        {fullScreen && (
          <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"
              style={{
                animation: 'progress 2s ease-in-out infinite'
              }}
            />
          </div>
        )}
      </div>

      {/* Custom animation for progress bar */}
      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}

// Additional specialized loading components
export const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin dark:border-blue-800 dark:border-t-blue-400" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }} />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
        Loading CollegeConnect
      </p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Preparing your dashboard...
      </p>
    </div>
  </div>
);

export const ContentLoader = ({ rows = 3 }) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="flex space-x-4">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
        </div>
      </div>
    ))}
  </div>
);

export const TableLoader = ({ columns = 5, rows = 6 }) => (
  <div className="animate-pulse">
    <div className="flex space-x-4 mb-6">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4 py-4 border-b border-gray-200 dark:border-gray-700">
        {Array.from({ length: columns }).map((_, j) => (
          <div key={j} className="flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    ))}
  </div>
);