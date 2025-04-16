"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, LayoutDashboard, LogOut, Settings, User } from "lucide-react";

export function UserNav({ user }) {
  // Helper function to generate initials from the user's name
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase().slice(0, 2); // e.g., "John Doe" -> "JD"
  };
  const [avatarUrl, setAvatarUrl] = useState('/default-avatar.png');

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await fetch('api/user');
        const data = await res.json();
        if (data.image) setAvatarUrl(data.image);
      } catch (error) {
        console.error('Error fetching avatar:', error);
      }
    };
    
    fetchAvatar();
  }, []);


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 border border-primary/20 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
            <AvatarImage
              src={avatarUrl}
              alt={user?.name || "User"}
              className="object-fit"
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {user?.role == 'merchant' && 
            <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          }
          <DropdownMenuItem asChild>
            <Link href="/auctions/my_auctions" className="flex items-center gap-2">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>My Auctions</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive hover:text-destructive/90"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}