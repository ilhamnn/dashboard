"use client"

import { TrendingUp, Eye, GitCompare, Bell, Wallet, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: any) => void
  isOpen: boolean
  onToggle: () => void
}

const tabs = [
  { id: "market", label: "Market", icon: TrendingUp },
  { id: "watchlist", label: "Watchlist", icon: Eye },
  { id: "comparison", label: "Compare", icon: GitCompare },
  { id: "notifications", label: "Notifications", icon: Bell },  
]


export function Sidebar({ activeTab, onTabChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
   
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-40" onClick={onToggle} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:relative bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-50 transition-all duration-300 flex flex-col",
          isOpen ? "w-64" : "w-0 md:w-16",
          "h-screen overflow-hidden",
        )}
      >
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <div className={cn("p-6", !isOpen && "md:p-2 md:pt-6")}>
            <div className={cn("flex items-center gap-2 mb-8", !isOpen && "md:justify-center md:mb-6")}>
              <div className="w-8 h-8 bg-[#51d425] from-primary to-accent rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              {isOpen && <span className="text-lg font-bold whitespace-nowrap">watchCryp</span>}
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg transition-colors",
                      isOpen ? "px-4 py-3 justify-start" : "md:px-0 md:py-2 md:justify-center",
                      activeTab === tab.id
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                    )}
                    title={!isOpen ? tab.label : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {isOpen && <span className="whitespace-nowrap">{tab.label}</span>}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Bottom section */}
        <div className={cn("border-t border-sidebar-border", isOpen ? "p-4" : "md:p-2")}>
          {/* Market Status - only when open */}
     

          {/* Toggle button - Desktop */}
          <button
            onClick={onToggle}
            className={cn(
              "hidden md:flex items-center justify-center rounded-lg bg-sidebar-accent hover:bg-sidebar-primary/50 transition-colors",
              isOpen ? "w-full gap-2 px-3 py-2" : "w-full py-2",
            )}
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Collapse</span>
              </>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </>
  )
}