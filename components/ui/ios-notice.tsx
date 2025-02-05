"use client"

import { useState, useEffect } from 'react'
import { Button } from './button'
import { X, Mail, Repeat } from 'lucide-react'
import { track, ANALYTICS_EVENTS } from '@/lib/mixpanel'

export function IOSNotice() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if the user is on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    if (isIOS) {
      // Check if we've shown the notice before
      const hasShownNotice = localStorage.getItem('hasShownIOSNotice')
      if (!hasShownNotice) {
        setIsVisible(true)
        track(ANALYTICS_EVENTS.IOS_NOTICE_SHOWN)
      }
    }
  }, [])

  const closeBanner = () => {
    setIsVisible(false)
    localStorage.setItem('hasShownIOSNotice', 'true')
    track(ANALYTICS_EVENTS.IOS_NOTICE_CLOSED)
  }

  const sendEmailReminder = async () => {
    if (!email && !showEmailInput) {
      setShowEmailInput(true)
      return
    }

    if (!email) {
      setError('Please enter your email')
      return
    }

    try {
      const response = await fetch('/api/send-mac-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      setEmailSent(true)
      setError('')
      track(ANALYTICS_EVENTS.IOS_EMAIL_REMINDER_SENT, { email })
      
      setTimeout(() => {
        closeBanner()
      }, 2000)
    } catch (error) {
      console.error('Failed to send email:', error)
      setError('Failed to send email. Please try again.')
    }
  }

  const showHandoffSteps = () => {
    alert('To use Handoff:\n1. Make sure both devices are signed in to iCloud\n2. Enable Handoff on your Mac and iPhone\n3. Your Mac should appear in the app switcher on your iPhone')
    track(ANALYTICS_EVENTS.IOS_HANDOFF_STEPS_SHOWN)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black/90 border border-gray-800 rounded-lg p-4 shadow-lg backdrop-blur-sm z-50 animate-fade-up">
      <button 
        onClick={closeBanner}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>

      <h3 className="text-lg font-semibold text-white mb-2">
        Want to install on your Mac?
      </h3>
      
      {emailSent ? (
        <p className="text-green-400 text-sm">
          ✓ Download link sent! Check your email
        </p>
      ) : showEmailInput ? (
        <div className="space-y-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded text-white text-sm"
          />
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <Button 
            onClick={sendEmailReminder}
            className="w-full"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Download Link
          </Button>
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm mb-4">
            Visit this page from your macOS device to download
          </p>
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={sendEmailReminder}
              variant="outline"
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Download Link
            </Button>
            <Button
              onClick={showHandoffSteps}
              variant="outline" 
              className="w-full"
            >
              <Repeat className="w-4 h-4 mr-2" />
              Use Handoff
            </Button>
          </div>
        </>
      )}
    </div>
  )
} 