import { useState, useEffect, useMemo, useCallback } from "react";
import { getAccessiblePages } from "../notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { setDBId } from "../store";
import { redirect } from "react-router-dom";

interface pageTitle {
  title: string;
  url: string;
  id: string;
}

export default function SetDBForm() {
  const [titles, setTitles] = useState<pageTitle[]>([]);
  const [selected, setSelected] = useState<string>("");
  useEffect(() => {
    async function fetchPages() {
      const pages = (await getAccessiblePages()) as PageObjectResponse[];
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
  const onSubmit = useCallback(
    (event: any) => {
      setDBId(selected)
        .then(() => {
          redirect("/job");
        })
        .catch((e) => {
          console.log("Error", e);
          alert(`Couldn't set db id. Error: ${e}`);
        });
    },
    [selected]
  );
  const titleList = titles.map((entity) => {
    return (
      <label>
        <a href={entity.url}>{entity.title}</a>:
        <input
          type="checkbox"
          onClick={() => setSelected(entity.id)}
          checked={entity.id == selected}
        ></input>
      </label>
    );
  });
  return (
    <form>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {titleList}
      </div>
      <input type="submit" value="Submit" onClick={onSubmit} />
    </form>
  );
}
