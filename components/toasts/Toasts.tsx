import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const SuccessToast = (title: string, message: string) => {
   toast.success(title, {
      description: message,
      icon: <CheckCircle className="mr-2 h-4 w-4" />,
   });
};

export const ErrorToast = (message: string) => {
   toast.error("Ops, algo deu errado!", {
      description: message,
      icon: <CheckCircle className="mr-2 h-4 w-4" />,
   });
};
