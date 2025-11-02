"use client"

import { useState } from "react"
import { Menu, Search, Bell, Sun, Moon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  onMenuClick: () => void
  lightMode: boolean
  onToggle: () => void
}

export function TopBar({ onMenuClick, lightMode, onToggle}: TopBarProps) {

  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        {/* Search bar */}
        <div className="relative hidden md:block flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cryptocurrencies..."
            className="pl-10 bg-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggle}>{
          !lightMode? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}