const toPromise = (callback: any) => {
  const promise = new Promise((resolve, reject) => {
    try {
      callback(resolve, reject);
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

const DB_ID_KEY = "dbId";

export function getDBId() {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.get([DB_ID_KEY], (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      resolve(result ?? "");
    });
  });
}

export async function setDBId(id: string) {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.set({ [DB_ID_KEY]: id }),
      () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        resolve("Store db id successfully");
      };
  });
}

const DESC_PAGE_ID = "descPageId";
export function getDescPageId() {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.get([DESC_PAGE_ID], (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      resolve(result ?? "");
    });
  });
}

export async function setDescPageId(id: string) {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.set({ [DESC_PAGE_ID]: id }),
      () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        resolve("Store desc page id successfully");
      };
  });
}

const ACCESS_TOKEN = "accessToken";
export function getAcessToken() {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.get([ACCESS_TOKEN], (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      resolve(result ?? "");
    });
  });
}

export async function setAccessToken(id: string) {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.set({ [ACCESS_TOKEN]: id }),
      () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        resolve("Store access token successfully");
      };
  });
}
