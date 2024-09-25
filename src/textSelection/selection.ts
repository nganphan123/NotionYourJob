import "./selection.css";
// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = "crx_mouse_visited";

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM: HTMLElement | null = null;

// Mouse listener for any move event on the current document.
document.addEventListener(
  "mousemove",
  function (e) {
    var srcElement = e.target;

    if (prevDOM != null) {
      prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
    }

    // Add a visited class name to the element. So we can style it.
    if (srcElement != null && srcElement instanceof HTMLElement) {
      srcElement.classList.add(MOUSE_VISITED_CLASSNAME);

      // The current element is now the previous. So we can remove the class
      // during the next iteration.
      prevDOM = srcElement;
      console.log("selected dom ", prevDOM);
    }
  },
  false
);