import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const findNotionPageTitle = (page: PageObjectResponse) => {
  const titleProp: any = Object.values(page.properties).find(
    (prop: any) => prop.id == "title"
  );
  if (titleProp.title.length > 0) {
    return titleProp.title[0].text.content as string;
  } else {
    return "";
  }
};
