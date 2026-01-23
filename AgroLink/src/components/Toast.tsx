import { toast } from "sonner"

export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      default:
        toast.info(message);
        break;
    }
  };

  return { showToast };
};

// For backward compatibility with existing ToastProvider usage
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
