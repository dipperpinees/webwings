import { Route, Routes } from "react-router-dom";
import { NewServicesRoutes } from "./NewService";
import { ServiceMonitorRoutes } from "./ServiceMonitor";

export const ServicesRoutes = () => {
    return (
      <Routes>
        <Route path="/new/*" element={<NewServicesRoutes />} />
        <Route path="/monitor/:id" element={<ServiceMonitorRoutes />} />
      </Routes>
    );
};