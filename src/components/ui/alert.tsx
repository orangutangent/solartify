import * as React from 'react'
import { CheckCircle, XCircle, Loader2, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ToastProps {
  type: 'success' | 'error' | 'info' | 'pending'
  message: string
  onClose: () => void
  duration?: number // ms
}

const icons = {
  success: <CheckCircle className="text-green-400 w-5 h-5" />,
  error: <XCircle className="text-red-400 w-5 h-5" />,
  info: <Info className="text-accent-neon w-5 h-5" />,
  pending: <Loader2 className="text-fuchsia-400 w-5 h-5 animate-spin" />,
}

const bgClasses = {
  success: 'bg-green-900/80 border-green-400/30',
  error: 'bg-red-900/80 border-red-400/30',
  info: 'bg-accent-neon/10 border-accent-neon/30',
  pending: 'bg-fuchsia-900/80 border-fuchsia-400/30',
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose, duration = 3500 }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 320, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-6 right-6 z-50 min-w-[240px] max-w-xs px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 ${bgClasses[type]}`}
        role="alert"
      >
        {icons[type]}
        <span className="text-white text-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-zinc-400 hover:text-white transition-colors rounded-full p-1 focus:outline-none"
          aria-label="Close notification"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
