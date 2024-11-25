import { Client } from "@notionhq/client";
import {
  getAcessToken,
  getDBId,
  getDescContainerId,
  getResumeDBId,
  setDBId,
  setDescContainerId,
  setResumeDBId,
} from "./store";

let apiKey: string = "";
let notion: Client;
let dbId: string = "";
const refreshTime = 1000;

async function initialize() {
  const key = await getAcessToken();
  if (key != "") {
    apiKey = key;
    notion = new Client({ auth: apiKey });
  }

  const dbIdValue = await getDBId();
  if (dbIdValue != "") {
    dbId = dbIdValue;
  }
}

initialize();

export enum Status {
  APPLIED = "Applied",
  READY_TO_APPLY = "Ready to apply",
  REJECTED = "Rejected",
}

// parent page containing job database and description container
export async function setupNotion(workspaceId: string) {
  const response = await notion.pages.create({
    parent: {
      type: "page_id",
      page_id: workspaceId,
    },
    properties: {
      title: [
        {
          type: "text",
          text: {
            content: "Notion Your Job",
          },
        },
      ],
    },
  });

  let delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Add job description database in notions
  const descContainerId = await addDescContainer(response.id);
  await setDescContainerId(descContainerId);
  await delay(refreshTime);

  // Add resume database in notion
  const resumeDbId = await createResumeDatabase(response.id);
  await setResumeDBId(resumeDbId);
  await delay(refreshTime);

  // Add main job database in notion
  const jobDbId = await createJobDatabase(response.id);
  await setDBId(jobDbId);
}

// job database
async function createJobDatabase(parentPageId: string) {
  const resumeDBId = await getResumeDBId();
  const response = await notion.databases.create({
    parent: {
      type: "page_id",
      page_id: parentPageId,
    },
    title: [
      {
        type: "text",
        text: {
          content: "Database",
        },
      },
    ],
    properties: {
      Company: {
        title: {},
      },
      Role: {
        rich_text: {},
      },
      Location: {
        rich_text: {},
      },
      Status: {
        select: {
          options: [
            { name: Status.APPLIED, color: "blue" },
            { name: Status.READY_TO_APPLY, color: "gray" },
            { name: Status.REJECTED, color: "red" },
          ],
        },
      },
      Link: {
        url: {},
      },
      Description: {
        rich_text: {},
      },
      Resumes: {
        relation: {
          database_id: resumeDBId,
          single_property: {},
        },
      },
    },
  });
  return response.id;
}

// description container
async function addDescContainer(parentPageId: string) {
  const response = await notion.pages.create({
    parent: {
      type: "page_id",
      page_id: parentPageId,
    },
    properties: {
      title: [
        {
          text: {
            content: "Job Description",
          },
        },
      ],
    },
  });
  return response.id;
}

// resume database
async function createResumeDatabase(parentPageId: string) {
  const response = await notion.databases.create({
    parent: {
      type: "page_id",
      page_id: parentPageId,
    },
    title: [
      {
        type: "text",
        text: {
          content: "Resumes",
        },
      },
    ],
    properties: {
      Name: {
        title: {},
      },
      File: {
        files: {},
      },
    },
  });
  return response.id;
}

export async function addDescriptionPage(description: string[], title: string) {
  const descContainerId = await getDescContainerId();
  const response = await notion.pages.create({
    parent: {
      type: "page_id",
      page_id: descContainerId,
    },
    properties: {
      title: [
        {
          text: {
            content: title,
          },
        },
      ],
    },

    //   children: description.map((line: string) => ({
    //     bulleted_list_item: {
    //       rich_text: [
    //         {
    //           type: "text",
    //           text: {
    //             content: line,
    //             link: null,
    //           },
    //         },
    //       ],
    //     },
    //   })),
    // TODO: temporary -> remove
    children: [
      {
        bulleted_list_item: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "",
                link: null,
              },
            },
          ],
        },
      },
    ],
  });
  return response.id;
}

export async function addJob(
  company: string,
  role: string,
  location: string,
  link: string,
  descPageId: string,
  status: string,
  resumeId: string
) {
  await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: dbId,
    },
    properties: {
      Company: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: company,
            },
          },
        ],
      },
      Location: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: location,
            },
          },
        ],
      },
      Role: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: role,
            },
          },
        ],
      },
      Link: {
        type: "url",
        url: link,
      },
      Status: {
        type: "select",
        select: {
          name: status,
        },
      },
      Description: {
        type: "rich_text",
        rich_text: [
          {
            type: "mention",
            mention: {
              page: {
                id: descPageId,
              },
            },
          },
        ],
      },
      Resumes: {
        type: "relation",
        relation: resumeId != "" ? [{ id: resumeId }]:[],
      },
    },
  });
}

export async function getAccessiblePages() {
  const response = await notion.search({
    filter: {
      value: "page",
      property: "object",
    },
  });
  return response.results;
}

export async function getResumes() {
  const resumeDBId = await getResumeDBId();
  const response = await notion.databases.query({
    database_id: resumeDBId,
  });
  return response.results;
}
