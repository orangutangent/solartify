'use client'

import { useClaimStore } from '../store/claim.store'
import { Spinner } from '../../ui/spinner'

export function ClaimStatus() {
  const { status, cooldown } = useClaimStore()

  if (status === 'pending') {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-indigo-800/80 to-fuchsia-800/60 border border-indigo-500 shadow animate-pulse">
        <Spinner className="w-5 h-5 text-indigo-300 animate-spin" />
        <span className="text-indigo-200 font-semibold">Claiming in progress...</span>
      </div>
    )
  }
  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-green-800/80 to-emerald-700/60 border border-green-500 shadow">
        <span className="text-2xl">✅</span>
        <span className="text-green-200 font-semibold">Claim successful!</span>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-red-800/80 to-pink-800/60 border border-red-500 shadow">
        <span className="text-2xl">❌</span>
        <span className="text-red-200 font-semibold">Claim failed. Try again later.</span>
      </div>
    )
  }
  if (cooldown > 0) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-yellow-800/80 to-orange-800/60 border border-yellow-500 shadow">
        <span className="text-2xl">⏳</span>
        <span className="text-yellow-200 font-semibold">Next claim available soon</span>
      </div>
    )
  }
  return null
}
