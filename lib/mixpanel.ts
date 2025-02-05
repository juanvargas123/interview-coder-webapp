import mixpanel from "mixpanel-browser"

// Initialize Mixpanel with your project token
if (typeof window !== "undefined") {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "", {
    debug: process.env.NODE_ENV === "development",
    track_pageview: true,
    persistence: "localStorage",
    api_host: "https://api-eu.mixpanel.com",
    property_blacklist: ["$current_url", "$initial_referrer", "$referrer"]
  })
}

// Define event names as constants to avoid typos
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "Page View",
  CHECKOUT_PAGE_VIEW: "Checkout Page View",
  WINDOWS_WAITLIST_CLICK: "Windows Waitlist Click",
  MAC_DOWNLOAD_CLICK: "Mac Download Click",
  MAC_DOWNLOAD_OPTION_CLICK: "Mac Download Option Click",
  SUBSCRIBE_BUTTON_CLICK: "Subscribe Button Click",
  SIGNIN_PAGE_VIEW: "Sign In Page View",
  IOS_NOTICE_SHOWN: "iOS Notice Shown",
  IOS_NOTICE_CLOSED: "iOS Notice Closed",
  IOS_EMAIL_REMINDER_SENT: "iOS Email Reminder Sent",
  IOS_HANDOFF_STEPS_SHOWN: "iOS Handoff Steps Shown",
  MAC_DOWNLOAD_LINK_EMAIL_SENT: "Mac Download Link Email Sent"
} as const

// Type for our event names
export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

// Track an event with optional properties
export const track = (
  event: AnalyticsEvent,
  properties?: Record<string, any>
) => {
  try {
    console.log("🔍 Tracking event:", event, properties)
    mixpanel.track(event, {
      ...properties,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : ""
    })
    console.log("✅ Event tracked successfully")
  } catch (error) {
    console.error("❌ Mixpanel tracking error:", error)
  }
}

// Track page views
export const trackPageView = (pageName: string) => {
  track(ANALYTICS_EVENTS.PAGE_VIEW, { page: pageName })
}

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  try {
    console.log("🔍 Setting user properties:", properties)
    mixpanel.people.set(properties)
    console.log("✅ User properties set successfully")
  } catch (error) {
    console.error("❌ Mixpanel set properties error:", error)
  }
}

// Get user properties
export const getUserProperties = async () => {
  try {
    console.log("🔍 Getting user properties")
    const distinctId = mixpanel.get_distinct_id()
    if (!distinctId) {
      console.warn("⚠️ No distinct ID found")
      return null
    }
    return await new Promise((resolve) => {
      mixpanel.get_property(
        "$properties",
        (properties: Record<string, any>) => {
          console.log("✅ User properties retrieved successfully:", properties)
          resolve(properties)
        }
      )
    })
  } catch (error) {
    console.error("❌ Mixpanel get properties error:", error)
    return null
  }
}

// Identify a user
export const identify = (userId: string) => {
  try {
    console.log("🔍 Identifying user:", userId)
    mixpanel.identify(userId)
    console.log("✅ User identified successfully")
  } catch (error) {
    console.error("❌ Mixpanel identify error:", error)
  }
}

// Reset user identification
export const reset = () => {
  try {
    console.log("🔍 Resetting user identification")
    mixpanel.reset()
    console.log("✅ User reset successfully")
  } catch (error) {
    console.error("❌ Mixpanel reset error:", error)
  }
}
