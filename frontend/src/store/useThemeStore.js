import { create } from "zustand"
export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("Netnity-theme") || "autumn",
    setTheme: (theme) => {
        localStorage.setItem("Netnity-theme", theme);
        set({ theme });
    },
}))