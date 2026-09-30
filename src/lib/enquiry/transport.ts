import { fill } from '@/lib/utils'

export type Enquiry = {
  name: string
  email: string
  phone: string
  company: string
  services: string[]
  engagement: string
  message: string
}

export type MailCopy = {
  subject: string
  greeting: string
  nameLine: string
  emailLine: string
  phoneLine: string
  companyLine: string
  servicesLine: string
  engagementLine: string
  messageLine: string
  none: string
}

export type SendResult = { ok: true } | { ok: false; error: string }

/**
 * How an enquiry leaves the site. Today it composes an email; moving to a Server
 * Action + email provider later means adding one implementation here.
 */
export interface EnquiryTransport {
  send(enquiry: Enquiry): Promise<SendResult>
}

export function buildMailto(to: string, e: Enquiry, copy: MailCopy): string {
  const v = (s: string) => (s.trim() ? s.trim() : copy.none)
  const body = [
    copy.greeting,
    '',
    fill(copy.nameLine, { value: v(e.name) }),
    fill(copy.emailLine, { value: v(e.email) }),
    fill(copy.phoneLine, { value: v(e.phone) }),
    fill(copy.companyLine, { value: v(e.company) }),
    fill(copy.servicesLine, { value: e.services.length ? e.services.join(', ') : copy.none }),
    fill(copy.engagementLine, { value: v(e.engagement) }),
    '',
    copy.messageLine,
    e.message.trim(),
  ].join('\n')
  const subject = fill(copy.subject, { name: e.name.trim() })
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function mailtoTransport(to: string, copy: MailCopy): EnquiryTransport {
  return {
    async send(enquiry) {
      window.location.href = buildMailto(to, enquiry, copy)
      return { ok: true }
    },
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type EnquiryErrors = Partial<Record<'name' | 'email' | 'message', true>>

export function validateEnquiry(e: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {}
  if (e.name.trim().length < 2) errors.name = true
  if (!EMAIL_RE.test(e.email.trim())) errors.email = true
  if (e.message.trim().length < 10) errors.message = true
  return errors
}
