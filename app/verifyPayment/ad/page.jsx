"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function VerifyAdvertisementPayment() {
  const [message, setMessage] = useState("Processing advertisement payment...")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyPayment = async () => {
      const search = window.location.search.replace(/amp;/g, "&")
      const urlParams = new URLSearchParams(search)
      const tx_ref = urlParams.get("tx_ref")
      const adId = urlParams.get("adId")

      if (!tx_ref || !adId) {
        setMessage("Invalid transaction reference or advertisement ID")
        setError(true)
        setLoading(false)
        return
      }

      try {
        const verifyResponse = await fetch(`/api/verifyPayment/ad?tx_ref=${tx_ref}&adId=${adId}`)
        const verifyData = await verifyResponse.json()

        if (!verifyResponse.ok) {
          setMessage(verifyData.message || "Advertisement payment verification failed")
          setError(true)
          setLoading(false)
          return
        }

        setMessage("Payment successful! Your advertisement is pending admin approval.")
        // Clean up any advertisement-related local storage if needed
        localStorage.removeItem(`tx_ref_${adId}`)
      } catch (err) {
        console.error("Verification error:", err)
        setMessage("Error verifying advertisement payment")
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [])

  return (
    <div className="container py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Advertisement Payment Status</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">{message}</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-8 w-8 text-destructive" />
              <p className="text-destructive">{message}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p className="text-green-500">{message}</p>
            </div>
          )}
          <Button
            className="mt-4"
            onClick={() => router.push("/dashboard/products")}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}