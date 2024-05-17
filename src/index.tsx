import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import SetDBForm from "./components/SetUpDBForm";
import JobForm from "./components/JobForm";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";

const root = document.createElement("div");
root.className = "container";
document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);
const routes = [
  {
    path: "/set-up-db",
    element: <SetDBForm />,
  },
  {
    path: "/job",
    element: <JobForm />,
  },
];
const router = createMemoryRouter(routes, { initialEntries: ["/job"] });
rootDiv.render(
  <StrictMode>
    <RequireAuth>
      <RouterProvider router={router} />
    </RequireAuth>
  </StrictMode>
);
