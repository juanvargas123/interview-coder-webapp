"use client"

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)
  
  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="relative w-16 h-8 rounded-full bg-gray-900 p-1 transition-colors duration-200 ease-in-out border border-primary/70 shadow-[0_0_15px_rgba(255,255,0,0.3)] focus:outline-none"
      aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
    >
      {/* Toggle Track - the oval background */}
      <div className="absolute inset-0 rounded-full bg-gray-900"></div>
      
      {/* Toggle Knob - the circle that moves */}
      <div 
        className={cn(
          "absolute top-1 w-6 h-6 rounded-full transition-transform duration-200 ease-in-out",
          language === 'en' ? 'left-1' : 'translate-x-8'
        )}
      >
        {/* US Flag (visible when English is selected) */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full overflow-hidden transition-opacity duration-200",
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
            "absolute inset-0 rounded-full overflow-hidden transition-opacity duration-200",
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
    </button>
  )
} 