import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { supabase } from "../lib/supabase";

export default function usePushToken(userId) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const register = async () => {
      const { status: existing } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existing;

      if (existing !== "granted") {
        const { status } =
          await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") return;

      const t = (await Notifications.getExpoPushTokenAsync()).data;
      setToken(t);

      // store the token in supabase
      await supabase.from("users").update({ push_token: t }).eq("id", userId);
    };

    register();
  }, []);

  return token;
}
