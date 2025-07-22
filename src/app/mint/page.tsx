'use client'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { MintForm, ImageGallery } from '@/components/mint'
import { useNftGifterProgram } from '@/components/nftgifter/nftgifter-data-access'
import { useUploadMetadata } from '@/components/nftgifter/upload-image.hook'

const mockNfts = [
  { id: '1', name: 'My NFT #1', image: '' },
  { id: '2', name: 'My NFT #2', image: '' },
]

export default function MintPage() {
  const [tab, setTab] = useState<'mint' | 'gallery'>('mint')
  const [minting, setMinting] = useState(false)
  const [mintStatus, setMintStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [sendAddress, setSendAddress] = useState('')
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showSendModal, setShowSendModal] = useState(false)
  const { mintNft } = useNftGifterProgram()
  const uploadMetadata = useUploadMetadata()

  async function handleMint({ image, name, description }: { image: string; name: string; description: string }) {
    setMinting(true)
    setMintStatus('idle')
    try {
      // 1. Загрузка картинки и метаданных на сервер
      const metadataUri = await uploadMetadata.mutateAsync({ image, name, description })
      // 2. Минт NFT с ссылкой на метаданные
      await mintNft.mutateAsync({ name, description, metadataUri })
      setMintStatus('success')
    } catch (e) {
      setMintStatus('error')
      console.error('Mint error:', e)
    } finally {
      setMinting(false)
    }
  }

  async function handleSendNft() {
    setSendStatus('idle')
    try {
      // await fetch('/api/send-nft', { method: 'POST', body: JSON.stringify({ to: sendAddress }) })
      await new Promise((r) => setTimeout(r, 1000))
      setSendStatus('success')
      setTimeout(() => {
        setShowSendModal(false)
        setSendAddress('')
        setSendStatus('idle')
      }, 1200)
    } catch {
      setSendStatus('error')
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-12 px-2 bg-gradient-to-b from-[#0a0a0a] to-[#18181b]">
      <div className="max-w-xl w-full flex flex-col gap-8">
        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-2">
          <button
            className={`px-6 py-2 rounded-xl font-semibold transition-all text-base flex items-center gap-2 ${tab === 'mint' ? 'bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-glow scale-105' : 'bg-white/5 text-zinc-300 hover:bg-white/10'}`}
            onClick={() => setTab('mint')}
          >
            Mint
          </button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold transition-all text-base flex items-center gap-2 ${tab === 'gallery' ? 'bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white shadow-glow scale-105' : 'bg-white/5 text-zinc-300 hover:bg-white/10'}`}
            onClick={() => setTab('gallery')}
          >
            Gallery
          </button>
        </div>
        {/* Mint tab */}
        {tab === 'mint' && <MintForm onMint={handleMint} minting={minting} mintStatus={mintStatus} />}
        {/* Gallery tab */}
        {tab === 'gallery' && (
          <ImageGallery
            nfts={mockNfts}
            showSendModal={showSendModal}
            setShowSendModal={setShowSendModal}
            sendAddress={sendAddress}
            setSendAddress={setSendAddress}
            sendStatus={sendStatus}
            handleSendNft={handleSendNft}
          />
        )}
        {/* Информация */}
        <Card className="flex flex-col items-center p-6 gap-2">
          <span className="flex items-center gap-2 text-zinc-400 text-sm">
            <Info className="w-5 h-5 text-accent-neon" /> Info
          </span>
          <ul className="text-zinc-400 text-base list-disc pl-6 space-y-1 text-left w-full max-w-md">
            <li>Generate unique NFT art using AI (coming soon).</li>
            <li>Mint and view your NFTs in the gallery tab.</li>
            <li>Send your NFTs to any Solana address.</li>
            <li>All NFTs are minted on-chain and belong only to you.</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
