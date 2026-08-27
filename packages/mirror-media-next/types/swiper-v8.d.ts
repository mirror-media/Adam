// Swiper 8 publishes its declarations outside the package export map, which
// TypeScript's Bundler resolution cannot associate with the runtime entry.
declare module 'swiper' {
  export * from 'swiper/types'

  import type { SwiperModule } from 'swiper/types'
  import Swiper from 'swiper/types'

  export const A11y: SwiperModule
  export const Autoplay: SwiperModule
  export default Swiper
}
