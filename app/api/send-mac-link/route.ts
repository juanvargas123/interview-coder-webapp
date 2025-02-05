import { NextResponse } from 'next/server'
import { track, ANALYTICS_EVENTS } from '@/lib/mixpanel'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Here you would integrate with your email service provider
    // For example, using SendGrid, Postmark, etc.
    // For now, we'll just simulate success
    
    // Track the email sent event
    track(ANALYTICS_EVENTS.MAC_DOWNLOAD_LINK_EMAIL_SENT, { email })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
} 