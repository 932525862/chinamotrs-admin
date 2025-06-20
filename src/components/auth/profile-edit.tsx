"use client"

import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/stores/auth"
import { toast } from "sonner"

interface ProfileEditDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ProfileEditDialog({ open, onOpenChange }: ProfileEditDialogProps) {
    const [phoneNumber, setPhoneNumber] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [activeTab, setActiveTab] = useState("phone")

    const { user } = useAuthStore()

    const { updateProfile, isLoading, error, clearError } = useAuthStore()
    const handlePhoneUpdate = async () => {
        if (!phoneNumber.trim()) {
            toast.error("Please enter a phone number")
            return
        }

        if (!user?.id) {
            toast.error("User ID is missing")
            return
        }
        const success = await updateProfile({ phoneNumber: phoneNumber.trim() }, user.id)

        if (success) {
            toast.success("Phone number updated successfully")
            setPhoneNumber("")
            onOpenChange(false)
        } else {
            toast.error(error || "Failed to update phone number")
        }
    }

    const handlePasswordUpdate = async () => {
        if (!newPassword) {
            toast.error("Please enter a new password")
            return
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        if (!user?.id) {
            toast.error("User ID is missing")
            return
        }

        const success = await updateProfile({ password: newPassword }, user.id)

        if (success) {
            toast.success("Password updated successfully")
            setNewPassword("")
            onOpenChange(false)
        } else {
            toast.error(error || "Failed to update password")
        }
    }

    const handleClose = () => {
        setPhoneNumber("")
        setNewPassword("")
        setActiveTab("phone")
        clearError()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Update your phone number or change your password.</DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="phone">Phone Number</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>

                    <TabsContent value="phone" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">New Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                placeholder="Enter new phone number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button onClick={handlePhoneUpdate} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Phone
                            </Button>
                        </DialogFooter>
                    </TabsContent>

                    <TabsContent value="password" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button onClick={handlePasswordUpdate} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Password
                            </Button>
                        </DialogFooter>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
