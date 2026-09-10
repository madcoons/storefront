// Injects the Pinterest Tag base pixel and fires a page visit on each route
// change. Only runs when `pinterestTagId` is configured.
export default defineNuxtPlugin(() => {
  const { pinterestTagId } = useRuntimeConfig().public
  if (!pinterestTagId) return

  if (!window.pintrk) {
    const pintrk = function (...args: unknown[]) {
      pintrk.queue.push(args)
    } as unknown as PinterestTag
    pintrk.queue = []
    pintrk.version = '3.0'
    window.pintrk = pintrk

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://s.pinimg.com/ct/core.js'
    const first = document.getElementsByTagName('script')[0]
    first?.parentNode?.insertBefore(script, first)
  }

  window.pintrk('load', pinterestTagId)
  window.pintrk('page')

  const router = useRouter()
  router.afterEach(() => {
    window.pintrk?.('track', 'pagevisit')
  })
})
