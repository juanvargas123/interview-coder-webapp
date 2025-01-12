export function WindowsLogo() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-black relative overflow-hidden rounded-lg transform transition-transform hover:scale-105"
            style={{
              boxShadow: "0 0 40px rgba(255, 0, 0, 0.3)"
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(45deg, rgba(255,0,0,0.2) 0%, rgba(255,0,0,0.4) 100%)",
                filter: "blur(4px)"
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(45deg, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.2) 100%)",
                backdropFilter: "blur(8px)"
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
