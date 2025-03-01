"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"

export function VerifyEmailDialog({ open, onOpenChange, email }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const inputs = useRef([]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0 && open) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer, open])

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    if (element.value && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Add your verification logic here
      toast.success("Email verified successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Invalid verification code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      // Add your resend logic here
      setResendTimer(30)
      toast.success("Verification code resent")
    } catch (error) {
      toast.error("Failed to resend verification code")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Verify your email</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Enter the verification code sent to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputs.current[index] = el)}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  className="h-12 w-12 text-center text-lg"
                  disabled={isLoading}
                />
              ))}
            </div>
            <Button className="w-full" type="submit" disabled={isLoading || otp.some((digit) => !digit)}>
              Verify Email
            </Button>
          </form>
          <div className="text-center">
            <Button variant="link" className="text-sm" disabled={resendTimer > 0} onClick={handleResend}>
              {resendTimer > 0 ? `Resend code (${resendTimer}s)` : "Didn't receive a code? Resend"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

