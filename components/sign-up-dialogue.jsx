"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"
import { Eye, EyeOff } from "lucide-react"
import { VerifyEmailDialog } from "./verify-email-dialogue";
import { State, City } from "country-state-city"

export function SignUpDialog({ open, onOpenChange, onSignIn }) {
  const [role, setRole] = useState("customer")
  const [showVerifyEmail, setShowVerifyEmail] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [bankAccounts, setBankAccounts] = useState([])
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    countryCode: "ET", // Ethiopia
    stateName: "",
    cityName: "",
    tinNumber: null,
    nationalId: null,
    account_name: "",
    account_number: "",
    bank_code: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get states of Ethiopia
    const ethiopiaStates = State.getStatesOfCountry("ET")
    setStates(ethiopiaStates)
  }, [])

  useEffect(() => {
    // Get cities of selected state
    if (formData.stateName) {
      const stateCities = City.getCitiesOfState("ET", formData.stateName)
      setCities(stateCities)
    }
  }, [formData.stateName])

  useEffect(() => {
    // Fetch bank accounts from API
    const fetchBankAccounts = async () => {
      try {
        const response = await fetch("/api/bank-accounts")
        const data = await response.json()
        setBankAccounts(data)
        // You can set the bank code here based on the selected account
        if (data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            bank_code: data[0].code, // Set default bank code
          }))
        }
      } catch (error) {
        console.error("Failed to fetch bank accounts:", error)
      }
    }

    if (role === "merchant") {
      fetchBankAccounts()
    }
  }, [role])

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      // Implement Google sign-up logic here
      toast.success("Successfully signed up with Google!")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to sign up with Google")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }
    if (role === "merchant") {
      if (!formData.tinNumber || !formData.nationalId || !formData.account_name || !formData.account_number) {
        toast.error("Please fill in all merchant fields")
        setIsLoading(false)
        return
      }
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("fullName", formData.fullName)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("password", formData.password)
      formDataToSend.append("phoneNumber", formData.phoneNumber)
      formDataToSend.append("countryCode", formData.countryCode)
      formDataToSend.append("stateName", formData.stateName)
      formDataToSend.append("cityName", formData.cityName)
      formDataToSend.append("role", role)
      if (role === "merchant") {
        formDataToSend.append("tinNumber", formData.tinNumber)
        formDataToSend.append("nationalId", formData.nationalId)
        formDataToSend.append("account_name", formData.account_name)
        formDataToSend.append("account_number", formData.account_number)
        formDataToSend.append("bank_code", formData.bank_code)
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formDataToSend,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Sign up failed")
      }

      toast.success("Account created successfully! Please verify your email.")
      setShowVerifyEmail(true)
      onOpenChange(false)
    } catch (error) {
      toast.error(error.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Create your account</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-0">
            <Button variant="outline" disabled={isLoading} onClick={handleGoogleSignUp} className="relative">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              {/* <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div> */}
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <RadioGroup
                  defaultValue="customer"
                  onValueChange={(value) => setRole(value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="customer" />
                    <Label htmlFor="customer">Customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="merchant" id="merchant" />
                    <Label htmlFor="merchant">Merchant</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stateName">State</Label>
                  <Select
                    value={formData.stateName}
                    onValueChange={(value) => setFormData({ ...formData, stateName: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cityName">City</Label>
                  <Select
                    value={formData.cityName}
                    onValueChange={(value) => setFormData({ ...formData, cityName: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {role === "merchant" && (
                <>
                  <div className="space-y-2">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="tinNumber">TIN Number *</Label>
                        <Input
                          id="tinNumber"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setFormData({ ...formData, tinNumber: file })
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nationalId">National ID *</Label>
                        <Input
                          id="nationalId"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setFormData({ ...formData, nationalId: file })
                            }
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="account_name">Bank Account *</Label>
                        <Select
                          value={formData.account_name}
                          onValueChange={(value) => {
                            const selectedAccount = bankAccounts.find((acc) => acc.name === value)
                            setFormData({
                              ...formData,
                              account_name: value,
                              bank_code: selectedAccount?.code || "",
                            })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bank account" />
                          </SelectTrigger>
                          <SelectContent>
                            {bankAccounts.map((account) => (
                              <SelectItem key={account.code} value={account.name}>
                                {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="account_number">Account Number *</Label>
                        <Input
                          id="account_number"
                          value={formData.account_number}
                          onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                        />
                      </div>
                      {/* Bank code field is hidden and automatically populated */}
                      <input type="hidden" name="bank_code" value={formData.bank_code} />
                    </div>
                  </div>
                </>
              )}
              <Button className="w-full" type="submit" disabled={isLoading}>
                Create account
              </Button>
            </form>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Button variant="link" className="p-0" onClick={onSignIn}>
              Sign in
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <VerifyEmailDialog open={showVerifyEmail} onOpenChange={setShowVerifyEmail} email={formData.email} />
    </>
  )
}

