'use client'
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export function NotificationPopover() {
  const [notifications, setNotifications] = useState([
    { id: "1", title: "New bid on Vintage Camera", description: "Someone placed a bid of $120 on your item", time: "5 min ago", read: false, type: "bid" },
    { id: "2", title: "You've been outbid", description: "Someone outbid you on Antique Watch", time: "10 min ago", read: false, type: "outbid" },
    { id: "3", title: "Auction ending soon", description: "Art Deco Lamp auction ends in 1 hour", time: "30 min ago", read: true, type: "ending" },
    { id: "4", title: "Congratulations! You won the auction", description: "You won the Vintage Vinyl Records auction", time: "2 hours ago", read: true, type: "won" },
    { id: "5", title: "Welcome to AuctionHub", description: "Thanks for joining our marketplace", time: "1 day ago", read: true, type: "system" },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getTypeColor = type => {
    switch (type) {
      case "bid": return "bg-primary/10 text-primary";
      case "outbid": return "bg-destructive/10 text-destructive";
      case "won": return "bg-success/10 text-success";
      case "ending": return "bg-highlight/10 text-highlight-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:text-primary">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-primary hover:text-primary/80">
              Mark all as read
            </Button>
          )}
        </div>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="p-0">
            <ScrollArea className="h-[300px]">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`flex gap-4 p-4 ${!notification.read ? "bg-primary/5" : ""}`}>
                      <div className={`mt-1 h-2 w-2 rounded-full ${!notification.read ? "bg-primary" : "bg-transparent"}`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(notification.type)}`}>{notification.type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">No notifications</div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full justify-center text-primary hover:text-primary/80 hover:bg-primary/5" asChild>
            <a href="/notifications">View all notifications</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
