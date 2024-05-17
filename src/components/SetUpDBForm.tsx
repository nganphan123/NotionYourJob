import { useState, useEffect, useMemo } from "react";
import { getAccessiblePages } from "../notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export default function SetDBForm() {
  const [titles, setTitles] = useState<any[]>([]);
  useEffect(() => {
    async function fetchPages() {
      const pages = (await getAccessiblePages()) as PageObjectResponse[];
      let titles: string[] = [];
      pages.forEach((notionPage) => {
        const titleProp: any = Object.values(notionPage.properties).find(
          (prop: any) => prop.id == "title"
        );
        if (titleProp.title.length > 0) {
          console.log("title 1 ", titles);
          titles.push(titleProp.title[0].text.content);
          console.log("title 2 ", titles);
        }
      });
      setTitles(titles);
    }
    fetchPages();
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {TitleList({ titles })}
    </div>
  );
}

function TitleList({ titles }: { titles: string[] }) {
  return titles.map((title) => {
    return (
      <label>
        {title}:<input type="checkbox"></input>
      </label>
    );
  });
}
