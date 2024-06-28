import { Route, Routes } from "react-router-dom";
import { CreateWebService } from "../components/CreateServices";

export const NewServicesRoutes = () => {
    return (
        <Routes>
            <Route path="/web" element={<CreateWebService />} />
        </Routes>
    );
};
