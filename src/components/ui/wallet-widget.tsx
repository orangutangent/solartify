import * as React from 'react'
import { Copy, LogOut, Wallet as WalletIcon } from 'lucide-react'
import { Spinner } from './spinner'
import { Button } from './button'

export interface WalletWidgetProps {
  isConnected: boolean
  isConnecting?: boolean
  address?: string
  balance?: number
  onConnect: () => void
  onDisconnect: () => void
}

export const WalletWidget: React.FC<WalletWidgetProps> = ({
  isConnected,
  isConnecting = false,
  address,
  balance,
  onConnect,
  onDisconnect,
}) => {
  const [copied, setCopied] = React.useState(false)
  const shortAddr = address ? address.slice(0, 4) + '...' + address.slice(-4) : ''

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }

  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
        <Spinner size={20} />
        <span className="text-zinc-300 text-sm">Connecting...</span>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <Button variant="primary" size="md" onClick={onConnect} className="flex items-center gap-2">
        <WalletIcon className="w-5 h-5" /> Connect Wallet
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
      <WalletIcon className="w-5 h-5 text-accent-neon" />
      <span className="font-mono text-xs text-white cursor-pointer select-all" onClick={handleCopy}>
        {shortAddr}
      </span>
      <button
        onClick={handleCopy}
        className="text-zinc-400 hover:text-accent-neon transition-colors"
        aria-label="Copy address"
      >
        {copied ? <span className="text-accent-neon text-xs">Copied!</span> : <Copy className="w-4 h-4" />}
      </button>
      {typeof balance === 'number' && (
        <span className="ml-2 text-xs text-green-400 font-mono">{balance.toFixed(2)} SOL</span>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDisconnect}
        className="ml-2 px-2 py-1 text-zinc-400 hover:text-red-400"
        aria-label="Disconnect"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  )
}
