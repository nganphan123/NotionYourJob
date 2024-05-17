import { Fragment, useState, useEffect, useCallback } from "react";
import { addDescriptionPage, addJob } from "../notion";
import { parsePage, extractCurrentPageHTML } from "../parsing";
import { getDBId } from "../store";
import { Navigate } from "react-router-dom";

export default function JobForm() {
  const [dbId, setDbId] = useState<string>("");
  const [descId, setDescId] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
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

  useEffect(() => {
    getDBId().then((value) => {
      setDbId(value);
    });
  });
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab: chrome.tabs.Tab = tabs[0];
      let tabUrl = activeTab.url;
      setLink(tabUrl ?? "");
    });
  }, [chrome.tabs]);

  if (dbId == "") {
    return <Navigate to={"/set-up-db"} />;
  }
  return (
    <Fragment>
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
    </Fragment>
  );
}
