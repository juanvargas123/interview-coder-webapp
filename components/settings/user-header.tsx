"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ExtendedUser } from "@/lib/hooks/use-user"

interface UserHeaderProps {
  user: ExtendedUser | null
}

export function UserHeader({ user }: UserHeaderProps) {
  const formatName = (email: string) => {
    const name = email.split("@")[0]
    const parts = name.split(".")
    return parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  }

  return (
    <div className="flex items-center gap-4 mb-12">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
        />
        <AvatarFallback className="bg-primary after:text-white text-xs">
          {user?.email?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-semibold text-white">
          {user?.email && formatName(user.email)}
        </h2>
      </div>
    </div>
  )
}
