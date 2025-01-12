import Image from "next/image"
import Link from "next/link"

export function LinkedinBadge() {
  return (
    <div className="lg:pt-0 pt-24">
      <Link
        href="https://www.linkedin.com/posts/neel-shanmugam_technical-interviews-for-software-engineering-activity-7275781351046299648-tCRy?utm_source=share&utm_medium=member_desktop"
        target="_blank"
        className="relative hover:opacity-90 transition-all items-center flex gap-4 px-8 py-2 rounded-xl bg-primary/10 text-primary mb-12 border border-primary/40 w-fit mx-auto"
        style={{
          boxShadow: "0 0 20px hsl(60 100% 50% / 0.3)"
        }}
      >
        <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur-[8px] -z-10" />
        <div>
          <Image
            alt="Linkedin Badge"
            src="/linked-in.svg"
            width="10"
            height="10"
            className="w-6 h-6 md:w-8 md:h-8"
          />
        </div>
        <div className="flex-col flex text-start h-fit">
          <span className="text-[8px] md:text-[10px] font-extrabold text-primary/90">
            LINKEDIN
          </span>
          <span
            className="text-lg md:text-xl font-bold text-primary"
            style={{
              textShadow: "0 0 10px hsl(60 100% 50% / 0.5)"
            }}
          >
            600k Impressions
          </span>
        </div>
      </Link>
    </div>
  )
}
