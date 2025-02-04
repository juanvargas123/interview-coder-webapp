import create from "zustand"

interface User {
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  isPro: boolean
}

interface AuthState {
  user: User | null
  signOut: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  signOut: async () => {
    // Clear user data
    set({ user: null })
    // Clear any auth tokens from localStorage
    localStorage.removeItem("auth_token")
  }
}))

// Initialize auth state from localStorage/cookies on mount
if (typeof window !== "undefined") {
  const token = localStorage.getItem("auth_token")
  if (token) {
    // Here you would typically validate the token and fetch user data
    // For now, we'll just set a mock user
    useAuth.setState({
      user: {
        email: "user@example.com",
        firstName: "John",
        lastName: "Doe",
        isPro: true
      }
    })
  }
}
