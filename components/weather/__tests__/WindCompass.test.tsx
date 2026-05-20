import { render } from '@testing-library/react'
import { WindCompass } from '../WindCompass'

describe('WindCompass', () => {
  it('renders SVG with rotation style for valid degrees', () => {
    const { container } = render(<WindCompass degrees={90} />)
    const g = container.querySelector('g')
    expect(g).not.toBeNull()
    expect(g?.getAttribute('transform')).toContain('rotate(90')
  })

  it('returns null for non-finite degrees', () => {
    const { container } = render(<WindCompass degrees={NaN} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders SVG element', () => {
    const { container } = render(<WindCompass degrees={0} />)
    expect(container.querySelector('svg')).not.toBeNull()
  })
})
