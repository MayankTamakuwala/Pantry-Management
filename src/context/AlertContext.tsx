import { Alert, Snackbar } from "@mui/material";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type AlertProps = {
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

type AlertContextType = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
};

const AlertContext = createContext<AlertContextType>({} as AlertContextType);

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertProps | undefined>();
  const [showAlert, setShowAlert] = useState(false);
  const executeAlert = useCallback((alert: AlertProps) => {
    setAlert(alert);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5 * 1000);
  }, []);
  return (
    <AlertContext.Provider
      value={{
        success: useCallback(
          (message) => executeAlert({ message, severity: "success" }),
          [executeAlert]
        ),
        error: useCallback(
          (message) => executeAlert({ message, severity: "error" }),
          [executeAlert]
        ),
        info: useCallback(
          (message) => executeAlert({ message, severity: "info" }),
          [executeAlert]
        ),
        warning: useCallback(
          (message) => executeAlert({ message, severity: "warning" }),
          [executeAlert]
        ),
      }}
    >
      {children}
      <Snackbar
        open={showAlert}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity={alert?.severity} sx={{fontSize: 20}}>{alert?.message}</Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
}
