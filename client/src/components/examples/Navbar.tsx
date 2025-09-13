import { useState } from "react";
import Navbar from "../Navbar";

export default function NavbarExample() {
  const [isDark, setIsDark] = useState(false);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return <Navbar onThemeToggle={handleThemeToggle} isDark={isDark} />;
}