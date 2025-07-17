import { create } from 'zustand'
import { ClaimStatus } from '../model/claim.model'

type ClaimStore = {
  status: ClaimStatus
  cooldown: number
  setStatus: (status: ClaimStatus) => void
  setCooldown: (cooldown: number) => void
  reset: () => void
}

export const useClaimStore = create<ClaimStore>((set) => ({
  status: 'idle',
  cooldown: 0,
  setStatus: (status) => set({ status }),
  setCooldown: (cooldown) => set({ cooldown }),
  reset: () => set({ status: 'idle', cooldown: 0 }),
}))
