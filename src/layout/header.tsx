import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/stores/dashboard"
import { UserProfileDropdown } from "@/components/auth/user-profile"
import { useAuthStore } from "@/stores/auth"

export function Header() {
    const { toggleSidebar } = useDashboardStore()
    const { user } = useAuthStore()
    console.log(user, "user from Header")

    return (
        <header className="bg-white border-b border-gray-200 px-4 py-[18px]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <div className="hidden sm:block">
                        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">{user?.phoneNumber}</span>
                    <UserProfileDropdown />
                </div>
            </div>
        </header>
    )
}
