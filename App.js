import React, { useCallback, useState } from "react";
import { ThemeProvider } from "./src/themeContext";
import IntroScreen from "./src/screens/IntroScreen";
import MainTabs from "./src/navigation/MainTabs";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleFinishIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <ThemeProvider>
      {showIntro ? <IntroScreen onFinish={handleFinishIntro} /> : <MainTabs />}
    </ThemeProvider>
  );
}
