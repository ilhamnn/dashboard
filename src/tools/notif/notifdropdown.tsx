"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Trash2 } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
}

interface NotificationsDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "BTC Price Alert", message: "Bitcoin just crossed $50,000!", isRead: false },
    { id: "2", title: "ETH Price Alert", message: "Ethereum dropped below $2,500!", isRead: false },
    { id: "3", title: "SOL Price Alert", message: "Solana is up 10% today!", isRead: false },
  ])

  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  const deleteAll = () => setNotifications([])
  const deleteNotification = (id: string) => setNotifications(notifications.filter(n => n.id !== id))

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="fixed top-16 right-4 w-80 max-h-[70vh] overflow-y-auto z-50 space-y-2">
        <div className="flex justify-between items-center p-2">
          <h4 className="font-semibold">Notifications</h4>
          <Button size="sm" variant="outline" onClick={markAllAsRead}>Mark All Read</Button>
        </div>

        {notifications.length > 0 ? notifications.map(n => (
          <Card key={n.id} className={`bg-card border border-border p-3 ${n.isRead ? "opacity-50" : ""}`}>
            <CardContent className="flex justify-between items-start gap-2 p-2">
              <div>
                <p className="font-semibold text-foreground">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => deleteNotification(n.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )) : (
          <Card className="bg-background border-0">
            <CardContent className="pt-12 pb-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground mt-4">No notifications</p>
            </CardContent>
          </Card>
        )}

        {notifications.length > 0 && (
          <div className="p-2">
            <Button size="sm" variant="destructive" onClick={deleteAll} className="w-full">Delete All</Button>
          </div>
        )}
      </div>
    </>
  )
}
