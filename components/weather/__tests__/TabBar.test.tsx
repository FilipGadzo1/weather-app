import { render, screen, fireEvent } from '@testing-library/react'
import { TabBar } from '../TabBar'
import type { TabKey } from '../TabBar'

describe('TabBar', () => {
  it('renders all four tab labels', () => {
    const onChange = jest.fn()
    render(<TabBar active="today" onChange={onChange} />)
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('This Week')).toBeInTheDocument()
    expect(screen.getByText('Atmosphere')).toBeInTheDocument()
    expect(screen.getByText('Insights')).toBeInTheDocument()
  })

  it('calls onChange with correct key when a tab is clicked', () => {
    const onChange = jest.fn()
    render(<TabBar active="today" onChange={onChange} />)
    fireEvent.click(screen.getByText('This Week'))
    expect(onChange).toHaveBeenCalledWith('week')
  })

  it('active tab has aria-selected="true"', () => {
    render(<TabBar active="atmosphere" onChange={jest.fn()} />)
    const atmoBtn = screen.getByRole('tab', { name: 'Atmosphere' })
    expect(atmoBtn).toHaveAttribute('aria-selected', 'true')
    const todayBtn = screen.getByRole('tab', { name: 'Today' })
    expect(todayBtn).toHaveAttribute('aria-selected', 'false')
  })
})
