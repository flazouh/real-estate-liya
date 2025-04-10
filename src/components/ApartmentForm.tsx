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
    message:
      "Name must be at least 2 characters. / שם חייב להכיל לפחות 2 תווים",
  }),
  email: z.string().email({
    message: 'Please enter a valid email address. / אנא הזן כתובת דוא"ל תקינה',
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number. / אנא הזן מספר טלפון תקין",
  }),
  age: z.string().min(1, {
    message: "Age is required. / גיל הוא שדה חובה",
  }),
  job: z.string().min(2, {
    message: "Job information is required. / מידע על תעסוקה הוא שדה חובה",
  }),
  livingArrangement: z.string().min(2, {
    message:
      "Please provide information about who will be living in the apartment. / אנא ספק מידע על מי יתגורר בדירה",
  }),
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms. / עליך להסכים לתנאים",
  }),
  agreementFirstCome: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms. / עליך להסכים לתנאים",
  }),
  agreementResponse: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms. / עליך להסכים לתנאים",
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
      agreementFirstCome: false,
      agreementResponse: false,
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
    form.setValue("agreementFirstCome", true);
    form.setValue("agreementResponse", true);
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
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">
            Apartment Viewing Request / בקשה לצפייה בדירה
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Fill out this form to schedule a viewing of the studio apartment at
            Yitzhak Sadeh Street 28
            <br className="hidden sm:block" />
            <span className="block sm:inline">
              מלא טופס זה כדי לקבוע צפייה בדירת הסטודיו ברחוב יצחק שדה 28
            </span>
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
        <CardContent className="px-4 sm:px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              {currentStep === 1 ? (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name / שם מלא</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name / הכנס את שמך המלא"
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
                        <FormLabel>Email Address / כתובת דוא"ל</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={
                              "Enter your email address / הכנס את כתובת הדואל שלך"
                            }
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
                        <FormLabel>Phone Number / מספר טלפון</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder={
                              "Enter your phone number (e.g. +972501234567) / הכנס את מספר הטלפון שלך"
                            }
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
                        <FormLabel>Age / גיל</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter your age / הכנס את גילך"
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
                        <FormLabel>Current Job / עבודה נוכחית</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your current job / הכנס את עבודתך הנוכחית"
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
                        <FormLabel>Living Arrangement / הסדר מגורים</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Who will be living in the apartment? (pets, kids, alone or couple) / מי יגור בדירה? (חיות מחמד, ילדים, לבד או זוג)"
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
                          <br />
                          אני מבין/ה ומסכים/ה שאשלם את דמי התיווך (שכר דירה
                          חודשי + מע"מ) בעת חתימת חוזה השכירות.
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreementFirstCome"
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
                          I understand that I can choose from remaining
                          apartments, but I will get it only if I'm the first
                          one who signs the contract for it.
                          <br />
                          אני מבין/ה שאני יכול/ה לבחור מהדירות הנותרות, אבל אקבל
                          אותה רק אם אני הראשון/ה שחותם/ת על החוזה עבורה.
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreementResponse"
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
                          I will provide the answer whether I proceed with
                          renting one of the apartments or not not later than 1
                          week after the showing.
                          <br />
                          אני אספק תשובה האם אני ממשיך/ה עם שכירת אחת מהדירות או
                          לא לא יאוחר משבוע לאחר הצפייה.
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full sm:w-auto"
                    >
                      Next: Schedule Viewing / הבא: קביעת צפייה
                    </Button>
                    {isDevelopment && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={fillTestData}
                        className="w-full sm:w-auto"
                      >
                        Fill Test Data / מילוי נתוני בדיקה
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="w-full sm:w-auto"
                    >
                      ← Back to Form / חזרה לטופס
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !calendlyEventUrl}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner />
                          Submitting... / שולח...
                        </>
                      ) : (
                        "Submit Request / שלח בקשה"
                      )}
                    </Button>
                  </div>

                  <FormLabel>Schedule Viewing Time / קביעת זמן צפייה</FormLabel>
                  <div className="border rounded-lg overflow-hidden">
                    {isDevelopment ? (
                      <MockCalendly
                        styles={{
                          height: "550px",
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
                        url="https://calendly.com/liyakharitonova/apartments-showing"
                        styles={{
                          height: "550px",
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
