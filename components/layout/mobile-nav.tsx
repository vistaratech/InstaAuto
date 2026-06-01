"use client"

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { useState } from "react"

export interface MobileNavProps {
    username?: string
    profilePictureUrl?: string
    onLogout?: () => void
}

export function MobileNav({ username, profilePictureUrl, onLogout }: MobileNavProps) {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r border-sidebar-border bg-sidebar w-72">
                <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                    <SheetDescription>Access dashboard navigation links and settings</SheetDescription>
                </SheetHeader>
                <Sidebar
                    className="h-full border-none bg-transparent"
                    username={username}
                    profilePictureUrl={profilePictureUrl}
                    onLogout={onLogout}
                    onNavigate={() => setOpen(false)}
                />
            </SheetContent>
        </Sheet>
    )
}
