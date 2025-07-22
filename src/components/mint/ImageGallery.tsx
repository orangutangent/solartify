'use client'
import { Button } from '@/components/ui/button'
import { DigitalAssetWithToken } from '@metaplex-foundation/mpl-token-metadata'
import { Image as ImageIcon, Send, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getNftImageUrl } from '@/lib/utils'
import Image from 'next/image'

interface ImageGalleryProps {
  nfts: DigitalAssetWithToken[]
  showSendModal: boolean
  setShowSendModal: (v: boolean) => void
  sendAddress: string
  setSendAddress: (v: string) => void
  sendStatus: 'idle' | 'success' | 'error'
  handleSendNft: () => Promise<void>
}

export function ImageGallery({
  nfts,
  showSendModal,
  setShowSendModal,
  sendAddress,
  setSendAddress,
  sendStatus,
  handleSendNft,
}: ImageGalleryProps) {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    nfts.forEach(async (nft) => {
      if (nft.metadata.uri && !imageUrls[nft.token.publicKey]) {
        const url = await getNftImageUrl(nft.metadata.uri)
        if (url) {
          setImageUrls((prev) => ({ ...prev, [nft.token.publicKey]: url }))
        }
      }
    })
  }, [nfts, imageUrls])

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="grid grid-cols-2 gap-4 w-full">
        {nfts.map((nft) => (
          <div
            key={nft.token.publicKey}
            className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4 relative"
          >
            <div className="w-28 h-28 rounded-lg bg-zinc-900 flex items-center justify-center">
              {imageUrls[nft.token.publicKey] ? (
                <Image
                  src={imageUrls[nft.token.publicKey.toString()]}
                  alt={nft.metadata.name}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full rounded-lg"
                />
              ) : (
                <ImageIcon className="w-10 h-10 opacity-30" />
              )}
            </div>
            <div className="text-sm text-white font-semibold truncate w-full text-center">{nft.metadata.name}</div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setShowSendModal(true)}
              aria-label="Send NFT"
            >
              <Send className="w-5 h-5 text-accent-neon" />
            </Button>
          </div>
        ))}
      </div>
      {/* Send NFT Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#18181b] border border-white/10 rounded-2xl p-8 flex flex-col gap-4 min-w-[320px] relative">
            <button
              className="absolute top-3 right-3 text-zinc-400 hover:text-white transition-colors"
              onClick={() => {
                setShowSendModal(false)
                setSendAddress('')
              }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 text-accent-neon" /> Send NFT
            </div>
            <input
              type="text"
              value={sendAddress}
              onChange={(e) => setSendAddress(e.target.value)}
              placeholder="Recipient address"
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-base text-center focus:border-accent-neon focus:ring-2 focus:ring-accent-neon outline-none transition-all duration-200"
            />
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSendNft}
              loading={sendStatus === 'idle' ? false : sendStatus === 'success' ? false : true}
              disabled={!sendAddress}
            >
              Send NFT
            </Button>
            {sendStatus === 'success' && <span className="text-green-400 text-sm">Sent!</span>}
            {sendStatus === 'error' && <span className="text-red-400 text-sm">Error. Try again.</span>}
          </div>
        </div>
      )}
    </div>
  )
}
