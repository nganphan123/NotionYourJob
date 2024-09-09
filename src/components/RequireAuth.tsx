import { isUserLogin, login } from "../auth";
import { ReactElement, useEffect, useState } from "react";

export default function RequireAuth({ children }: { children: ReactElement }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  useEffect(() => {
    isUserLogin().then((res) => {
      if (res) {
        setIsLoggedIn(true);
      } else {
        login();
      }
    });
  });
  if (isLoggedIn) {
    return children;
  } else {
    return <div>Login to your Notion</div>;
  }
}
