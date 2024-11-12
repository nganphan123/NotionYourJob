import { useState, useEffect, useCallback } from "react";
import { getAccessiblePages, setupNotion } from "../notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Navigate } from "react-router-dom";
import Logo from "./Logo";
import { Button, CircularProgress, List, ListItem, Stack } from "@mui/material";
import { findNotionPageTitle } from "../utils/findProp";

interface pageTitle {
  title: string;
  url: string;
  id: string;
}

export default function SetDBForm() {
  const [titles, setTitles] = useState<pageTitle[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [redirectToJob, setRedirectToJob] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    async function fetchPages() {
      const pages = (await getAccessiblePages()) as PageObjectResponse[];
      // TODO: split ui to parent and child pages
      let titles: pageTitle[] = [];
      pages.forEach((notionPage) => {
        const pageTitle: string = findNotionPageTitle(notionPage);
        if (pageTitle != null) {
          titles.push({
            title: pageTitle,
            url: notionPage.url,
            id: notionPage.id,
          });
        }
      });
      setTitles(titles);
    }
    fetchPages();
  }, []);
  const onSubmit = useCallback(() => {
    try {
      setIsLoading(true);
      setupNotion(selected).then(() => {
        setRedirectToJob(true);
      });
    } catch (e) {
      console.log("Error", e);
      alert(`Couldn't set db id. Error: ${e}`);
    }
  }, [selected]);
  const titleList = titles.map((entity) => {
    return (
      <ListItem>
        <label>
          <a href={entity.url}>{entity.title}</a>:
          <input
            type="checkbox"
            onClick={() => setSelected(entity.id)}
            checked={entity.id == selected}
          ></input>
        </label>
      </ListItem>
    );
  });
  if (redirectToJob) {
    return <Navigate to={"/job"} />;
  } else if (isLoading || titles.length == 0) {
    return (
      <Stack alignItems={"center"}>
        <div>🛑 Form is being set up. Don't close the popup!</div>
        <CircularProgress color="inherit" />
      </Stack>
    );
  }
  return (
    <Stack spacing={2} alignItems={"center"}>
      <Logo width={100} height={50} />
      <p>
        Pick the page you want to create your notes in. We'll set up the rest.
      </p>
      <List sx={{ overflowY: "auto", maxHeight: "150px" }}>{titleList}</List>
      <Button
        sx={{
          backgroundColor: "#92A0AD",
          ":hover": { backgroundColor: "lightslategrey" },
        }}
        variant="contained"
        onClick={onSubmit}
        disabled={redirectToJob}
      >
        Notion
      </Button>
    </Stack>
  );
}
