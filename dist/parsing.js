(()=>{"use strict";({804:function(e,t){var r=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(o,i){function u(e){try{a(n.next(e))}catch(e){i(e)}}function c(e){try{a(n.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(u,c)}a((n=n.apply(e,t||[])).next())}))};function n(e){let t;if(e){if(t=document.querySelector(e),!t)throw Error("querySelector failed to find node")}else t=document.documentElement;return t.outerHTML}Object.defineProperty(t,"__esModule",{value:!0}),t.extractCurrentPageHTML=t.parsePage=void 0,t.parsePage=function(e){let t=document.createElement("html");t.innerHTML=e;const r=t.querySelectorAll("li");let n=[];return r.forEach((e=>{n.push(e.innerText)})),n},t.extractCurrentPageHTML=function(){return r(this,void 0,void 0,(function*(){let e;return yield chrome.tabs.query({active:!0,currentWindow:!0}).then((function(e){var t=e[0].id;if(!t)throw Error("Couldn't find active tab id");return chrome.scripting.executeScript({target:{tabId:t},func:n})})).then((function(t){if(!t[0].result)throw Error("Some error happened. Couldn't parse page.");e=t[0].result})),e}))}}})[804](0,{})})();