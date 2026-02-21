import { usePreferences } from "../context/PreferencesContext";
import { t as translate } from "../utils/translations";

export function useTranslation() {
  const { language } = usePreferences();
  return (key) => translate(language, key);
}
