"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function PriceFilter() {
  const [isOpen, setIsOpen] = useState(true)
  const [priceRange, setPriceRange] = useState([0, 1000])

  const handleSliderChange = (value) => {
    setPriceRange(value)
  }

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]])
    }
  }

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= priceRange[0]) {
      setPriceRange([priceRange[0], value])
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-primary">Price Range</Label>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-primary">
            <span className="sr-only">{isOpen ? "Close" : "Open"}</span>
            <span className={`text-xs ${isOpen ? "rotate-180 transform" : ""}`}>▼</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-4">
        <Slider
          defaultValue={priceRange}
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={handleSliderChange}
          className="py-4"
        />
        <div className="flex items-center space-x-2">
          <div className="grid gap-1.5">
            <Label htmlFor="min-price" className="text-xs">
              Min
            </Label>
            <Input
              id="min-price"
              type="number"
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={handleMinChange}
              className="h-8 border-primary/20"
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="grid gap-1.5">
            <Label htmlFor="max-price" className="text-xs">
              Max
            </Label>
            <Input
              id="max-price"
              type="number"
              min={priceRange[0]}
              value={priceRange[1]}
              onChange={handleMaxChange}
              className="h-8 border-primary/20"
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
