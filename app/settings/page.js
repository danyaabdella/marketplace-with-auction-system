import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="container p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your store preferences</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Store Information</h3>
          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input id="store-name" placeholder="Your Store Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-email">Contact Email</Label>
              <Input id="store-email" type="email" placeholder="store@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time</SelectItem>
                  <SelectItem value="pst">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Auction Settings</h3>
          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="min-bid">Minimum Bid Increment ($)</Label>
              <Input id="min-bid" type="number" placeholder="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auction-duration">Default Auction Duration (days)</Label>
              <Input id="auction-duration" type="number" placeholder="7" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="auto-extend" />
            <Label htmlFor="auto-extend">Auto-extend auctions with last-minute bids</Label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="email-bids" defaultChecked />
              <Label htmlFor="email-bids">Email notifications for new bids</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="email-ending" defaultChecked />
              <Label htmlFor="email-ending">Email notifications for ending auctions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="email-sold" defaultChecked />
              <Label htmlFor="email-sold">Email notifications for sold items</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="gradient-bg border-0">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

