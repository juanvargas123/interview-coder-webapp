import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import Link from "next/link"

const companyLogos = [
  {
    name: "Zoom",
    image: "/logos/zoom.png",
    width: "w-32",
    height: "h-32",
    tooltip:
      "Zoom\n(Doesn't work on versions 6.16+, downgrade if this applies to you)"
  },
  {
    name: "Hackerrank",
    image: "/logos/hackerrank.png",
    width: "w-32",
    height: "h-32",
    tooltip: "HackerRank"
  },
  {
    name: "Codesignal",
    image: "/logos/codesignal.png",
    width: "w-32",
    height: "h-32",
    tooltip: "CodeSignal"
  },
  {
    name: "CoderPad",
    image: "/logos/coderpad.png",
    width: "w-32",
    height: "h-32",
    tooltip: "CoderPad"
  },
  {
    name: "Chime",
    image: "/logos/chime.png",
    width: "w-32",
    height: "h-32",
    tooltip: "Chime"
  },
  {
    name: "Microsoft Teams",
    image: "/logos/team.png",
    width: "w-32",
    height: "h-32",
    tooltip: "Microsoft Teams"
  }
]

export const CompanySection = () => {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col items-center justify-center py-12 lg:py-20">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-white white-gradient py-2">
            Works on Everything
          </h2>
          <p className="text-lg leading-8 text-[#999999]">
            Invisible to all screen-recording softwares.
          </p>
        </div>

        <div className="w-full max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {companyLogos.map((company) => (
              <Tooltip key={company.name}>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center justify-center group cursor-pointer">
                    <div className="absolute inset-0 rounded-2xl bg-transparent group-hover:bg-gray-800/30 transition-colors duration-300 ease-out" />
                    <div className="relative p-6">
                      <img
                        src={company.image}
                        alt={company.name}
                        className={`
                          ${company.width} ${company.height} 
                          object-contain brightness-0 invert opacity-90
                          transition-all duration-300 ease-out
                          group-hover:opacity-100 group-hover:scale-105
                        `}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="font-medium">{company.name}</div>
                  {company.tooltip.includes("\n") && (
                    <div className="text-xs opacity-70 mt-1">
                      {company.tooltip.split("\n")[1]}
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8 px-4">
            * Undetectability may not work with some versions of MacOS. THIS IS
            NOT REFUNDABLE. See our{" "}
            <Link
              href="/help?section=shows-when-sharing"
              className="underline hover:text-gray-400 transition-colors"
            >
              notice
            </Link>{" "}
            for more details.
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}
