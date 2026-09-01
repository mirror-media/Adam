type TopicCmsStyleProps = {
  // Named `customCss` on purpose: Next.js `compiler.styledComponents` intercepts a `css` prop.
  customCss?: string | null
}

function TopicCmsStyle({ customCss }: TopicCmsStyleProps) {
  const cssText = `.topic-title{display:none}${customCss ?? ''}`
  return <style dangerouslySetInnerHTML={{ __html: cssText }} />
}

export { TopicCmsStyle }
export type { TopicCmsStyleProps }
