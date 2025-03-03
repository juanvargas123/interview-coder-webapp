"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language } from './translations'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // Load language preference from localStorage if available
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('language', language)
  }, [language])

  const t = (key: string): string => {
    // Split the key by dots to access nested properties
    const keys = key.split('.')
    let value: any = translations[language]

    // Navigate through the nested properties
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k]
      } else {
        // If translation not found, return the key itself
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    return value
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 