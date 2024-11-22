import Button from "@mui/material/Button";
import { isUserLogin, login } from "../auth";
import { ReactElement, useEffect, useState } from "react";
import { MessageType } from "../background";
import Stack from "@mui/material/Stack";
import { Container } from "@mui/material";

export default function RequireAuth({ children }: { children: ReactElement }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  useEffect(() => {
    isUserLogin().then((res) => {
      if (res) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  });
  if (isLoggedIn) {
    return children;
  } else {
    return (
      <Stack direction={"column"} alignItems={"center"}>
        <Container style={{textAlign:"center"}}>Your job data will be stored in Notion. Please login to Notion.</Container>
        <Button
          sx={{
            backgroundColor: "#92A0AD",
            ":hover": { backgroundColor: "lightslategrey" },
            margin: "10px",
          }}
          variant="contained"
          onClick={async() => await chrome.runtime.sendMessage({type: MessageType.LOG_IN})}
        >
          Log in 
        </Button>
      </Stack>
    );
  }
}
