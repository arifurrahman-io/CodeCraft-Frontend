import { useEffect } from "react";
import AppRoutes from "@/routes/AppRoutes";
import { getSettings } from "@/services/settingsService";

const ensureLink = (rel, href) => {
  if (!href) return;

  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

export default function App() {
  useEffect(() => {
    getSettings()
      .then((response) => {
        const settings = response.data || {};

        ensureLink("icon", settings.branding?.favicon);
      })
      .catch(() => {});
  }, []);

  return <AppRoutes />;
}
