"use client"

import { useState } from "react"
import { User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuthStore } from "@/stores/auth"
import { ProfileEditDialog } from "./profile-edit"

export function UserProfileDropdown() {
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
    const { logout } = useAuthStore()

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gray-100">
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Change profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ProfileEditDialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen} />
        </>
    )
}
