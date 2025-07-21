'use client'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Sparkles, Gift, HelpCircle, BookOpen, ArrowDownCircle } from 'lucide-react'

const links = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solana.com/developers/cookbook/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  { label: 'Solana Developers GitHub', href: 'https://github.com/solana-developers/' },
]

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section
        className="w-full flex flex-col top-[-5rem] items-center justify-center min-h-screen h-screen py-12 px-4 relative overflow-hidden snap-start"
        id="hero"
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl w-full z-10"
        >
          <Card variant="nft" className="p-10 flex flex-col items-center gap-6 text-center">
            <Sparkles className="w-12 h-12 text-accent-neon animate-pulse mb-2" />
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-fuchsia-500 to-green-400 bg-clip-text text-transparent drop-shadow mb-2">
              SolArtify
            </h1>
            <p className="text-zinc-300 text-lg max-w-xl mx-auto">
              A modern Solana dApp for AI NFT generation, minting, and sharing. Powered by Anchor, Next.js, and a
              beautiful crypto UI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <a
                href="/token"
                className="inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-lg focus-visible:ring-2 focus-visible:ring-fuchsia-400 hover:from-fuchsia-500 hover:to-indigo-500 px-8 py-3 text-lg rounded-2xl"
              >
                Go to Token Actions
              </a>
            </div>
          </Card>
        </motion.div>
        <a
          href="#how"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowDownCircle className="w-10 h-10 text-accent-neon animate-bounce" />
        </a>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="w-full flex justify-center items-center min-h-screen h-screen py-16 px-4 bg-gradient-to-b from-transparent to-[#0a0a0a] snap-start"
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl w-full"
        >
          <Card className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
              <Gift className="w-7 h-7 text-accent-neon" /> How it works
            </h2>
            <ol className="list-decimal pl-6 text-zinc-300 space-y-2 text-lg">
              <li>Connect your Solana wallet</li>
              <li>Claim tokens (if available) — cooldown applies</li>
              <li>Buy more tokens with SOL</li>
              <li>Mint NFTs using your tokens</li>
              <li>All actions are on-chain, transparent and secure</li>
            </ol>
          </Card>
        </motion.div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="w-full flex justify-center items-center min-h-screen h-screen py-16 px-4 snap-start"
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl w-full"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="nft" className="p-6 flex flex-col items-center text-center">
              <Gift className="w-8 h-8 text-accent-neon mb-2" />
              <h3 className="text-xl font-semibold text-white mb-1">Claim Tokens</h3>
              <p className="text-zinc-400">
                Claim free tokens every cooldown period. Fair and transparent for all users.
              </p>
            </Card>
            <Card variant="nft" className="p-6 flex flex-col items-center text-center">
              <Sparkles className="w-8 h-8 text-accent-neon mb-2" />
              <h3 className="text-xl font-semibold text-white mb-1">Mint NFTs</h3>
              <p className="text-zinc-400">Use your tokens to mint unique NFTs. Each NFT is verifiable and on-chain.</p>
            </Card>
            <Card variant="nft" className="p-6 flex flex-col items-center text-center">
              <BookOpen className="w-8 h-8 text-accent-neon mb-2" />
              <h3 className="text-xl font-semibold text-white mb-1">Buy Tokens</h3>
              <p className="text-zinc-400">Purchase extra tokens with SOL to unlock more features and NFTs.</p>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="w-full flex justify-center items-center min-h-screen h-screen py-16 px-4 bg-gradient-to-b from-[#0a0a0a] to-transparent snap-start"
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl w-full"
        >
          <Card className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-7 h-7 text-accent-neon" /> FAQ
            </h2>
            <div className="space-y-4 text-zinc-300 text-lg">
              <div>
                <span className="font-bold text-accent-neon">Is it safe?</span>
                <p>Yes! All logic is on-chain, open-source and transparent. You control your wallet.</p>
              </div>
              <div>
                <span className="font-bold text-accent-neon">What wallets are supported?</span>
                <p>Any Solana wallet supported by wallet-adapter (Phantom, Solflare, Backpack, etc).</p>
              </div>
              <div>
                <span className="font-bold text-accent-neon">How often can I claim?</span>
                <p>You can claim once per cooldown period (see Claim page for details).</p>
              </div>
              <div>
                <span className="font-bold text-accent-neon">Where can I see the code?</span>
                <p>The full source is available on GitHub.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Links */}
      <section
        id="links"
        className="w-full flex justify-center items-center min-h-screen h-screen py-16 px-4 snap-start"
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-accent-neon" /> Solana Resources
            </h2>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-accent-neon hover:underline hover:text-white transition-colors font-mono"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
