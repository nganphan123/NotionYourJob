import { useState, useEffect, useCallback } from "react";
import { getAccessiblePages, setupNotion } from "../notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Navigate } from "react-router-dom";
import Logo from "./Logo";
import { Button, List, ListItem, Stack } from "@mui/material";

interface pageTitle {
  title: string;
  url: string;
  id: string;
}

export default function SetDBForm() {
  const [titles, setTitles] = useState<pageTitle[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [redirectToJob, setRedirectToJob] = useState<boolean>(false);
  useEffect(() => {
    async function fetchPages() {
      const pages = (await getAccessiblePages()) as PageObjectResponse[];
      // TODO: split ui to parent and child pages
      let titles: pageTitle[] = [];
      pages.forEach((notionPage) => {
        const titleProp: any = Object.values(notionPage.properties).find(
          (prop: any) => prop.id == "title"
        );
        if (titleProp.title.length > 0) {
          titles.push({
            title: titleProp.title[0].text.content as string,
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
  }
  return (
    <Stack spacing={2} alignItems={"center"}>
      <Logo width={100} height={50} />
      <p>
        Pick the page you want to create your notes in. We'll set up the rest.
      </p>
      <List sx={{ overflowY: "auto", maxHeight: "150px" }}>{titleList}</List>
      {/* <button
        id="submitButton"
        type="submit"
        onClick={onSubmit}
        disabled={redirectToJob}
      >
        Submit */}
      {/* </button> */}
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
