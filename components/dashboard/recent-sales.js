import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Recent Sales</h3>
        <p className="text-sm text-muted-foreground">Latest transactions from your store</p>
      </div>
      <div className="mt-6 space-y-6">
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-sm text-muted-foreground">Vintage Camera</p>
          </div>
          <div className="ml-auto font-medium">+$450.00</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/02.png" alt="Avatar" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Alice Smith</p>
            <p className="text-sm text-muted-foreground">Antique Watch</p>
          </div>
          <div className="ml-auto font-medium">+$890.00</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/03.png" alt="Avatar" />
            <AvatarFallback>RJ</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Robert Johnson</p>
            <p className="text-sm text-muted-foreground">Art Deco Lamp</p>
          </div>
          <div className="ml-auto font-medium">+$320.00</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/04.png" alt="Avatar" />
            <AvatarFallback>EB</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Emma Brown</p>
            <p className="text-sm text-muted-foreground">Vintage Records</p>
          </div>
          <div className="ml-auto font-medium">+$230.00</div>
        </div>
      </div>
    </div>
  )
}

