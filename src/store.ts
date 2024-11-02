// Turn a function to Promise
const toPromise = (callback: any) => {
  const promise = new Promise<string>((resolve, reject) => {
    try {
      callback(resolve, reject);
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

const DB_ID_KEY = "dbId";

// Jobs database Id
export function getDBId() {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.get([DB_ID_KEY], (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      resolve(result[DB_ID_KEY] ?? "");
    });
  });
}

export async function setDBId(id: string) {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.set({ [DB_ID_KEY]: id }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve("Store db id successfully");
    });
  });
}

// Description Page Id
const DESC_PAGE_ID = "descPageId";
export function getDescContainerId() {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.get([DESC_PAGE_ID], (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      resolve(result[DESC_PAGE_ID] ?? "");
    });
  });
}

export async function setDescContainerId(id: string) {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.set({ [DESC_PAGE_ID]: id }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve("Store desc page id successfully");
    });
  });
}

// Resume db Id
const RESUME_DB_ID = "resumeDBId";
export function getResumeDBId() {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.get([RESUME_DB_ID], (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      resolve(result[RESUME_DB_ID] ?? "");
    });
  });
}

export async function setResumeDBId(id: string) {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.set({ [RESUME_DB_ID]: id }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve("Store resume db id successfully");
    });
  });
}

const ACCESS_TOKEN = "accessToken";
export function getAcessToken() {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.get([ACCESS_TOKEN], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(result[ACCESS_TOKEN] ?? "");
    });
  });
}

export async function setAccessToken(token: string) {
  return toPromise((resolve: any, reject: any) => {
    chrome.storage.local.set({ [ACCESS_TOKEN]: token }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve("Store access token successfully");
    });
  });
}
