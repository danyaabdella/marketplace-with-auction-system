// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Users, Award, Clock, ShieldCheck } from "lucide-react"

// export default function AboutPage() {
//   return (
//     <div className="container mx-auto px-4 py-12">
//       {/* Hero Section */}
//       <section className="mb-16 text-center">
//         <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About AuctionHub</h1>
//         <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
//           The premier online marketplace for unique items and collectibles, connecting buyers and sellers since 2015.
//         </p>
//       </section>

//       {/* Our Story */}
//       <section className="mb-16 grid gap-8 md:grid-cols-2 items-center">
//         <div className="space-y-4">
//           <h2 className="text-3xl font-bold">Our Story</h2>
//           <p className="text-muted-foreground">
//             AuctionHub was founded in 2015 by a group of collectors who were passionate about creating a better way for
//             people to buy and sell unique items. What started as a small community of enthusiasts has grown into a
//             global marketplace with millions of users.
//           </p>
//           <p className="text-muted-foreground">
//             Our platform was built on the belief that every item has a story and deserves to find the right home. We've
//             created a space where sellers can showcase their treasures and buyers can discover items they'll cherish for
//             years to come.
//           </p>
//           <div className="pt-4">
//             <Link href="/auctions">
//               <Button className="gradient-bg border-0">Explore Auctions</Button>
//             </Link>
//           </div>
//         </div>
//         <div className="relative aspect-video overflow-hidden rounded-lg shadow-xl">
//           <Image src="/placeholder.svg?height=400&width=600" alt="AuctionHub team" fill className="object-cover" />
//         </div>
//       </section>

