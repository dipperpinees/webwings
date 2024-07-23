import { Route, Routes } from "react-router-dom";
import SelectRepositories from "./SelectRepositories";

export const SelectRepoRoutes = () => {
    return (
      <Routes>
        <Route path="/:type" element={<SelectRepositories />} />
      </Routes>
    );
};