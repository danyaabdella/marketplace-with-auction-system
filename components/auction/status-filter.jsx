"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function StatusFilter() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const handleToggleStatus = (value) => {
    setSelectedStatuses((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

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
        {[
          { id: "all", label: "All Auctions" },
          { id: "active", label: "Active Auctions" },
          { id: "ending-soon", label: "Ending Soon" },
          { id: "new", label: "Newly Listed" },
          { id: "completed", label: "Completed" }
        ].map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={`status-${id}`}
              checked={selectedStatuses.includes(id)}
              onCheckedChange={() => handleToggleStatus(id)}
              className="border-primary/20 text-primary"
            />
            <Label
              htmlFor={`status-${id}`}
              className="text-sm cursor-pointer hover:text-primary transition-colors"
            >
              {label}
            </Label>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
