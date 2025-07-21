'use client'
import { useGenerateImage } from '../hooks/useGenerateImage'

export const PromptForm = () => {
  const { prompt, setPrompt, image, loading, generate } = useGenerateImage()

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your NFT image..."
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg text-center focus:border-accent-neon focus:ring-2 focus:ring-accent-neon outline-none transition-all duration-200"
      />
      <button
        onClick={() => generate()}
        disabled={loading || !prompt}
        className="w-48 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold text-lg shadow-lg hover:from-fuchsia-500 hover:to-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {image && (
        <img src={image} alt="Generated" className="w-64 h-64 rounded-2xl object-cover border border-white/10" />
      )}
    </div>
  )
}
