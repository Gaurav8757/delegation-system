
import { Toaster } from "react-hot-toast";

// Toaster component for displaying toast notifications
export const Toasters = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toasterId="default"
            toastOptions={{
                duration: 5000,
                removeDelay: 1000,
                style: {
                    // Default style (if type not specified)
                    background: "linear-gradient(145deg, #363636, #4a4a4a)",
                    color: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.3), 0 4px 6px rgba(255,255,255,0.1) inset",
                    padding: "14px 22px",
                    fontWeight: 500,
                    fontSize: "14px",
                    backdropFilter: "blur(3px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                },

                // Success Toast
                success: {
                    duration: 3000,
                    iconTheme: { primary: "green", secondary: "#e4fde3" },
                    style: {
                        background: "linear-gradient(145deg, #f3fff3ff, #c8f0ca)",
                        color: "green",
                        borderRadius: "12px",
                        boxShadow: "0 8px 15px rgba(0,128,0,0.2), 0 4px 6px rgba(255,255,255,0.2) inset",
                        border: "1px solid rgba(0,128,0,0.3)",
                        padding: "10px 16px",
                        fontWeight: 500,
                        fontSize: "14px",
                    },
                },

                // Error Toast
                error: {
                    duration: 3000,
                    iconTheme: { primary: "red", secondary: "#fff3f3" },
                    style: {
                        background: "linear-gradient(145deg, #fff3f3, #fae2e2ff)",
                        color: "red",
                        borderRadius: "12px",
                        boxShadow: "0 8px 15px rgba(255,0,0,0.2), 0 4px 6px rgba(255,255,255,0.2) inset",
                        border: "1px solid rgba(255,0,0,0.3)",
                        padding: "10px 16px",
                        fontWeight: 500,
                        fontSize: "14px",
                    },
                },

                // Info Toast (custom glossy)
                info: {
                    duration: 3000,
                    iconTheme: { primary: "#0036cc", secondary: "#e8efff" },
                    style: {
                        background: "linear-gradient(145deg, #e8efff, #cce0ff)",
                        color: "#0036cc",
                        borderRadius: "12px",
                        boxShadow: "0 8px 15px rgba(0,54,204,0.2), 0 4px 6px rgba(255,255,255,0.2) inset",
                        border: "1px solid rgba(0,54,204,0.3)",
                        padding: "14px 22px",
                        fontWeight: 500,
                        fontSize: "14px",
                    },
                },
            }}
        />
    )
}


