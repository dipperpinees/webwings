import { Route, Routes } from "react-router-dom";
import NewWebServices from "./NewWebServices";

export const WebServicesRoutes = () => {
    return (
      <Routes>
        <Route path="/new" element={<NewWebServices />} />
      </Routes>
    );
};