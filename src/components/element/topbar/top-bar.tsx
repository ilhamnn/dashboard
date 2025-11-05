"use client"

import { useState } from "react"
import { Menu, Bell, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationsDropdown } from "@/tools/notif/notifdropdown"

interface TopBarProps {
  onMenuClick: () => void
  lightMode: boolean
  onToggle: () => void
}

export function TopBar({ onMenuClick, lightMode, onToggle }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const handleMenuClick = () => {
    onMenuClick()
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
        <div className="flex items-center gap-4 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={handleMenuClick} 
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onToggle}>
            {!lightMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setNotifOpen(true)}>
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <NotificationsDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  )
}
