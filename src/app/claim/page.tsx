import { ClaimForm } from '../../features/claim/ui/ClaimForm'
import { ClaimStatus } from '../../features/claim/ui/ClaimStatus'
import { TokenBalanceWidget } from '../../features/claim/ui/TokenBalanceWidget'
import { ClaimCooldownWidget } from '../../features/claim/ui/ClaimCooldownWidget'

export default function ClaimPage() {
  return (
    <div className="max-w-md mx-auto flex flex-col gap-4 py-8">
      <TokenBalanceWidget />
      <ClaimCooldownWidget />
      <ClaimForm />
      <ClaimStatus />
    </div>
  )
}
