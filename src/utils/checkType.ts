export const isOfTypeNotionPage = (r: object) =>
  "object" in r && r.object == "page" && "properties" in r;
