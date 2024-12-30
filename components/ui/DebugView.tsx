"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

const DebugView = () => {
  return (
    <div className="relative space-y-3 px-4 py-3">
      <div className="w-full text-sm text-white bg-black/60 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="rounded-lg overflow-hidden">
          <div className="px-4 py-3 space-y-4">
            {/* Thoughts Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white/90">
                What I Changed (Read these aloud)
              </h3>
              <div className="space-y-3">
                <div className="space-y-1 text-white/80 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-400/80 mt-2 shrink-0" />
                    <div>
                      The current solution uses nested loops, resulting in O(n²)
                      time complexity.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-400/80 mt-2 shrink-0" />
                    <div>
                      We can optimize this by using a hash map to store
                      previously seen numbers.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-400/80 mt-2 shrink-0" />
                    <div>
                      This reduces time complexity to O(n) with O(n) space
                      trade-off.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solutions Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* Before Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white/90">
                  Before (Brute Force)
                </h3>
                <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language="python"
                    style={oneDark}
                    customStyle={{
                      background: "transparent",
                      padding: "16px",
                      margin: 0,
                      borderRadius: 0,
                      fontSize: "12px"
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                    wrapLongLines={true}
                  >
                    {`def twoSum(nums: List[int], target: int) -> List[int]:
    n = len(nums)
    # Check every possible pair
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []  # No solution found`}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* After Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white/90">
                  After (Optimized)
                </h3>
                <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language="python"
                    style={oneDark}
                    customStyle={{
                      background: "transparent",
                      padding: "16px",
                      margin: 0,
                      borderRadius: 0,
                      fontSize: "12px"
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                    wrapLongLines={true}
                  >
                    {`def twoSum(nums: List[int], target: int) -> List[int]:
    seen = {}  # Value -> Index mapping
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # No solution found`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white/90">Complexity</h3>
              <div className="space-y-3">
                <div className="space-y-1 text-white/80 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-400/80 mt-2 shrink-0" />
                    <div>Time Complexity: O(n)</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-400/80 mt-2 shrink-0" />
                    <div>Space Complexity: O(n)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DebugView
