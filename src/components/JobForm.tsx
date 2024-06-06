import { Fragment, useState, useEffect, useCallback } from "react";
import { getDBId } from "../store";
import { Navigate } from "react-router-dom";
import { MessageType } from "../background";

export default function JobForm() {
  const [dbId, setDbId] = useState<string>();
  const [company, setCompany] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleSubmit = async () => {
    var chromeTabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    var activeTabId = chromeTabs[0].id;
    if (!activeTabId) {
      throw Error("Couldn't find active tab id");
    }
    chrome.runtime.sendMessage({
      type: MessageType.ADD_JOB,
      company: company,
      role: role,
      link: link,
      activeTabId: activeTabId,
    });
  };
  const onCompanyChange = useCallback((e: any) => {
    setCompany(e.target.value);
  }, []);
  const onRoleChange = useCallback((e: any) => {
    setRole(e.target.value);
  }, []);
  const onJobLinkChange = useCallback((e: any) => {
    setLink(e.target.value);
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

  if (dbId == undefined) {
    return <div>Loading</div>;
  } else if (dbId == "") {
    return <Navigate to={"/set-up-db"} />;
  }
  return (
    <Fragment>
      <form id="notion-form-data">
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
        <button id="submitButton" onClick={async () => await handleSubmit()}>
          Notion
        </button>
      </form>
      <p id="error-message">{errorMessage}</p>
    </Fragment>
  );
}
