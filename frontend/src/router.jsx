import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./app/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { QuizPage } from "./pages/QuizPage";
import { PreviewPage } from "./pages/PreviewPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ResultPage } from "./pages/ResultPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "quiz", element: <QuizPage /> },
      { path: "preview/:id", element: <PreviewPage /> },
      { path: "checkout/:id", element: <CheckoutPage /> },
      { path: "resultado/:id", element: <ResultPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
