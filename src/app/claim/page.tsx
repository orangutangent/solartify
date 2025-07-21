import { ClaimForm } from '../../components/claim/ui/ClaimForm'
import { ClaimStatus } from '../../components/claim/ui/ClaimStatus'
import { TokenBalanceWidget } from '../../components/claim/ui/TokenBalanceWidget'
import { ClaimCooldownWidget } from '../../components/claim/ui/ClaimCooldownWidget'

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
