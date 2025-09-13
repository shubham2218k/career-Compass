import Home from "../../pages/Home";
import { ThemeProvider } from "../ThemeProvider";

export default function HomeExample() {
  return (
    <ThemeProvider defaultTheme="light">
      <Home />
    </ThemeProvider>
  );
}