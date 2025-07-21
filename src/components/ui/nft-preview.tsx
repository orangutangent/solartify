import * as React from 'react'
import { motion } from 'framer-motion'
import { Button } from './button'
import { Spinner } from './spinner'

export interface NFTPreviewProps {
  nft: {
    image: string
    name: string
    collection: string
    price?: number
    rarity?: 'common' | 'rare' | 'legendary'
  }
  onClaim?: () => void
  status: 'available' | 'claimed' | 'pending'
}

const rarityColors = {
  common: 'border-zinc-500',
  rare: 'border-blue-400',
  legendary: 'border-fuchsia-500',
}

export const NFTPreview: React.FC<NFTPreviewProps> = ({ nft, onClaim, status }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative flex flex-col items-center p-4 rounded-2xl bg-card border ${rarityColors[nft.rarity ?? 'common']} shadow-lg transition-all duration-300 backdrop-blur-lg`}
    >
      <div className="w-32 h-32 rounded-xl overflow-hidden mb-3 bg-white/10 flex items-center justify-center">
        {status === 'pending' ? (
          <Spinner size={36} />
        ) : (
          <img
            src={nft.image}
            alt={nft.name}
            className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
            style={{ filter: status === 'claimed' ? 'grayscale(1) opacity(0.7)' : 'none' }}
          />
        )}
        {status === 'claimed' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-green-400 text-3xl font-bold drop-shadow-[0_0_8px_#10b981]">✓</span>
          </motion.div>
        )}
      </div>
      <div className="w-full flex flex-col items-center gap-1">
        <div className="text-base font-semibold text-white text-center truncate w-full">{nft.name}</div>
        <div className="text-xs text-zinc-400 text-center">{nft.collection}</div>
        {nft.price !== undefined && <div className="text-xs text-green-400 font-mono">{nft.price} SOL</div>}
        {nft.rarity && (
          <div
            className={`text-xs font-bold mt-1 ${
              nft.rarity === 'legendary'
                ? 'text-fuchsia-400'
                : nft.rarity === 'rare'
                  ? 'text-blue-400'
                  : 'text-zinc-400'
            }`}
          >
            {nft.rarity.toUpperCase()}
          </div>
        )}
      </div>
      {status === 'available' && onClaim && (
        <Button variant="primary" size="sm" className="mt-4 w-full" onClick={onClaim}>
          Claim NFT
        </Button>
      )}
      {status === 'pending' && (
        <div className="mt-4 w-full flex justify-center">
          <Spinner size={20} />
        </div>
      )}
      {status === 'claimed' && <div className="mt-4 w-full text-center text-green-400 font-semibold">Claimed!</div>}
    </motion.div>
  )
}
