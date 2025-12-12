import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordLockProps {
  onUnlock: () => void;
  correctPassword: string;
}

export function PasswordLock({ onUnlock, correctPassword }: PasswordLockProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [locked, setLocked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (password === correctPassword) {
      setLocked(false);
      setTimeout(() => onUnlock(), 600);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 1000);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [password]);

  if (!locked) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-black z-[10000] pointer-events-none"
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center z-[10000] overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, rgba(0, 120, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 120, 212, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Animated light beams */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500 to-transparent rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative z-10 flex flex-col items-center gap-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-3xl p-8 border-2 border-blue-400/50 shadow-2xl"
      >
        {/* Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 bg-gradient-to-br from-blue-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl"
        >
          <div className="w-16 h-16 grid grid-cols-2 gap-1">
            <div className="bg-blue-300 rounded-sm" />
            <div className="bg-blue-300 rounded-sm" />
            <div className="bg-blue-300 rounded-sm" />
            <div className="bg-blue-300 rounded-sm" />
          </div>
        </motion.div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Windows 13</h1>
          <p className="text-blue-300 text-sm">Enter your password to continue</p>
        </div>

        {/* Password Input */}
        <div className="w-80 relative">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              className={`w-full px-4 py-3 bg-white/10 border-2 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
                error ? 'border-red-500 focus:ring-red-500' : 'border-blue-400/50'
              }`}
              data-testid="input-password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              data-testid="button-toggle-password"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 w-80"
          data-testid="button-submit-password"
        >
          Sign In
        </button>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-sm"
          >
            Incorrect password
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
