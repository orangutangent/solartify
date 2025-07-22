import { Button } from '@/components/ui/button'
import { Image as ImageIcon } from 'lucide-react'
import { useGenerateImage } from '@/components/ai-image'
import { useState } from 'react'

interface MintFormProps {
  onMint: (params: { image: string; name: string; description: string }) => Promise<void>
  minting: boolean
  mintStatus: 'idle' | 'success' | 'error'
}

export function MintForm({ onMint, minting, mintStatus }: MintFormProps) {
  const { prompt, setPrompt, image, loading, generate, status } = useGenerateImage()
  const [description, setDescription] = useState('')
  return (
    <div className="flex flex-col items-center gap-6">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="NFT Name (prompt)"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg text-center focus:border-accent-neon focus:ring-2 focus:ring-accent-neon outline-none transition-all duration-200"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg text-center focus:border-accent-neon focus:ring-2 focus:ring-accent-neon outline-none transition-all duration-200"
      />
      <div className="w-64 h-64 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 text-4xl">
        {image ? (
          <img src={image} alt="NFT preview" className="object-cover w-full h-full rounded-2xl" />
        ) : (
          <ImageIcon className="w-16 h-16 opacity-40" />
        )}
      </div>
      <div className="flex justify-center gap-3 w-full items-center">
        <Button
          variant="secondary"
          size="lg"
          loading={loading}
          className="w-48"
          onClick={() => generate()}
          type="button"
          disabled={!prompt}
        >
          {image ? 'Regenerate' : 'Generate'}
        </Button>
        <Button
          variant="primary"
          size="lg"
          loading={minting}
          className="w-48"
          onClick={() => onMint({ image: image || '', name: prompt, description })}
          type="button"
          disabled={!image || !prompt}
        >
          Mint NFT
        </Button>
      </div>
      {status === 'error' && <span className="text-red-400 text-sm mt-2">Generation failed. Try again.</span>}
      {mintStatus === 'success' && <span className="text-green-400 text-sm mt-2">NFT minted! (demo)</span>}
      {mintStatus === 'error' && <span className="text-red-400 text-sm mt-2">Mint failed. Try again.</span>}
    </div>
  )
}
