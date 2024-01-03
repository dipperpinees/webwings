import { Route, Routes } from "react-router-dom";
import { NewServicesRoutes } from "./NewService";

export const ServicesRoutes = () => {
    return (
      <Routes>
        <Route path="/new/*" element={<NewServicesRoutes />} />
      </Routes>
    );
};