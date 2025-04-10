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
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { SuccessDialog } from "@/components/SuccessDialog";
import { InlineWidget } from "react-calendly";
import { MockCalendly } from "@/components/MockCalendly";

// Add this constant at the top of the file
const isDevelopment = process.env.NODE_ENV === "development";

// Add Calendly type definition
declare global {
  interface Window {
    Calendly: any;
  }
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
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
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms.",
  }),
});

export function ApartmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [calendlyEventUrl, setCalendlyEventUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [prefillValues, setPrefillValues] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: "",
      job: "",
      livingArrangement: "",
      agreement: false,
    },
  });

  useEffect(() => {
    const handleCalendlyEvent = (e: any) => {
      if (e.data.event && e.data.event.indexOf("calendly") === 0) {
        if (e.data.event === "calendly.event_scheduled") {
          setCalendlyEventUrl(e.data.payload.event.uri);
          setTimeout(() => {
            form.handleSubmit(onSubmit)();
          }, 500);
        }
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
  }, [form]);

  useEffect(() => {
    const updatePrefillValues = () => {
      setPrefillValues({
        name: form.getValues("name"),
        email: form.getValues("email"),
        phone: form.getValues("phone"),
      });
    };

    const subscription = form.watch(() => {
      // Only update prefill values when these specific fields change
      const relevantFields = ["name", "email", "phone"];
      const changedField = form.formState.dirtyFields;

      if (
        Object.keys(changedField).some((field) =>
          relevantFields.includes(field)
        )
      ) {
        // Add a small delay to batch potential multiple changes
        setTimeout(updatePrefillValues, 500);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const fillTestData = () => {
    form.setValue("name", "John Doe");
    form.setValue("email", "john@example.com");
    form.setValue("phone", "+972501234567");
    form.setValue("age", "30");
    form.setValue("job", "Software Engineer");
    form.setValue("livingArrangement", "Single, no pets");
    form.setValue("agreement", true);
  };

  const handleNextStep = async () => {
    const result = await form.trigger();
    if (result) {
      const values = form.getValues();
      setPrefillValues({
        name: values.name,
        email: values.email,
        phone: values.phone,
      });
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setCalendlyEventUrl(null);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!calendlyEventUrl) {
      setSubmitError("Please schedule a viewing time first");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          calendlyEventUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setShowSuccess(true);
      form.reset();
      setCalendlyEventUrl(null);
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
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`h-2 flex-1 rounded ${
                currentStep === 1 ? "bg-primary" : "bg-muted"
              }`}
            />
            <div
              className={`h-2 flex-1 rounded ${
                currentStep === 2 ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 ? (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter your phone number (e.g. +972501234567)"
                            {...field}
                          />
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
                          <Input
                            placeholder="Enter your current job"
                            {...field}
                          />
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
                          I understand and agree that I will pay the real estate
                          fee (one month rent + VAT) upon signing the lease
                          contract.
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button type="button" onClick={handleNextStep}>
                      Next: Schedule Viewing
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={fillTestData}
                    >
                      Fill Test Data
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                    >
                      ← Back to Form
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !calendlyEventUrl}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner />
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                  </div>

                  <FormLabel>Schedule Viewing Time</FormLabel>
                  <div className="border rounded-lg overflow-hidden">
                    {isDevelopment ? (
                      <MockCalendly
                        styles={{
                          height: "650px",
                          width: "100%",
                        }}
                        prefill={{
                          name: prefillValues.name,
                          email: prefillValues.email,
                          location: prefillValues.phone,
                          smsReminderNumber: prefillValues.phone,
                        }}
                      />
                    ) : (
                      <InlineWidget
                        url="https://calendly.com/liyakharitonova/30min"
                        styles={{
                          height: "650px",
                          width: "100%",
                        }}
                        prefill={{
                          name: prefillValues.name,
                          email: prefillValues.email,
                          location: prefillValues.phone,
                          smsReminderNumber: prefillValues.phone,
                        }}
                        pageSettings={{
                          hideEventTypeDetails: false,
                          hideLandingPageDetails: false,
                        }}
                        utm={{
                          utmCampaign: "ApartmentViewing",
                          utmSource: "Website",
                          utmMedium: "PropertyForm",
                        }}
                      />
                    )}
                  </div>
                  {submitError && (
                    <p className="text-sm text-red-500">{submitError}</p>
                  )}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
}
