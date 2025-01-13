import { createRoot } from 'react-dom/client';
import LandingPage from "../landingpage/landing-page";
import { Provider } from "react-redux";
import store from "../../store/landingpage-store";

const root = createRoot(document.getElementById("root")!);

// Render your App wrapped in the Provider to make Redux store available
root.render(
    <Provider store={store}>
      <LandingPage />
    </Provider>
  );