import { useEffect, useState } from "react";
import "./App.css";
import { getDBId } from "./store";
import JobForm from "./components/JobForm";
import SetDBForm from "./components/SetUpDBForm";

function App() {
  const [dbId, setDbId] = useState<boolean>(false);
  useEffect(() => {
    getDBId().then((value) => {
      if (value != "") {
        setDbId(true);
      }
    });
  });
  if (dbId) {
    return <JobForm />;
  } else {
    return <SetDBForm />;
  }
}

export default App;
