import Button from "@mui/material/Button";
import { isUserLogin } from "../auth";
import { ReactElement, useEffect, useState } from "react";
import { MessageType } from "../background";
import Stack from "@mui/material/Stack";
import { CircularProgress, Container } from "@mui/material";

export default function RequireAuth({ children }: { children: ReactElement }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    isUserLogin().then((res) => {
      setIsLoggedIn(res);
    });
  }, []);

  if (isLoggedIn) {
    return children;
  } else if (loading) {
    return (
      <Stack alignItems={"center"} gap={2}>
        <div>Logging in ...</div>
        <CircularProgress color="inherit" />
      </Stack>
    );
  } else {
    return (
      <Stack direction={"column"} alignItems={"center"}>
        <Container style={{ textAlign: "center" }}>
          Your job data will be stored in Notion. Please login to Notion.
        </Container>
        <Button
          sx={{
            backgroundColor: "#92A0AD",
            ":hover": { backgroundColor: "lightslategrey" },
            margin: "10px",
          }}
          variant="contained"
          onClick={async () => {
            await chrome.runtime.sendMessage({ type: MessageType.LOG_IN });
            setLoading(true);
          }}
        >
          Log in
        </Button>
      </Stack>
    );
  }
}
