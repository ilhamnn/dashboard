"use client"

import { useState } from "react"
import { Sidebar } from "../components/element/sidebar/sidebar";
import { TopBar } from "../components/element/topbar/top-bar";
type TabType = "market" | "watchlist" | "comparison" | "alerts"
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
      </div>
      </div>
  );
}
