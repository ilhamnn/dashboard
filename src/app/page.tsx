"use client"

import { useState } from "react"
import { Sidebar } from "@/components/element/sidebar/sidebar";
import { TopBar } from "@/components/element/topbar/top-bar";
import { Market } from "@/tools/market/market";
import { Watch } from "@/tools/watch/watchlist"
import { Compare } from "@/tools/compare/compare"
import { Notifications } from "@/tools/notif/notif"
type TabType = "market" | "watchlist" | "comparison" | "notifications"
import { cn } from "@/lib/utils";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [liGhtMode, setLightMode] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("market")
  return (
      <div className={cn("flex h-screen bg-background text-foreground",!liGhtMode&&"dark")}>
        <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
           <TopBar 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          lightMode={liGhtMode}
          onToggle={() => setLightMode(!liGhtMode)}        
        />
         {/*isi content sidebar*/}
        <main className="flex-1 overflow-auto">
          {activeTab === "market" && (
            <div className="space-y-6 p-6">
              <Market />
            </div>
          )}
          {activeTab === "watchlist" && (
            <div className="space-y-6 p-6">
              <Watch />
            </div>
          )}
          {activeTab === "comparison" && (
            <div className="space-y-6 p-6">
              <Compare />
            </div>
          )}
          {activeTab === "notifications" && (
            <div className="space-y-6 p-6">
              <Notifications />
            </div>
          )}
        </main>
      </div>
      </div>
  );
}
