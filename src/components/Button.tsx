import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'quiet'
}

export function Button({ children, variant = 'primary', className = '', ...props }: Props) {
  return <button className={['button', 'button-' + variant, className].filter(Boolean).join(' ')} {...props}>{children}</button>
}
