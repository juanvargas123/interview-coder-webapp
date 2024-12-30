import Image from "next/image"
import Link from "next/link"

export function LinkedinBadge() {
  return (
    <Link
      href="https://www.linkedin.com/posts/neel-shanmugam_technical-interviews-for-software-engineering-activity-7275781351046299648-tCRy?utm_source=share&utm_medium=member_desktop"
      target="_blank"
      className="hover:opacity-90 transition-opacity"
    >
      <div className="items-center flex gap-4 px-8 py-2 rounded-xl bg-[#1A0A0A] text-white mb-12 border border-[#800020]/20 w-fit mx-auto">
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
          <span className="text-[8px] md:text-[10px] font-extrabold text-white/90">
            LINKEDIN
          </span>
          <span className="text-lg md:text-xl font-bold text-white">
            400k Impressions
          </span>
        </div>
      </div>
    </Link>
  )
}
