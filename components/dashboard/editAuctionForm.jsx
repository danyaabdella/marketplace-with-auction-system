"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { X, Calendar, AlertTriangle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/libs/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const formSchema = z.object({
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  condition: z.enum(["new", "used"]),
  startTime: z.date({
    required_error: "Start time is required",
  }),
  endTime: z.date({
    required_error: "End time is required",
  }),
  startingPrice: z.string().min(1, { message: "Starting price is required." }),
  reservedPrice: z.string().min(1, { message: "Reserved price is required." }),
  bidIncrement: z.string().min(1, { message: "Bid increment is required." }),
  quantity: z.string().min(1, { message: "Quantity is required." }),
});

export function EditAuctionForm({ open, onOpenChange, auction }) {
  const { toast } = useToast();
  const [images, setImages] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      condition: "used",
      startTime: new Date(),
      endTime: new Date(),
      startingPrice: "",
      reservedPrice: "",
      bidIncrement: "",
      quantity: "1",
    },
  });

  // Initialize form with auction data when opened
  useEffect(() => {
    if (auction && open) {
      form.reset({
        description: auction.description,
        condition: auction.condition,
        startTime: new Date(auction.startTime),
        endTime: new Date(auction.endTime),
        startingPrice: auction.startingPrice.toString(),
        reservedPrice: auction.reservedPrice.toString(),
        bidIncrement: auction.bidIncrement.toString(),
        quantity: auction.quantity.toString(),
      });
      setImages(auction.itemImg || []);
    }
  }, [auction, form, open]);

  function onSubmit(values) {
    // Here you would typically send the data to your API
    const updatedAuction = {
      ...values,
      itemImg: images,
      adminApproval: "pending", // Reset to pending after edit
    };

    console.log(updatedAuction);

    toast({
      title: "Auction updated",
      description: "Your auction has been updated and is pending admin approval.",
    });

    onOpenChange(false);
  }

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Auction</DialogTitle>
          <DialogDescription>
            Update the details for "{auction?.productName}". Your changes will require admin approval.
          </DialogDescription>
        </DialogHeader>

        {auction?.adminApproval === "rejected" && (
          <div className="flex items-start gap-3 p-4 mb-4 rounded-md bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium">This auction was rejected by an admin</p>
              <p className="text-sm">
                Please review and update the auction details to meet our guidelines, then resubmit for approval.
              </p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your auction item in detail..." 
                      className="h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date</span>}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When the auction will start
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date</span>}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When the auction will end
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="startingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reservedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reserved Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>Minimum price for sale</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bidIncrement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bid Increment ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Images */}
            <div>
              <FormLabel>Auction Images</FormLabel>
              <FormDescription>Upload one or more images of your auction item</FormDescription>
              <Input 
                type="file" 
                accept="image/*"
                multiple 
                onChange={handleImageUpload} 
                className="cursor-pointer mt-2" 
              />
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Auction item preview ${index + 1}`} // Added alt text
                        fill
                        className="rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-bg border-0">
                Update Auction
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}