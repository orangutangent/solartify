import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { generateImage } from '../data-access/generateImage'

export const useGenerateImage = () => {
  const [prompt, setPrompt] = useState('')
  const mutation = useMutation({
    mutationFn: async () => generateImage(prompt),
  })
  return {
    prompt,
    setPrompt,
    image: mutation.data ?? null,
    loading: mutation.isPending,
    generate: mutation.mutateAsync,
    status: mutation.status,
    error: mutation.error,
  }
}
