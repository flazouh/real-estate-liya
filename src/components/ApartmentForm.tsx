"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { SuccessDialog } from "@/components/SuccessDialog";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.string().min(1, {
    message: "Age is required.",
  }),
  job: z.string().min(2, {
    message: "Job information is required.",
  }),
  livingArrangement: z.string().min(2, {
    message:
      "Please provide information about who will be living in the apartment.",
  }),
  viewingTime: z.string({
    required_error: "Please select a viewing time.",
  }),
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms.",
  }),
});

export function ApartmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      job: "",
      livingArrangement: "",
      agreement: false,
    },
  });

  const fillTestData = () => {
    form.setValue("name", "John Doe");
    form.setValue("age", "30");
    form.setValue("job", "Software Engineer");
    form.setValue("livingArrangement", "Single, no pets");
    form.setValue("viewingTime", "sunday");
    form.setValue("agreement", true);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setShowSuccess(true);
      form.reset();
    } catch (_) {
      setSubmitError("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Apartment Viewing Request</CardTitle>
          <CardDescription>
            Fill out this form to schedule a viewing of the studio apartment at
            Yitzhak Sadeh Street 28
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your age"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Job</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your current job" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="livingArrangement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Living Arrangement</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Who will be living in the apartment? (pets, kids, alone or couple)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="viewingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Viewing Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a viewing time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sunday">
                          Sunday 5-6 pm (13th)
                        </SelectItem>
                        <SelectItem value="tuesday">
                          Tuesday 5-6 pm (15th)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 mt-1"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      I understand and agree that I will pay the real estate fee
                      (one month rent + VAT) upon signing the lease contract.
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {submitError && (
                <div className="text-red-500 text-sm">{submitError}</div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={fillTestData}>
                  Fill Test Data
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
}
