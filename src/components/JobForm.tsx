import { useState, useEffect, useCallback } from "react";
import { getDBId } from "../store";
import { Navigate } from "react-router-dom";
import { MessageType } from "../background";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";

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
    <Stack spacing={2}>
      <FormControl required>
        <InputLabel htmlFor="company">Company</InputLabel>
        <OutlinedInput
          id="company"
          label="Company"
          onChange={onCompanyChange}
          size="small"
          sx={{ borderRadius: "50px" }}
        />
      </FormControl>
      <FormControl required>
        <InputLabel htmlFor="role">Role</InputLabel>
        <OutlinedInput
          id="role"
          label="Role"
          onChange={onRoleChange}
          size="small"
          sx={{ borderRadius: "50px" }}
        />
      </FormControl>
      <FormControl required>
        <InputLabel htmlFor="jobLink">Job Link</InputLabel>
        <OutlinedInput
          id="jobLink"
          label="Job Link"
          onChange={onJobLinkChange}
          defaultValue={link}
          size="small"
          sx={{ borderRadius: "50px" }}
        />
      </FormControl>
      <Button
        variant="contained"
        onClick={async () => await handleSubmit()}
        disabled={!company || !link || !role}
        sx={{ borderRadius: "50px" }}
      >
        Notion
      </Button>
    </Stack>
  );
}
