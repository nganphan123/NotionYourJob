import { Client } from "@notionhq/client";
import { getAcessToken, setDBId, setDescPageId } from "./store";

let apiKey: string = "";
let notion: Client;
getAcessToken().then((key) => {
  if (key != "") {
    apiKey = key;
    notion = new Client({ auth: apiKey });
  }
});

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
  let createDb = createJobDatabase(response.id).then(async (id) => {
    await setDBId(id);
  });
  let createDescContainer = setTimeout(() => {
    addDescContainer(response.id).then(async (id) => {
      await setDescPageId(id);
    });
  }, 1000);
  await createDb;
  await createDescContainer;
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
      Status: {
        select: {
          options: [
            { name: "Applied", color: "blue" },
            { name: "Ready to apply", color: "gray" },
            { name: "Rejected", color: "red" },
          ],
        },
      },
      Link: {
        url: {},
      },
      Description: {
        rich_text: {},
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

export async function addDescriptionPage(
  descId: string,
  description: string[]
) {
  const response = await notion.pages.create({
    parent: {
      type: "page_id",
      page_id: descId,
    },
    properties: {
      title: [
        {
          text: {
            content: "Job 1",
          },
        },
      ],
    },

    children: description.map((line: string) => ({
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: {
              content: line,
              link: null,
            },
          },
        ],
      },
    })),
  });
  return response.id;
}

export async function addJob(
  dbId: string,
  company: string,
  role: string,
  link: string,
  descriptionPageId: string
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
      Description: {
        type: "rich_text",
        rich_text: [
          {
            type: "mention",
            mention: {
              page: {
                id: descriptionPageId,
              },
            },
          },
        ],
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
