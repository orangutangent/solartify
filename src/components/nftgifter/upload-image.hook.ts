import { useMutation } from '@tanstack/react-query'

interface UploadMetadataParams {
  image: string
  name: string
  description: string
}

export function useUploadMetadata() {
  return useMutation({
    mutationKey: ['upload-metadata'],
    mutationFn: async ({ image, name, description }: UploadMetadataParams) => {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, name, description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      return data.metadataUri as string
    },
  })
}
