import { useState, useEffect, useCallback } from "react";
import { getDBId } from "../store";
import { Navigate } from "react-router-dom";
import { MessageType } from "../background";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from "@mui/material";
import Logo from "./Logo";
import { extractCurrentPageHTML, parsePage2 } from "../parser/parsing";
import { getResumeDBURL, getResumes, Status } from "../notion";
import { isOfTypeNotionPage } from "../utils/checkType";
import { findNotionPageTitle } from "../utils/findProp";
import { RemoveRedEyeOutlined } from "@mui/icons-material";

interface Resume {
  name: string;
  id: string;
  url: string;
}
export default function JobForm() {
  const [dbId, setDbId] = useState<string>();
  const [company, setCompany] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [status, setStatus] = useState<string>(Status.READY_TO_APPLY);
  const [link, setLink] = useState<string>("");
  const [resumeId, setResumeId] = useState<string>("");
  const [resumeList, setResumeList] = useState<Resume[]>([]);
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
      resumeId: resumeId,
    });
    setOnSubmitting(true);
  };
  const handleRedirectClick = async (url: string) => {
    chrome.tabs.create({ url: url });
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
  const onResumeChange = useCallback((e: any) => {
    setResumeId(e.target.value);
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
    getResumes().then((values) => {
      const pageObjects = values.filter((value) => isOfTypeNotionPage(value));
      const resumes = [] as Resume[];
      pageObjects.forEach((value) => {
        const pageObj = value as PageObjectResponse;
        const pageTitle = findNotionPageTitle(pageObj);
        if (pageTitle != "") {
          resumes.push({
            url: pageObj.url,
            name: pageTitle,
            id: pageObj.id,
          });
        }
      });
      setResumeList(resumes);
    });
  }, []);
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
      <FormControl sx={{ m: 1, width: "100%" }} size="small">
        <InputLabel>Resume</InputLabel>
        <Select value={resumeId} label="Resume" onChange={onResumeChange}>
          {resumeList.length > 0 ? (
            resumeList.map((resume) => (
              <MenuItem value={resume.id}>
                <Container>
                  {resume.name}
                  <IconButton
                    onClick={async () => handleRedirectClick(resume.url)}
                    size="small"
                  >
                    <RemoveRedEyeOutlined />
                  </IconButton>
                </Container>
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <Stack alignItems={"center"}>
                <div style={{ fontSize: "12px" }}>
                  Not found. Upload new resume.
                </div>
                <Button
                  sx={{
                    backgroundColor: "#92A0AD",
                    ":hover": { backgroundColor: "lightslategrey" },
                    margin: "10px",
                  }}
                  variant="contained"
                  onClick={async () => {
                    const resumeDBURL = await getResumeDBURL();
                    await handleRedirectClick(resumeDBURL);
                  }}
                >
                  Upload
                </Button>
              </Stack>
            </MenuItem>
          )}
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
