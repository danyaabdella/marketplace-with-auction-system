"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Edit2, Lock, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"

// Demo user data
const demoUser = {
  id: "1",
  fullName: "John Doe",
  email: "john@example.com",
  role: "merchant",
  image: "/placeholder.svg",
  phoneNumber: "+1234567890",
  stateName: "California",
  cityName: "Los Angeles",
  isMerchant: true,
  tinNumber: "TIN123456",
  nationalId: "ID123456",
  account_name: "John's Store",
  account_number: "1234567890",
  bank_code: "001",
}

export default function SettingsPage() {
  const [user, setUser] = useState(demoUser)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editedUser, setEditedUser] = useState(demoUser)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Replace with actual API call
      // await fetch('/api/user/settings', {
      //   method: 'PUT',
      //   body: JSON.stringify(editedUser)
      // })

      setUser(editedUser)
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // Replace with actual API call
      // await fetch('/api/user/change-password', {
      //   method: 'PUT',
      //   body: JSON.stringify(passwordForm)
      // })

      setShowPasswordDialog(false)
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast.success("Password changed successfully")
    } catch (error) {
      toast.error("Failed to change password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Replace with actual image upload logic
      setEditedUser((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }))
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Account Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setEditedUser(user)
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={isEditing ? editedUser.image : user.image} alt={user.fullName} />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <div>
                <Label
                  htmlFor="image"
                  className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/90"
                >
                  <Camera className="h-4 w-4" />
                  Change photo
                </Label>
                <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <p className="text-sm text-muted-foreground mt-1">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Full Name</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.fullName}
                    onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm mt-1 p-2 border rounded-md bg-muted">{user.fullName}</p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <p className="text-sm mt-1 p-2 border rounded-md bg-muted">{user.email}</p>
              </div>

              <div>
                <Label>Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.phoneNumber}
                    onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
                  />
                ) : (
                  <p className="text-sm mt-1 p-2 border rounded-md bg-muted">{user.phoneNumber}</p>
                )}
              </div>

              <div>
                <Label>Role</Label>
                <p className="text-sm mt-1 p-2 border rounded-md bg-muted capitalize">{user.role}</p>
              </div>

              <div>
                <Label>State</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.stateName}
                    onChange={(e) => setEditedUser({ ...editedUser, stateName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm mt-1 p-2 border rounded-md bg-muted">{user.stateName}</p>
                )}
              </div>

              <div>
                <Label>City</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.cityName}
                    onChange={(e) => setEditedUser({ ...editedUser, cityName: e.target.value })}
                  />
                ) : (
                  <p className="text-sm mt-1 p-2 border rounded-md bg-muted">{user.cityName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h3 className="font-semibold">Password</h3>
                <p className="text-sm text-muted-foreground">Change your password to keep your account secure</p>
              </div>
              <Button variant="outline" onClick={() => setShowPasswordDialog(true)} className="gap-2">
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            </div>

            {user.role === "merchant" && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Merchant Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Account Name</Label>
                      {isEditing ? (
                        <Input
                          value={editedUser.account_name}
                          onChange={(e) => setEditedUser({ ...editedUser, account_name: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm mt-1 p-2 border rounded-md bg-muted">{user.account_name}</p>
                      )}
                    </div>

                    <div>
                      <Label>Account Number</Label>
                      {isEditing ? (
                        <Input
                          value={editedUser.account_number}
                          onChange={(e) => setEditedUser({ ...editedUser, account_number: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm mt-1 p-2 border rounded-md bg-muted">{user.account_number}</p>
                      )}
                    </div>

                    <div>
                      <Label>Bank Code</Label>
                      {isEditing ? (
                        <Input
                          value={editedUser.bank_code}
                          onChange={(e) => setEditedUser({ ...editedUser, bank_code: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm mt-1 p-2 border rounded-md bg-muted">{user.bank_code}</p>
                      )}
                    </div>

                    <div>
                      <Label>TIN Number</Label>
                      <p className="text-sm mt-1 p-2 border rounded-md bg-muted">{user.tinNumber}</p>
                    </div>

                    <div>
                      <Label>National ID</Label>
                      <p className="text-sm mt-1 p-2 border rounded-md bg-muted">{user.nationalId}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input
                id="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Change Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

