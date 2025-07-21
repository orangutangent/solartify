'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
// import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-accent-neon/20 bg-gray-900/95 backdrop-blur-xl shadow-2xl p-8 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-semibold text-white">{title}</div>
                  <DialogPrimitive.Close asChild>
                    <button
                      className="rounded-full p-2 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white focus:outline-none"
                      aria-label="Close"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </DialogPrimitive.Close>
                </div>
                <div>{children}</div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}
    </AnimatePresence>
  )
}
