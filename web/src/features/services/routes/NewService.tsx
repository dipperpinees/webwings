import { Route, Routes } from "react-router-dom";
import { CreateWebService, CreateWebStatic } from "../components/CreateServices";

export const NewServicesRoutes = () => {
    return (
      <Routes>
        <Route path="/web" element={<CreateWebService />} />
        <Route path="/static" element={<CreateWebStatic />} />
      </Routes>
    );
};