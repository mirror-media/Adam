import type { StoryPost } from './story-types'

export function generateFaqJsonLd(
  items: StoryPost['faqs_algo'],
  options?: {
    lang?: string
  }
): {
  '@context': string
  '@type': string
  mainEntity: {
    '@type': string
    name: string
    acceptedAnswer: {
      '@type': string
      text: string
    }
  }[]
} | null {
  if (!items?.faqs || items.faqs.length === 0) {
    return null
  }

  const faqsJsonLd = items.faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    inLanguage: options?.lang || 'zh-TW',
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqsJsonLd,
  }
}
