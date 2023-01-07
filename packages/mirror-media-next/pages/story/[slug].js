export default function Story({ slug }) {
  return <div>這是story頁{slug}</div>
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ params }) {
  const { slug } = params
  return {
    props: {
      slug,
    },
  }
}
