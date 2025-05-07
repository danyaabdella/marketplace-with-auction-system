"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProfileReviews } from "@/components/profile/profile-reviews"
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin, Shield, Star, UserIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { State, City } from "country-state-city"


// Form schemas
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().optional(),
  stateName: z.string().min(1, { message: "State is required." }),
  cityName: z.string().min(1, { message: "City is required." }),
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
export default function ProfilePage() {
  const { toast } = useToast()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [loggedUser, setLoggedUser] = useState(null)
  const [stats, setStats] = useState({})
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [selectedStateIsoCode, setSelectedStateIsoCode] = useState("")
  
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

  // Fetch states for Ethiopia
  useEffect(() => {
    const ethiopianStates = State.getStatesOfCountry("ET")
    setStates(ethiopianStates)
  }, [])

  // Set initial selected state ISO code
  useEffect(() => {
    if (loggedUser?.stateName && states.length > 0) {
      const stateObj = states.find((state) => state.name === loggedUser.stateName)
      setSelectedStateIsoCode(stateObj ? stateObj.isoCode : "")
    }
  }, [loggedUser, states])

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedStateIsoCode) {
      const stateCities = City.getCitiesOfState("ET", selectedStateIsoCode)
      setCities(stateCities)
    } else {
      setCities([])
    }
  }, [selectedStateIsoCode])

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: loggedUser?.fullName || "",
      email: loggedUser?.email || "",
      phoneNumber: loggedUser?.phoneNumber || "",
      stateName: loggedUser?.stateName || "",
      cityName: loggedUser?.cityName || "",
    },
  })

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Form submission handlers
  async function onProfileSubmit(values) {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: loggedUser._id, ...values }),
      })
      if (!response.ok) throw new Error('Failed to update profile')
      const updatedUser = await response.json()
      setLoggedUser(updatedUser)
      toast({ title: "Profile updated", description: "Your profile information has been updated successfully." })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  async function onPasswordSubmit(values) {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: loggedUser._id, password: values.newPassword }),
      })
      if (!response.ok) throw new Error('Failed to update password')
      toast({ title: "Password updated", description: "Your password has been changed successfully." })
      passwordForm.reset({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }
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
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
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
        </div> */}

        {/* Profile Content Tabs */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid grid-cols-2 md:w-[400px]">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            {loggedUser?.role === 'merchant' && (
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            )}
            <TabsTrigger value="account settings"> Account Settings</TabsTrigger>
          </TabsList>

          {/* <TabsContent value="activity" className="mt-6">
            <ProfileActivity userId={loggedUser?.id} />
          </TabsContent> */}
          <TabsContent value="account settings" className="mt-6">
            <div className="space-y-8">
              {/* Account Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="stateName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  const stateObj = states.find((state) => state.name === value)
                                  setSelectedStateIsoCode(stateObj ? stateObj.isoCode : "")
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {states.map((state) => (
                                    <SelectItem key={state.isoCode} value={state.name}>
                                      {state.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="cityName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!selectedStateIsoCode}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your city" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {cities.map((city) => (
                                    <SelectItem key={city.name} value={city.name}>
                                      {city.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" className="gradient-bg border-0">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Security Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your current password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your new password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm your new password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <Button type="submit" className="gradient-bg border-0">
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
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

