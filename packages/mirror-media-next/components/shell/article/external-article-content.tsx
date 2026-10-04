import ExternalEmbedCodeBlock from '@/components/external/external-embed-code-block'
import ArticleRightArrow from '@/components/shared/article-right-arrow'
import type { ExternalRelatedStory } from '@/modules/external/external-types'

import styles from './external-article-content.module.css'

const IFRAME_REGEX = /(<iframe[\s\S]*?<\/iframe>)/i

type ExternalArticleContentProps = {
  content?: string
  allRelatedStories?: ExternalRelatedStory[]
}

export default function ExternalArticleContent({
  content = '',
  allRelatedStories = [],
}: ExternalArticleContentProps) {
  const parts = content.split(IFRAME_REGEX).filter((part) => part.trim())

  return (
    <div className={`mt-8 md:mt-5 ${styles.content}`}>
      {parts.map((part, index) =>
        IFRAME_REGEX.test(part) ? (
          <ExternalEmbedCodeBlock key={index} embedCode={part} />
        ) : (
          <div
            key={index}
            className="font-mm-body text-mm-body-l"
            dangerouslySetInnerHTML={{ __html: part }}
          />
        )
      )}

      {allRelatedStories.length > 0 && (
        <ArticleRightArrow relateds={allRelatedStories} />
      )}
    </div>
  )
}
