import { addDescriptionPage, addJob } from "./notion";
import { extractCurrentPageHTML, parsePage } from "./parsing";

export enum MessageType {
  ADD_JOB = 1,
}
export interface AddJobRequest {
  type: MessageType.ADD_JOB;
  company: string;
  role: string;
  link: string;
  activeTabId: number;
}
chrome.runtime.onMessage.addListener(async function ({
  company,
  role,
  link,
  activeTabId,
}: AddJobRequest) {
  // parse page
  let description: string[] = [];
  try {
    const html = await extractCurrentPageHTML(activeTabId);
    description = parsePage(html);
    // create description page
    const descPageId = await addDescriptionPage(description);
    // add new job to db
    await addJob(company, role, link, descPageId);
  } catch (e) {
    console.log("error ", e);
  }
});
