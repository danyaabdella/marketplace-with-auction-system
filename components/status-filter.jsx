"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function StatusFilter() {
  const [isOpen, setIsOpen] = useState(true)
  const [status, setStatus] = useState("all")

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-primary">Auction Status</Label>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-primary">
            <span className="sr-only">{isOpen ? "Close" : "Open"}</span>
            <span className={`text-xs ${isOpen ? "rotate-180 transform" : ""}`}>▼</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <RadioGroup value={status} onValueChange={setStatus}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="status-all" className="border-primary/20 text-primary" />
            <Label htmlFor="status-all" className="text-sm cursor-pointer hover:text-primary transition-colors">
              All Auctions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="active" id="status-active" className="border-primary/20 text-primary" />
            <Label htmlFor="status-active" className="text-sm cursor-pointer hover:text-primary transition-colors">
              Active Auctions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ending-soon" id="status-ending-soon" className="border-primary/20 text-primary" />
            <Label htmlFor="status-ending-soon" className="text-sm cursor-pointer hover:text-primary transition-colors">
              Ending Soon
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="status-new" className="border-primary/20 text-primary" />
            <Label htmlFor="status-new" className="text-sm cursor-pointer hover:text-primary transition-colors">
              Newly Listed
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="completed" id="status-completed" className="border-primary/20 text-primary" />
            <Label htmlFor="status-completed" className="text-sm cursor-pointer hover:text-primary transition-colors">
              Completed
            </Label>
          </div>
        </RadioGroup>
      </CollapsibleContent>
    </Collapsible>
  )
}