//       {/* Mission & Values */}
//       <section className="mb-16 rounded-xl bg-muted/30 p-8">
//         <div className="mx-auto max-w-3xl text-center">
//           <h2 className="mb-6 text-3xl font-bold">Our Mission & Values</h2>
//           <p className="mb-8 text-lg text-muted-foreground">
//             We're on a mission to create the most trusted and vibrant marketplace for unique items, where passion meets
//             opportunity.
//           </p>
//           <div className="grid gap-6 md:grid-cols-2">
//             <Card>
//               <CardContent className="flex flex-col items-center p-6 text-center">
//                 <ShieldCheck className="mb-4 h-12 w-12 text-primary" />
//                 <h3 className="text-xl font-semibold">Trust & Transparency</h3>
//                 <p className="mt-2 text-muted-foreground">
//                   We believe in creating a safe environment with clear policies and secure transactions.
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="flex flex-col items-center p-6 text-center">
//                 <Users className="mb-4 h-12 w-12 text-primary" />
//                 <h3 className="text-xl font-semibold">Community First</h3>
//                 <p className="mt-2 text-muted-foreground">
//                   We prioritize building connections between passionate collectors and sellers.
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="flex flex-col items-center p-6 text-center">
//                 <Award className="mb-4 h-12 w-12 text-primary" />
//                 <h3 className="text-xl font-semibold">Quality & Authenticity</h3>
//                 <p className="mt-2 text-muted-foreground">
//                   We uphold high standards for the items on our platform and verify authenticity.
//                 </p>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className="flex flex-col items-center p-6 text-center">
//                 <Clock className="mb-4 h-12 w-12 text-primary" />
//                 <h3 className="text-xl font-semibold">Innovation</h3>
//                 <p className="mt-2 text-muted-foreground">
//                   We continuously improve our platform to provide the best auction experience.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="mb-16">
//         <h2 className="mb-8 text-center text-3xl font-bold">How AuctionHub Works</h2>
//         <div className="grid gap-8 md:grid-cols-3">
//           <div className="flex flex-col items-center text-center">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
//               1
//             </div>
//             <h3 className="mt-4 text-xl font-semibold">List Your Item</h3>
//             <p className="mt-2 text-muted-foreground">
//               Create a detailed listing with photos, description, and starting price for your item.
//             </p>
//           </div>
//           <div className="flex flex-col items-center text-center">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
//               2
//             </div>
//             <h3 className="mt-4 text-xl font-semibold">Receive Bids</h3>
//             <p className="mt-2 text-muted-foreground">
//               Interested buyers place competitive bids during the auction period.
//             </p>
//           </div>
//           <div className="flex flex-col items-center text-center">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
//               3
//             </div>
//             <h3 className="mt-4 text-xl font-semibold">Complete the Sale</h3>
//             <p className="mt-2 text-muted-foreground">
//               When the auction ends, the highest bidder wins and payment is processed securely.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Team */}
//       <section className="mb-16">
//         <h2 className="mb-8 text-center text-3xl font-bold">Meet Our Leadership Team</h2>
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {[
//             {
//               name: "Sarah Johnson",
//               role: "CEO & Co-Founder",
//               image: "/placeholder.svg?height=300&width=300",
//             },
//             {
//               name: "Michael Chen",
//               role: "CTO & Co-Founder",
//               image: "/placeholder.svg?height=300&width=300",
//             },
//             {
//               name: "Emily Rodriguez",
//               role: "Chief Operating Officer",
//               image: "/placeholder.svg?height=300&width=300",
//             },
//             {
//               name: "David Kim",
//               role: "Chief Marketing Officer",
//               image: "/placeholder.svg?height=300&width=300",
//             },
//           ].map((member) => (
//             <div key={member.name} className="text-center">
//               <div className="mx-auto mb-4 aspect-square w-40 overflow-hidden rounded-full">
//                 <Image
//                   src={member.image || "/placeholder.svg"}
//                   alt={member.name}
//                   width={160}
//                   height={160}
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//               <h3 className="text-lg font-semibold">{member.name}</h3>
//               <p className="text-muted-foreground">{member.role}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Stats */}
//       <section className="mb-16 rounded-xl gradient-bg p-8 text-primary-foreground">
//         <div className="grid gap-8 md:grid-cols-4">
//           <div className="text-center">
//             <p className="text-4xl font-bold">5M+</p>
//             <p className="mt-2">Active Users</p>
//           </div>
//           <div className="text-center">
//             <p className="text-4xl font-bold">10M+</p>
//             <p className="mt-2">Auctions Completed</p>
//           </div>
//           <div className="text-center">
//             <p className="text-4xl font-bold">$500M+</p>
//             <p className="mt-2">In Sales</p>
//           </div>
//           <div className="text-center">
//             <p className="text-4xl font-bold">50+</p>
//             <p className="mt-2">Countries</p>
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="text-center">
//         <h2 className="mb-4 text-3xl font-bold">Ready to Join Our Community?</h2>
//         <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
//           Whether you're looking to sell a treasured collection or find your next favorite item, AuctionHub is the place
//           for you.
//         </p>
//         <div className="flex flex-wrap justify-center gap-4">
//           <Link href="/auctions">
//             <Button className="gradient-bg border-0">Explore Auctions</Button>
//           </Link>
//           <Link href="/contact">
//             <Button variant="outline">Contact Us</Button>
//           </Link>
//         </div>
//       </section>
//     </div>
//   )
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  ChevronRight,
  Globe,
  Lightbulb,
  MapPin,
  Shield,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Fetch function to retrieve About Us content
async function fetchAboutUsContent() {
  const sections = [
    "hero",
    "mission",
    "vision",
    "values",
    "stats",
    "timeline",
    "team",
    "locations",
    "awards",
    "cta",
  ];

  const fetchSection = async (section) => {
    try {
      const res = await fetch(`/api/about/${section}`);
      if (!res.ok) throw new Error(`Failed to fetch ${section}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.error(`Failed to fetch ${section}:`, err);
      return null;
    }
  };

  const results = await Promise.all(sections.map(fetchSection));

  return {
    hero: results[0],
    mission: results[1],
    vision: results[2],
    values: results[3],
    stats: results[4],
    history: results[5],
    team: results[6],
    locations: results[7],
    awards: results[8],
    cta: results[9],
  };
}

export default function AboutUsPage() {
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const data = await fetchAboutUsContent();
        console.log("History data:", data.history); // Debug the data
        setAboutData(data);
      } catch (err) {
        console.error("Failed to fetch about us data:", err);
        setError("Failed to load About Us content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAboutData();
  }, []);

  // Function to render the appropriate icon
  const renderIcon = (iconName, className) => {
    switch (iconName) {
      case "Lightbulb":
        return <Lightbulb className={className} />;
      case "Shield":
        return <Shield className={className} />;
      case "Award":
        return <Award className={className} />;
      case "Users":
        return <Users className={className} />;
      default:
        return <Lightbulb className={className} />;
    }
  };

  if (error) {
    return (
      <div className="container relative mx-auto px-4 py-12 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 max-w-7xl">
      <div className="relative mb-16">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : aboutData?.hero ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {aboutData.hero.title}
              </h1>
              <p className="mt-4 text-xl font-medium text-purple-600 dark:text-purple-400">
                {aboutData.hero.subtitle}
              </p>
              <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
                {aboutData.hero.description}
              </p>
            </div>

            <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden">
              <Image
                src={aboutData.hero.image || "/placeholder.svg"}
                alt="About our company"
                fill
                className="object-cover"
                priority
              />
            </div>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {isLoading ? (
          <>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </>
        ) : (
          <>
            {aboutData?.mission && (
              <Card className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={aboutData.mission.image || "/placeholder.svg"}
                    alt="Our mission"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Target className="h-6 w-6 text-purple-600 mr-2" />
                    <h2 className="text-2xl font-bold">
                      {aboutData.mission.title}
                    </h2>
                  </div>
                  <p className="text-muted-foreground">
                    {aboutData.mission.content}
                  </p>
                </CardContent>
              </Card>
            )}

            {aboutData?.vision && (
              <Card className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={aboutData.vision.image || "/placeholder.svg"}
                    alt="Our vision"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Globe className="h-6 w-6 text-indigo-600 mr-2" />
                    <h2 className="text-2xl font-bold">
                      {aboutData.vision.title}
                    </h2>
                  </div>
                  <p className="text-muted-foreground">
                    {aboutData.vision.content}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Our Core Values
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : aboutData?.values?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.values.map((value, index) => (
              <Card
                // key={value.id}
                key={value.id ? `value-${value.id}` : `value-fallback-${index}`}
                className="overflow-hidden transition-all hover:shadow-md"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    {renderIcon(
                      value.icon,
                      "h-6 w-6 text-purple-600 dark:text-purple-400"
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          {isLoading ? (
            <Skeleton className="h-8 w-64 mx-auto" />
          ) : (
            "Our History"
          )}
        </h2>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : aboutData?.history?.length > 0 ? (
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-purple-200 dark:bg-purple-900/50"></div>

            <div className="space-y-12">
              {aboutData.history.map((event, index) => (
                <div
                  key={event.id || `history-${event.year}-${index}`}
                  className={`relative flex flex-col md:flex-row ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="md:w-1/2 mb-4 md:mb-0">
                    <div
                      className={`relative ${
                        index % 2 === 0 ? "md:pl-8" : "md:pr-8"
                      } p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm`}
                    >
                      <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {event.year}
                      </h3>
                      <h4 className="text-lg font-semibold mb-2">
                        {event.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="md:w-1/2 flex justify-center items-center">
                    <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-purple-600 border-4 border-white dark:border-gray-900 z-10"></div>
                    <div className="hidden md:block w-24 h-24 rounded-full overflow-hidden mx-auto">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={96}
                        height={96}
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No history data available.
          </p>
        )}
      </div>

      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Our Global Presence
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : aboutData?.locations?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutData.locations.map((location) => (
              <Card key={`location-${location.id}-${location.city}`} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={location.image || "/placeholder.svg"}
                    alt={location.city}
                    fill
                    className="object-cover"
                  />
                  {location.isHeadquarters && (
                    <Badge className="absolute top-2 right-2 bg-purple-600">
                      Headquarters
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-lg">
                        {location.city}, {location.country}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {location.address}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Awards & Recognition
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : aboutData?.awards?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutData.awards.map((award) => (
              <Card key={award.id} className="overflow-hidden">
                <CardContent className="p-6 flex items-start">
                  <div className="mr-4 flex-shrink-0">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Award className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">{award.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {award.organization}, {award.year}
                    </p>
                    <p className="text-sm mt-2">{award.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl p-8 mb-16">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : aboutData?.stats?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {aboutData.stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : aboutData?.cta ? (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {aboutData.cta.title}
          </h2>
          <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
            {aboutData.cta.description}
          </p>
          <Link href={aboutData.cta.buttonLink || "#"}>
            <Button size="lg" variant="secondary" className="group">
              {aboutData.cta.buttonText || "Get Started"}
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}