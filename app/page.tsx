import { LinkedinBadge } from "@/components/ui/linked-in-badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/sections/Navbar"
import Image from "next/image"

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main className="relative overflow-hidden h-[80vh] flex flex-col items-center justify-center -mt-16 hero-gradient">
        <div className="container px-4 text-center max-w-2xl mx-auto lg:max-w-6xl">
          <LinkedinBadge />

          {/* Main Content */}
          <h2 className="text-gray-400/80 text-3xl lg:text-4xl mb-6 font-semibold">
            Meet Interview Coder
          </h2>
          <h1 className=" text-[3.5rem] mb-10 sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            <span className="white-gradient">Invisible AI for </span>{" "}
            <span className="infernal-gradient">Technical</span>{" "}
            <span className="white-gradient">Interviews</span>
          </h1>

          {/* CTA Button */}
          <div className="flex gap-12 w-full justify-center">
            <Button className="bg-[#8B0000]">
              <Image
                src="/apple.svg"
                alt="Apple"
                width={16}
                height={16}
                className="w-5 h-5"
              />
              Download (Intel Mac)
            </Button>
            <Button variant="highlight">
              <Image
                src="/apple_red.svg"
                alt="Apple"
                width={16}
                height={16}
                className="w-5 h-5"
              />
              Download (Apple Silicon)
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
