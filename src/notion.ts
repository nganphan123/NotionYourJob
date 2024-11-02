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
let descContainerId: string = "";
let dbId: string = "";
let resumeDBId: string = "";
const refreshTime = 1000;
getAcessToken().then((key) => {
  if (key != "") {
    apiKey = key;
    notion = new Client({ auth: apiKey });
  }
});
getDescContainerId().then((id) => {
  if (id != "") {
    descContainerId = id;
  }
});
getDBId().then((id) => {
  if (id != "") {
    dbId = id;
  }
});
getResumeDBId().then((id) => {
  if (id != "") {
    resumeDBId = id;
  }
});

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
  let createDb = createJobDatabase(response.id).then(async (id) => {
    await setDBId(id);
  });
  let createDescContainer = addDescContainer(response.id).then(async (id) => {
    await setDescContainerId(id);
  });
  let createResumeDb = createResumeDatabase(response.id).then(async (id) => {
    await setResumeDBId(id);
  });
  console.log("start 1st time out");
  await delay(refreshTime);
  console.log("done 1st time out");
  console.log("call create desc container api");
  await createDescContainer;
  console.log("done create desc container api");
  console.log("start 2nd time out");
  await delay(refreshTime);
  console.log("finish second time out");
  console.log("call crate resume db api");
  await createResumeDb;
  console.log("finish create resume db api");
  await delay(refreshTime);
  await createDb;
}

// job database
async function createJobDatabase(parentPageId: string) {
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
        relation: [{ id: resumeId }],
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
  const response = await notion.databases.query({
    database_id: resumeDBId,
  });
  return response.results;
}
