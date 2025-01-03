import { login } from "./auth";
import { addDescriptionPage, addJob } from "./notion";
import { extractCurrentPageHTML, parsePage } from "./parser/parsing";

export enum MessageType {
  // turn into string because chrome context menu item take string as id
  ADD_JOB = "1",
  EXTRACTED_JOB_TITLE = "2",
  EXTRACTED_LOCATION = "3",
  EXTRACTED_COMPANY = "4",
  LOG_IN = "5"
}
export interface AddJobRequest {
  type: MessageType.ADD_JOB;
  company: string;
  role: string;
  location: string;
  link: string;
  activeTabId: number;
  status: string;
  resumeId: string;
}
chrome.runtime.onMessage.addListener(async function({type}){
  if(type != MessageType.LOG_IN){
    return;
  }
  login();
});
chrome.runtime.onMessage.addListener(async function ({
  type,
  company,
  role,
  location,
  link,
  activeTabId,
  status,
  resumeId,
}: AddJobRequest) {
  if (type != MessageType.ADD_JOB) {
    return;
  }
  // parse page
  let description: string[] = [];
  try {
    const html = await extractCurrentPageHTML(activeTabId);
    description = parsePage(html);
    // create description page
    const descPageId = await addDescriptionPage(
      description,
      `${company}-${role}`
    );
    // add new job to db
    await addJob(company, role, location, link, descPageId, status, resumeId);
  } catch (e) {
    console.log("error ", e);
  }
});
