import { describe, expect, it } from 'vitest'
import { getContent } from '@/content'
import { buildMailto, validateEnquiry, type Enquiry } from './transport'

const base: Enquiry = {
  name: 'Asha Rao',
  email: 'asha@example.com',
  phone: '',
  company: 'Coastal Café',
  services: ['Video Production', 'Photography'],
  engagement: 'A campaign',
  message: 'A launch film and photos for our new menu.',
}

describe('enquiry transport', () => {
  const copy = getContent().contact.form.mail

  it('composes an encoded mailto with every field', () => {
    const url = buildMailto('team.powerhousestudios@gmail.com', base, copy)
    expect(url.startsWith('mailto:team.powerhousestudios@gmail.com?subject=')).toBe(true)
    const body = decodeURIComponent(url.split('&body=')[1] ?? '')
    expect(body).toContain('Asha Rao')
    expect(body).toContain('Video Production, Photography')
    expect(body).toContain(`Phone: ${copy.none}`)
    expect(decodeURIComponent(url.split('subject=')[1]?.split('&')[0] ?? '')).toBe(
      'Project enquiry from Asha Rao',
    )
  })

  it('validates name, email and message', () => {
    expect(validateEnquiry(base)).toEqual({})
    expect(validateEnquiry({ ...base, name: 'A', email: 'nope', message: 'hi' })).toEqual({
      name: true,
      email: true,
      message: true,
    })
  })
})
