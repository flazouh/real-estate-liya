import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MockCalendlyProps {
  styles: {
    height: string;
    width: string;
  };
  prefill: {
    name: string;
    email: string;
    location: string;
    smsReminderNumber: string;
  };
}

const MOCK_TIME_SLOTS = [
  { date: "2024-03-25", slots: ["10:00", "14:00", "16:00"] },
  { date: "2024-03-26", slots: ["09:00", "11:00", "15:00"] },
  { date: "2024-03-27", slots: ["10:30", "13:30", "17:00"] },
];

export function MockCalendly({ styles, prefill }: MockCalendlyProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      // Simulate Calendly's event scheduling message
      const mockEventUri = `mock-calendly-event-${Date.now()}`;
      window.postMessage(
        {
          event: "calendly.event_scheduled",
          payload: {
            event: {
              uri: mockEventUri,
            },
          },
        },
        "*"
      );
    }
  };

  return (
    <div style={styles} className="p-4 bg-white">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Mock Calendly (Dev Mode)</h3>
        <div className="text-sm text-muted-foreground mb-4">
          <div>Name: {prefill.name}</div>
          <div>Email: {prefill.email}</div>
          <div>Phone: {prefill.smsReminderNumber}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-3">Select Date</h4>
          <div className="space-y-2">
            {MOCK_TIME_SLOTS.map((dateSlot) => (
              <Button
                key={dateSlot.date}
                variant={selectedDate === dateSlot.date ? "default" : "outline"}
                className="w-full"
                onClick={() => {
                  setSelectedDate(dateSlot.date);
                  setSelectedTime(null);
                }}
              >
                {new Date(dateSlot.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </Button>
            ))}
          </div>
        </Card>

        {selectedDate && (
          <Card className="p-4">
            <h4 className="font-medium mb-3">Select Time</h4>
            <div className="space-y-2">
              {MOCK_TIME_SLOTS.find((d) => d.date === selectedDate)?.slots.map(
                (time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                )
              )}
            </div>
          </Card>
        )}
      </div>

      {selectedDate && selectedTime && (
        <div className="mt-6">
          <Button className="w-full" onClick={handleConfirm}>
            Confirm Mock Booking
          </Button>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            This is a mock booking for development purposes
          </p>
        </div>
      )}
    </div>
  );
}
