import dynamic from "next/dynamic"

const ClientWingsBackground = dynamic(
  () =>
    import("./ClientWingsBackground").then((mod) => mod.ClientWingsBackground),
  { ssr: false }
)

export function WingsBackground() {
  return <ClientWingsBackground />
}
