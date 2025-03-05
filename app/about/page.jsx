import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Clock, ShieldCheck } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About AuctionHub</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          The premier online marketplace for unique items and collectibles, connecting buyers and sellers since 2015.
        </p>
      </section>

      {/* Our Story */}
      <section className="mb-16 grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-muted-foreground">
            AuctionHub was founded in 2015 by a group of collectors who were passionate about creating a better way for
            people to buy and sell unique items. What started as a small community of enthusiasts has grown into a
            global marketplace with millions of users.
          </p>
          <p className="text-muted-foreground">
            Our platform was built on the belief that every item has a story and deserves to find the right home. We've
            created a space where sellers can showcase their treasures and buyers can discover items they'll cherish for
            years to come.
          </p>
          <div className="pt-4">
            <Link href="/auctions">
              <Button className="gradient-bg border-0">Explore Auctions</Button>
            </Link>
          </div>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-lg shadow-xl">
          <Image src="/placeholder.svg?height=400&width=600" alt="AuctionHub team" fill className="object-cover" />
        </div>
      </section>

      {/* Mission & Values */}
      <section className="mb-16 rounded-xl bg-muted/30 p-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Our Mission & Values</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            We're on a mission to create the most trusted and vibrant marketplace for unique items, where passion meets
            opportunity.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <ShieldCheck className="mb-4 h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Trust & Transparency</h3>
                <p className="mt-2 text-muted-foreground">
                  We believe in creating a safe environment with clear policies and secure transactions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Users className="mb-4 h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Community First</h3>
                <p className="mt-2 text-muted-foreground">
                  We prioritize building connections between passionate collectors and sellers.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Award className="mb-4 h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Quality & Authenticity</h3>
                <p className="mt-2 text-muted-foreground">
                  We uphold high standards for the items on our platform and verify authenticity.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Clock className="mb-4 h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Innovation</h3>
                <p className="mt-2 text-muted-foreground">
                  We continuously improve our platform to provide the best auction experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">How AuctionHub Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="mt-4 text-xl font-semibold">List Your Item</h3>
            <p className="mt-2 text-muted-foreground">
              Create a detailed listing with photos, description, and starting price for your item.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="mt-4 text-xl font-semibold">Receive Bids</h3>
            <p className="mt-2 text-muted-foreground">
              Interested buyers place competitive bids during the auction period.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="mt-4 text-xl font-semibold">Complete the Sale</h3>
            <p className="mt-2 text-muted-foreground">
              When the auction ends, the highest bidder wins and payment is processed securely.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Meet Our Leadership Team</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Sarah Johnson",
              role: "CEO & Co-Founder",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Michael Chen",
              role: "CTO & Co-Founder",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "Emily Rodriguez",
              role: "Chief Operating Officer",
              image: "/placeholder.svg?height=300&width=300",
            },
            {
              name: "David Kim",
              role: "Chief Marketing Officer",
              image: "/placeholder.svg?height=300&width=300",
            },
          ].map((member) => (
            <div key={member.name} className="text-center">
              <div className="mx-auto mb-4 aspect-square w-40 overflow-hidden rounded-full">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16 rounded-xl gradient-bg p-8 text-primary-foreground">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="text-center">
            <p className="text-4xl font-bold">5M+</p>
            <p className="mt-2">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">10M+</p>
            <p className="mt-2">Auctions Completed</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">$500M+</p>
            <p className="mt-2">In Sales</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">50+</p>
            <p className="mt-2">Countries</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="mb-4 text-3xl font-bold">Ready to Join Our Community?</h2>
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
          Whether you're looking to sell a treasured collection or find your next favorite item, AuctionHub is the place
          for you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/auctions">
            <Button className="gradient-bg border-0">Explore Auctions</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

