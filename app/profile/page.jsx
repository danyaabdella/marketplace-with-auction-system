"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileActivity } from "@/components/profile/profile-activity"
import { ProfileAuctions } from "@/components/profile/profile-auctions"
import { ProfileReviews } from "@/components/profile/profile-reviews"
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin, Shield, Star, UserIcon } from "lucide-react"

// Mock user data - in a real app, you would fetch this from your API
const userData = {
  id: "user123",
  fullName: "John Doe",
  email: "john.doe@example.com",
  role: "merchant",
  image: "/placeholder.svg?height=200&width=200",
  joinDate: "January 2023",
  isMerchant: true,
  isEmailVerified: true,
  stateName: "New York",
  cityName: "New York City",
  phoneNumber: "+1 (555) 123-4567",
  bio: "Passionate collector and seller of vintage items. I specialize in rare collectibles and antiques with over 10 years of experience in the auction industry.",
  stats: {
    auctionsWon: 24,
    auctionsParticipated: 87,
    auctionsCreated: 56,
    totalBids: 142,
    reviewsReceived: 38,
    averageRating: 4.8,
  },
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, you would fetch user data here
  // const [userData, setUserData] = useState(null)
  // const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   async function fetchUserData() {
  //     try {
  //       const response = await fetch('/api/user/profile')
  //       const data = await response.json()
  //       setUserData(data)
  //     } catch (error) {
  //       console.error('Error fetching user data:', error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //
  //   fetchUserData()
  // }, [])

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
              <AvatarImage src={userData.image} alt={userData.fullName} />
              <AvatarFallback className="text-4xl">{userData.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            {userData.role === "merchant" && (
              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">Merchant</Badge>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{userData.fullName}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-sm">@{userData.fullName.toLowerCase().replace(/\s+/g, "")}</span>
                </div>
              </div>
              <EditProfileDialog user={userData} />
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
              {userData.stateName && userData.cityName && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {userData.cityName}, {userData.stateName}
                  </span>
                </div>
              )}
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">Joined {userData.joinDate}</span>
              </div>
              {userData.isEmailVerified && (
                <div className="flex items-center text-success">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="text-sm">Verified Account</span>
                </div>
              )}
              {userData.stats.averageRating > 0 && (
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 mr-1 fill-amber-500" />
                  <span className="text-sm">
                    {userData.stats.averageRating.toFixed(1)} ({userData.stats.reviewsReceived} reviews)
                  </span>
                </div>
              )}
            </div>

            {userData.bio && <p className="mt-4 text-sm text-muted-foreground">{userData.bio}</p>}
          </div>
        </div>

        <Separator />

        {/* Profile Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <StatCard
            title="Auctions Won"
            value={userData.stats.auctionsWon}
            className="bg-green-50 dark:bg-green-950/20"
          />
          <StatCard
            title="Participated"
            value={userData.stats.auctionsParticipated}
            className="bg-blue-50 dark:bg-blue-950/20"
          />
          {userData.isMerchant && (
            <StatCard
              title="Created"
              value={userData.stats.auctionsCreated}
              className="bg-purple-50 dark:bg-purple-950/20"
            />
          )}
          <StatCard title="Total Bids" value={userData.stats.totalBids} className="bg-amber-50 dark:bg-amber-950/20" />
          <StatCard title="Reviews" value={userData.stats.reviewsReceived} className="bg-pink-50 dark:bg-pink-950/20" />
          <StatCard
            title="Rating"
            value={userData.stats.averageRating.toFixed(1)}
            className="bg-indigo-50 dark:bg-indigo-950/20"
          />
        </div>

        {/* Profile Content Tabs */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid grid-cols-2 md:w-[400px]">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <ProfileActivity userId={userData.id} />
          </TabsContent>

          <TabsContent value="auctions" className="mt-6">
            <ProfileAuctions userId={userData.id} isMerchant={userData.isMerchant} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ProfileReviews userId={userData.id} />
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

