import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { getAcessToken, getDBId } from "./store";
import { extractCurrentPageHTML, parsePage } from "./parsing";
import { addDescriptionPage, addJob, getAccessiblePages } from "./notion";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

function App() {
  const [dbId, setDbId] = useState<boolean>(false);
  useEffect(() => {
    getDBId().then((value) => {
      if (value != "") {
        setDbId(true);
      }
    });
  });
  if (dbId) {
    return <JobForm />;
  } else {
    return <SetDBForm />;
  }
}

function SetDBForm() {
  const [pages, setPages] = useState<any[]>([]);
  useEffect(() => {
    async function fetchPages() {
      const response = await getAccessiblePages();
      setPages(response);
    }
    fetchPages();
  }, []);
  useMemo(() => {
    const parent = document.createElement("div");
    pages.forEach((notionPage) => {
      const pageName = notionPage.properties;
      // const dd = pageName.title.title[0].text.content as string;
      // console.log("dd ", dd);
      console.log("page props", pageName);

      // const child = document.createElement("input")
      // child.
      // parent.appendChild()
    });
  }, [pages]);
  return <div></div>;
}

function JobForm() {
  const [dbId, setDbId] = useState<string>("");
  const [descId, setDescId] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab: chrome.tabs.Tab = tabs[0];
      let tabUrl = activeTab.url;
      setLink(tabUrl ?? "");
    });
  }, [chrome.tabs]);
  const handleSubmit = useCallback(
    async (e: SubmitEvent) => {
      e.preventDefault();

      // parse page
      let description: string[] = [];
      try {
        description = parsePage(await extractCurrentPageHTML());
        // create description page
        const descPageId = await addDescriptionPage(descId, description);
        // add new job to db
        await addJob(dbId, company, role, link, descPageId);
        setErrorMessage("success");
      } catch (e) {
        if (e instanceof Error) {
          setErrorMessage(e.message);
        }
        return;
      }
    },
    [dbId, descId, company, role, link]
  );
  const onDBIdChange = useCallback((e: any) => {
    setDbId(e.target.value);
  }, []);
  const onCompanyChange = useCallback((e: any) => {
    setCompany(e.target.value);
  }, []);
  const onRoleChange = useCallback((e: any) => {
    setRole(e.target.value);
  }, []);
  const onJobLinkChange = useCallback((e: any) => {
    setLink(e.target.value);
  }, []);
  const onDescIdChange = useCallback((e: any) => {
    setDescId(e.target.value);
  }, []);
  return (
    <React.Fragment>
      <form id="notion-form-data">
        <label htmlFor="db-id">Database ID</label>
        <input
          type="text"
          id="db-id"
          value={dbId}
          onChange={onDBIdChange}
          required
        />
        <label htmlFor="desc-id">Description db ID</label>
        <input
          type="text"
          id="desc-id"
          value={descId}
          onChange={onDescIdChange}
          required
        />
        <label htmlFor="company">Company name</label>
        <input
          type="text"
          id="company"
          value={company}
          onChange={onCompanyChange}
          required
        />
        <label htmlFor="role">Role</label>
        <input
          type="text"
          id="role"
          value={role}
          onChange={onRoleChange}
          required
        />
        <label htmlFor="role">Job link</label>
        <input
          type="text"
          id="job-link"
          value={link}
          onChange={onJobLinkChange}
        />
        <button id="submitButton" onClick={() => handleSubmit}>
          Notion
        </button>
      </form>
      <p id="error-message">{errorMessage}</p>
    </React.Fragment>
  );
}
export default App;
