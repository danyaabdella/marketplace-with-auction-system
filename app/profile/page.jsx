

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
import { Calendar, MapPin, Shield, Star, UserIcon, Eye, EyeOff } from "lucide-react"
import { useSession } from "next-auth/react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
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

const ProfilePage = () => {
  const { toast } = useToast()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [loggedUser, setLoggedUser] = useState(null)
  const [stats, setStats] = useState({})
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [selectedStateIsoCode, setSelectedStateIsoCode] = useState("")
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Fetch user data when session changes
  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        setIsLoading(true)
        console.log("Session: ", session.user.email)
        try {
          const response = await fetch('/api/user')
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`)
          }
          const user = await response.json()
          setLoggedUser(user)
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchUser()
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

  

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Function to toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
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

        {/* Profile Content Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-2 md:w-[400px]">
            {/* <TabsTrigger value="activity">Activity</TabsTrigger> */}
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          {/* Personal Information Tab */}
          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="text-sm">{loggedUser.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-sm">{loggedUser.email}</p>
                  </div>
                  {loggedUser.phoneNumber && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p className="text-sm">{loggedUser.phoneNumber}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-sm">{loggedUser.cityName}, {loggedUser.stateName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Joined</p>
                    <p className="text-sm">{new Date(loggedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                  {loggedUser.bio && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Bio</p>
                      <p className="text-sm">{loggedUser.bio}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security" className="mt-6">
            <div className="space-y-8">
              {/* Account Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
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
                              <div className="relative">
                                <Input
                                  type={showPassword.current ? "text" : "password"}
                                  placeholder="Enter your current password"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                  onClick={() => togglePasswordVisibility("current")}
                                >
                                  {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  <span className="sr-only">
                                    {showPassword.current ? "Hide password" : "Show password"}
                                  </span>
                                </Button>
                              </div>
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
                              <div className="relative">
                                <Input
                                  type={showPassword.new ? "text" : "password"}
                                  placeholder="Enter your new password"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                  onClick={() => togglePasswordVisibility("new")}
                                >
                                  {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  <span className="sr-only">
                                    {showPassword.new ? "Hide password" : "Show password"}
                                  </span>
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>Password must be at least 8 characters long.</FormDescription>
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
                              <div className="relative">
                                <Input
                                  type={showPassword.confirm ? "text" : "password"}
                                  placeholder="Confirm your new password"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                  onClick={() => togglePasswordVisibility("confirm")}
                                >
                                  {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  <span className="sr-only">
                                    {showPassword.confirm ? "Hide password" : "Show password"}
                                  </span>
                                </Button>
                              </div>
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

        {/* Tabs Skeleton */}
        <Skeleton className="h-10 w-[400px] mb-6" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  )
}
export default ProfilePage;