import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme : localStorage.getItem("Speak-theme")|| "coffee", 
  setTheme : (theme) => {
    localStorage.setItem("Speak-theme",theme);
    set({theme})
},
}))