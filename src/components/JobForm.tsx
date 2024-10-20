import { useState, useEffect, useCallback } from "react";
import { getDBId } from "../store";
import { Navigate } from "react-router-dom";
import { MessageType } from "../background";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from "@mui/material";
import Logo from "./Logo";
import {
  extractCurrentPageHTML,
  parsePage,
  parsePage2,
} from "../parser/parsing";
import { Status } from "../notion";

export default function JobForm() {
  const [dbId, setDbId] = useState<string>();
  const [company, setCompany] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [status, setStatus] = useState<string>(Status.READY_TO_APPLY);
  const [link, setLink] = useState<string>("");
  const [onSubmitting, setOnSubmitting] = useState<boolean>(false);
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
      status: status,
      activeTabId: activeTabId,
    });
    setOnSubmitting(true);
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
  const onStatusChange = useCallback((e: any) => {
    setStatus(e.target.value);
  }, []);

  // restric submit button click
  useEffect(() => {
    if (onSubmitting) {
      const timer = setTimeout(() => {
        setOnSubmitting(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [onSubmitting]);

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

  // chrome.runtime.onMessage.addListener((message: JobInfo) => {
  //   console.log("got message " + message);
  // });

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
      <FormControl sx={{ m: 1, width: "100%" }} size="small">
        <InputLabel>Status</InputLabel>
        <Select value={status} label="Status" onChange={onStatusChange}>
          <MenuItem value={Status.APPLIED}>{Status.APPLIED}</MenuItem>
          <MenuItem value={Status.READY_TO_APPLY}>
            {Status.READY_TO_APPLY}
          </MenuItem>
          <MenuItem value={Status.REJECTED}>{Status.REJECTED}</MenuItem>
        </Select>
      </FormControl>
      <Button
        sx={{
          backgroundColor: "#92A0AD",
          ":hover": { backgroundColor: "lightslategrey" },
          margin: "10px",
        }}
        variant="contained"
        onClick={async () => await handleSubmit()}
        disabled={!company || !link || !role || onSubmitting}
      >
        Notion
      </Button>
    </Stack>
  );
}
