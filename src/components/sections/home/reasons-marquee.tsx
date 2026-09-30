import { Marquee } from '@/components/patterns/marquee'
import { getContent } from '@/content'

/** A tilted ticker of the twelve reasons content should exist. */
export function ReasonsMarquee() {
  const { reasons } = getContent().home
  return (
    <section
      aria-labelledby="reasons-title"
      className="relative z-10 overflow-hidden py-6 layout-blocks:py-0"
    >
      <div
        data-tone="accent"
        className="-mx-4 -rotate-[1.5deg] border-y-(length:--ph-border-width) border-fg py-4 sm:py-5 layout-blocks:mx-0 layout-blocks:rotate-0"
      >
        <h2 id="reasons-title" className="sr-only">
          {reasons.label}
        </h2>
        <Marquee duration={55}>
          <ul className="flex items-center">
            {reasons.items.map((item) => (
              <li key={item} className="flex items-center">
                <span className="px-6 display-type text-[clamp(1.5rem,3vw,2.75rem)] leading-none whitespace-nowrap text-fg">
                  {item}
                </span>
                <span aria-hidden="true" className="inline-block size-3 rotate-45 bg-fg" />
              </li>
            ))}
          </ul>
        </Marquee>
      </div>
    </section>
  )
}
