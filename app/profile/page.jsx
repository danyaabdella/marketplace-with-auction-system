"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileActivity } from "@/components/profile/profile-activity"
import { ProfileReviews } from "@/components/profile/profile-reviews"
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin, Shield, Star, UserIcon } from "lucide-react"
import { useSession } from "next-auth/react"



// Mock user data - in a real app, you would fetch this from your API
const userData = {
  
  
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loggedUser, setLoggedUser] = useState(null);
  const { data: session, status } = useSession();
  const [stats, setStats] = useState([]);
  
    // Fetch user data when session changes
    useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        setIsLoading(true); // Start loading
        console.log("Session: ", session.user.email);
        try {
          const response = await fetch('/api/user'); 
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          const user = await response.json(); 
          setLoggedUser(user); 
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
            setIsLoading(false); // Stop loading
          }  
        }
      };

    fetchUser();
  }, [session]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          wonRes,
          reviewsRes, 
          auctionsRes,
          participatedRes,
          bidsRes
        ] = await Promise.all([
          fetch('api/fetchAuctions/auctionById'),
          fetch('/api/merchant/reviews'),
          fetch('/api/user/auctions'),
          fetch('/api/user/auctions/participated'),
          fetch('/api/user/auctions/total-bids')
        ])

        const [ wonData, reviewsData, auctionsData, participatedData, bidsData] = 
          await Promise.all([
            wonRes.json(),
            reviewsRes.json(),
            auctionsRes.json(),
            participatedRes.json(),
            bidsRes.json()
          ])

        setStats({
          auctionsWon: wonData.won.length,
          averageRating: reviewsData.averageRating,
          reviewsReceived: reviewsData.totalReviews,
          auctionsCreated: auctionsData.length,
          auctionsParticipated: participatedData.length,
          totalBids: bidsData.totalBids
        })
        
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) fetchStats()
  }, [session])

  if (isLoading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-md">
              <AvatarImage src={loggedUser?.image} alt={loggedUser?.fullName} />
              <AvatarFallback className="text-4xl">{loggedUser?.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            {loggedUser?.role === "merchant" && (
              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">Merchant</Badge>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{loggedUser?.fullName}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-sm">@{loggedUser?.fullName.toLowerCase().replace(/\s+/g, "")}</span>
                </div>
              </div>
              <EditProfileDialog user={loggedUser} />
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
              {loggedUser?.stateName && loggedUser?.cityName && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {loggedUser?.cityName}, {loggedUser?.stateName}
                  </span>
                </div>
              )}
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  Joined {new Date(loggedUser?.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {loggedUser?.isEmailVerified && (
                <div className="flex items-center text-success">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="text-sm">Verified Account</span>
                </div>
              )}
              {stats.averageRating > 0 && (
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 mr-1 fill-amber-500" />
                  <span className="text-sm">
                    {stats.averageRating} ({stats.reviewsReceived} reviews)
                  </span>
                </div>
              )}
            </div>

            {loggedUser?.bio && <p className="mt-4 text-sm text-muted-foreground">{loggedUser.bio}</p>}
          </div>
        </div>

        <Separator />

        {/* Profile Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <StatCard
            title="Auctions Won"
            value={stats.auctionsWon}
            className="bg-green-50 dark:bg-green-950/20"
          />
          <StatCard
            title="Participated"
            value={stats.auctionsParticipated}
            className="bg-blue-50 dark:bg-blue-950/20"
          />
          {loggedUser?.role === 'merchant' && (
            <>
              <StatCard
                title="Created"
                value={stats.auctionsCreated}
                className="bg-purple-50 dark:bg-purple-950/20"
              />
              <StatCard title="Total Bids" value={stats.totalBids} className="bg-amber-50 dark:bg-amber-950/20" />
              <StatCard title="Reviews" value={stats.reviewsReceived} className="bg-pink-50 dark:bg-pink-950/20" />
              <StatCard
                title="Rating"
                value={stats.averageRating}
                className="bg-indigo-50 dark:bg-indigo-950/20"
              />
            </>
        )}
        </div>

        {/* Profile Content Tabs */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid grid-cols-2 md:w-[400px]">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            {loggedUser?.role === 'merchant' && (
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <ProfileActivity userId={loggedUser?.id} />
          </TabsContent>


          <TabsContent value="reviews" className="mt-6">
            <ProfileReviews userId={loggedUser?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function StatCard({ title, value, className }) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Profile Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Skeleton className="h-32 w-32 rounded-full" />

          <div className="flex-1">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />

            <div className="flex flex-wrap gap-4 mt-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>

            <Skeleton className="h-16 w-full mt-4" />
          </div>
        </div>

        <Separator />

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>

        {/* Tabs Skeleton */}
        <Skeleton className="h-10 w-[400px] mb-6" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  )
}

