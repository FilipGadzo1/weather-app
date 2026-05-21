import { render, screen, fireEvent } from '@testing-library/react'
import { MobileNav } from '../MobileNav'
import type { TabKey } from '../TabBar'

describe('MobileNav', () => {
  it('renders all four nav buttons', () => {
    render(<MobileNav active="today" onChange={jest.fn()} />)
    expect(screen.getByRole('button', { name: /today/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /week/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /atmos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /insights/i })).toBeInTheDocument()
  })

  it('calls onChange with correct key when a button is clicked', () => {
    const onChange = jest.fn()
    render(<MobileNav active="today" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /week/i }))
    expect(onChange).toHaveBeenCalledWith('week')
  })

  it('active button has aria-current="page", inactive buttons omit aria-current', () => {
    render(<MobileNav active="insights" onChange={jest.fn()} />)
    expect(screen.getByRole('button', { name: /insights/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: /today/i })).not.toHaveAttribute('aria-current')
  })
})
