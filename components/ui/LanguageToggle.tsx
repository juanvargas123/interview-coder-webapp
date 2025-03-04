"use client"

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)
  
  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 px-4 py-2 rounded-[14px] bg-[#0e1217] border border-[#e6e619]/70 shadow-[0_0_15px_rgba(230,230,25,0.3)] focus:outline-none transition-colors duration-200">
        {/* Flag Circle */}
        <div className="relative w-6 h-6 rounded-full overflow-hidden">
          {/* US Flag (visible when English is selected) */}
          <div 
            className={cn(
              "absolute inset-0 transition-opacity duration-200",
              language === 'en' ? 'opacity-100' : 'opacity-0'
            )}
          >
            {/* American Flag */}
            <div className="w-full h-full bg-blue-600">
              {/* Red and White Stripes */}
              <div className="absolute inset-0">
                {/* 13 stripes - 7 red, 6 white */}
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
              </div>
              
              {/* Blue Canton (Union) */}
              <div className="absolute top-0 left-0 w-[40%] h-[53.85%] bg-blue-800">
                {/* Stars - simplified as white dots */}
                <div className="grid grid-cols-5 grid-rows-4 gap-[1px] p-[2px] h-full w-full">
                  {Array(20).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-center">
                      <div className="w-[2px] h-[2px] bg-white rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Indian Flag (visible when Hindi is selected) */}
          <div 
            className={cn(
              "absolute inset-0 transition-opacity duration-200",
              language === 'hi' ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 bg-orange-500"></div>
              <div className="flex-1 bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-800"></div>
              </div>
              <div className="flex-1 bg-green-600"></div>
            </div>
          </div>
        </div>
        
        {/* Language Text */}
        <span className="text-sm font-medium text-[#e6e619]">
          {language === 'en' ? 'English' : 'हिंदी'}
        </span>
        
        {/* Dropdown Icon */}
        <ChevronDown className="h-4 w-4 text-[#e6e619]" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="mt-1 overflow-hidden rounded-[14px] bg-[#0e1217] border border-[#e6e619]/70 shadow-[0_0_15px_rgba(230,230,25,0.3)]">
        {/* English Option */}
        <DropdownMenuItem 
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 cursor-pointer text-[#e6e619]",
            language === 'en' 
              ? "bg-[#0e1217] pointer-events-none" 
              : "hover:bg-[#161b25] text-gray-400"
          )}
          onClick={() => setLanguage('en')}
        >
          {/* US Flag */}
          <div className="relative w-6 h-6 rounded-full overflow-hidden">
            <div className="w-full h-full bg-blue-600">
              {/* Red and White Stripes */}
              <div className="absolute inset-0">
                {/* 13 stripes - 7 red, 6 white */}
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
                <div className="h-[7.7%] w-full bg-white"></div>
                <div className="h-[7.7%] w-full bg-red-600"></div>
              </div>
              
              {/* Blue Canton (Union) */}
              <div className="absolute top-0 left-0 w-[40%] h-[53.85%] bg-blue-800">
                {/* Stars - simplified as white dots */}
                <div className="grid grid-cols-5 grid-rows-4 gap-[1px] p-[2px] h-full w-full">
                  {Array(20).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-center">
                      <div className="w-[1px] h-[1px] bg-white rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <span className="text-sm">English</span>
        </DropdownMenuItem>
        
        {/* Hindi Option */}
        <DropdownMenuItem 
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 cursor-pointer text-[#e6e619]",
            language === 'hi' 
              ? "bg-[#0e1217] pointer-events-none" 
              : "hover:bg-[#161b25] text-gray-400"
          )}
          onClick={() => setLanguage('hi')}
        >
          {/* Indian Flag */}
          <div className="relative w-6 h-6 rounded-full overflow-hidden">
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 bg-orange-500"></div>
              <div className="flex-1 bg-white flex items-center justify-center">
                <div className="w-1px h-1px rounded-full bg-blue-800"></div>
              </div>
              <div className="flex-1 bg-green-600"></div>
            </div>
          </div>
          <span className="text-sm">हिंदी</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 