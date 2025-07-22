import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ellipsify(str = '', len = 4, delimiter = '..') {
  const strLen = str.length
  const limit = len * 2 + delimiter.length

  return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str
}

export async function getNftImageUrl(uri: string): Promise<string | undefined> {
  try {
    const response = await fetch(uri)
    if (!response.ok) {
      throw new Error(`Failed to fetch NFT metadata from ${uri}`)
    }
    const metadata = await response.json()
    return metadata.image
  } catch (error) {
    console.error('Error fetching NFT image:', error)
    return undefined
  }
}
