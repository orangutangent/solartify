import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/dialog'
import { ReactNode } from 'react'

export function AppModal({
  children,
  title,
  submit,
  submitDisabled,
  submitLabel,
  isOpen,
  onClose,
}: {
  children: ReactNode
  title: string
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="grid gap-4 py-4">{children}</div>
      {submit ? (
        <Button type="submit" onClick={submit} disabled={submitDisabled}>
          {submitLabel || 'Save'}
        </Button>
      ) : null}
    </Modal>
  )
}
