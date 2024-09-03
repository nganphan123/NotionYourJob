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
import Logo from "./Logo";
import {
  extractCurrentPageHTML,
  parsePage,
  parsePage2,
} from "../parser/parsing";

export default function JobForm() {
  const [dbId, setDbId] = useState<string>();
  const [company, setCompany] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeTab, setTabId] = useState<chrome.tabs.Tab>();
  const handleSubmit = async () => {
    // TODO: refactor get active tab function
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
      location: location,
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
  const onLocationChange = useCallback((e: any) => {
    setLocation(e.target.value);
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
      if (!activeTab.id) {
        throw Error("couldn't find active tab id.");
      }
      extractCurrentPageHTML(activeTab.id)
        .then((html) => {
          // TODO: wait till page finished loading to get correct component
          let result = parsePage2(html, tabUrl ?? "");
          if (result) {
            setRole(result.title ?? "");
            setCompany(result.company ?? "");
            // TODO: add location
            result.location ? setLocation(result.location) : null;
          }
        })
        .catch((e) => {
          throw Error(e);
        });
    });
  }, [chrome.tabs]);

  if (dbId == undefined) {
    return <div>Loading</div>;
  } else if (dbId == "") {
    return <Navigate to={"/set-up-db"} />;
  }
  return (
    <Stack spacing={2} alignItems={"center"}>
      <Logo width={100} height={50} />
      <FormControl required>
        <InputLabel htmlFor="company">Company</InputLabel>
        <OutlinedInput
          id="company"
          label="Company"
          onChange={onCompanyChange}
          size="small"
          value={company}
        />
      </FormControl>
      <FormControl required>
        <InputLabel htmlFor="role">Role</InputLabel>
        <OutlinedInput
          id="role"
          label="Role"
          onChange={onRoleChange}
          size="small"
          value={role}
        />
      </FormControl>
      <FormControl>
        <InputLabel htmlFor="location">Location</InputLabel>
        <OutlinedInput
          id="location"
          label="Location"
          onChange={onLocationChange}
          size="small"
          value={location}
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
        />
      </FormControl>
      <Button
        sx={{
          backgroundColor: "#92A0AD",
          ":hover": { backgroundColor: "lightslategrey" },
        }}
        variant="contained"
        onClick={async () => await handleSubmit()}
        disabled={!company || !link || !role}
      >
        Notion
      </Button>
    </Stack>
  );
}
