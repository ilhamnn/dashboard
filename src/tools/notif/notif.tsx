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

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "BTC Price Alert", message: "Bitcoin just crossed $50,000!", isRead: false },
    { id: "2", title: "ETH Price Alert", message: "Ethereum dropped below $2,500!", isRead: false },
    { id: "3", title: "SOL Price Alert", message: "Solana is up 10% today!", isRead: false },
  ])

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const deleteAll = () => {
    setNotifications([])
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <div className="w-full p-6 space-y-4">
      {/* Actions */}
      {notifications.length > 0 && (
        <div className="flex justify-end gap-2">
          <Button size="sm" onClick={markAllAsRead} className="gap-2">
            <Bell className="w-4 h-4" />
            Mark All as Read
          </Button>
          <Button size="sm" variant="destructive" onClick={deleteAll}>
            Delete All
          </Button>
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 ? (
        notifications.map((n) => (
          <Card
            key={n.id}
            className={`bg-card border border-border p-4 ${n.isRead ? "opacity-50" : ""}`}
          >
            <CardContent className="flex justify-between items-start gap-4">
              <div>
                <p className="font-semibold text-foreground">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => deleteNotification(n.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-background border-0">
          <CardContent className="pt-12 pb-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground mt-4">No notifications</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
