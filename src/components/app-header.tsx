'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Coins, Sparkles, Home } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { ClusterUiSelect } from './cluster/cluster-ui'
import { WalletWidget } from '@/components/ui/wallet-widget'
import { cn } from '@/lib/utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useGetBalanceQuery } from '@/components/account/account-data-access'

const navLinks = [
  { label: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
  { label: 'Token', path: '/token', icon: <Coins className="h-5 w-5" /> },
  { label: 'Mint NFT', path: '/mint', icon: <Sparkles className="h-5 w-5" /> },
  // { label: 'Account', path: '/account', icon: <User className="h-5 w-5" /> },
  // { label: 'NFT Gifter', path: '/nftgifter', icon: <Gift className="h-5 w-5" /> },
]

export function AppHeader() {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const address = wallet.publicKey?.toBase58() ?? undefined
  const { data: balanceLamports } = useGetBalanceQuery({ address: address || '' })
  const balance = typeof balanceLamports === 'number' ? balanceLamports / 1e9 : undefined

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  // WalletWidget пропсы
  const walletWidgetProps = {
    isConnected: !!wallet.connected && !!address,
    isConnecting: wallet.connecting,
    address,
    balance,
    onConnect: () => setVisible(true),
    onDisconnect: () => wallet.disconnect && wallet.disconnect(),
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 px-4 py-3 transition-all duration-300 backdrop-blur-xl',
        scrolled ? 'bg-gradient-to-r from-[#0a0a0aee] via-[#1a1a1acc] to-[#0a0a0aee] shadow-lg' : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl flex justify-between items-center">
        {/* Logo */}
        <Link
          className="text-2xl font-extrabold select-none flex items-center gap-2 bg-gradient-to-r from-blue-400 via-fuchsia-500 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_#00d4ff99]"
          href="/"
          title="SolArtify"
        >
          <Sparkles className="w-7 h-7 animate-pulse text-accent-neon" />
          SolArtify
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-1 ml-8">
          {navLinks.map(({ label, path, icon }) => (
            <Link
              key={path}
              href={path}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200',
                isActive(path)
                  ? 'bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-glow scale-105'
                  : 'text-zinc-300 hover:bg-white/10 hover:text-white',
              )}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Wallet and Selects */}
        <div className="hidden md:flex items-center gap-3 ml-8">
          <WalletWidget {...walletWidgetProps} />
          <ClusterUiSelect />
          <ThemeSelect />
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden rounded-full hover:bg-white/10"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </Button>
      </div>

      {/* Mobile Menu (sliding) */}
      {showMenu && (
        <div
          className={`md:hidden fixed inset-0 z-40 bg-[#18181b] transition-opacity duration-300  flex flex-col animate-fade-in`}
        >
          <div className="bg-[#18181b] transition-opacity duration-300">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <Link
                className="text-2xl font-extrabold select-none flex items-center gap-2 bg-gradient-to-r from-blue-400 via-fuchsia-500 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_#00d4ff99]"
                href="/"
                onClick={() => setShowMenu(false)}
              >
                <Sparkles className="w-7 h-7 animate-pulse text-accent-neon" />
                NFT Gifter
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setShowMenu(false)}>
                <X className="h-7 w-7" />
              </Button>
            </div>
            <nav className="flex flex-col gap-2 px-6 py-6">
              {navLinks.map(({ label, path, icon }) => (
                <Link
                  key={path}
                  href={path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                    isActive(path)
                      ? 'bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-glow scale-105'
                      : 'text-zinc-300 hover:bg-white/10 hover:text-white',
                  )}
                  onClick={() => setShowMenu(false)}
                >
                  {icon}
                  <span className="text-lg">{label}</span>
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-4 px-6 mt-auto pb-8">
              <WalletWidget {...walletWidgetProps} />
              <ClusterUiSelect />
              <ThemeSelect />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
