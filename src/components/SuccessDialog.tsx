import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SuccessDialog({ open, onClose }: SuccessDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500 size-6" />
            Request Submitted Successfully / הבקשה נשלחה בהצלחה
          </DialogTitle>
          <DialogDescription>
            Thank you for your interest! We have received your apartment viewing
            request and will contact you shortly to confirm the viewing time.
            <br />
            תודה על התעניינותך! קיבלנו את בקשתך לצפייה בדירה וניצור איתך קשר
            בקרוב כדי לאשר את מועד הצפייה.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close / סגור</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
