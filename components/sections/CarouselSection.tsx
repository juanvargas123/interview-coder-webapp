import { InfiniteMovingCards } from "../ui/infinite-moving-cards"

const companyLogos = [
  {
    quote: "",
    name: "Meta",
    title: "",
    image: "/logos/meta.png"
  },
  {
    quote: "",
    name: "Apple",
    title: "",
    image: "/logos/apple.png"
  },
  {
    quote: "",
    name: "Amazon",
    title: "",
    image: "/logos/amazon.png"
  },
  {
    quote: "",
    name: "Citadel",
    title: "",
    image: "/logos/citadel.png"
  },
  {
    quote: "",
    name: "Google",
    title: "",
    image: "/logos/google.png"
  },
  {
    quote: "",
    name: "Databricks",
    title: "",
    image: "/logos/databricks.png"
  }
]

export const CarouselSection = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 lg:py-20 overflow-hidden">
      <h2 className="text-2xl lg:text-4xl font-bold text-center mb-8 ">
        Our users have gotten offers from
      </h2>
      <div className="w-full max-w-6xl">
        <InfiniteMovingCards
          items={companyLogos}
          direction="left"
          speed="fast"
        />
      </div>
    </div>
  )
}
