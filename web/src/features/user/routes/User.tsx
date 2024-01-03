import { Route, Routes } from "react-router-dom";
import { UserSettings } from "../components";
import { TitleLayout } from "@/components";

export default function User() {
    return (
        <Routes>
            <Route
                path="settings"
                element={
                    <TitleLayout title="Account Settings">
                        <UserSettings />
                    </TitleLayout>
                }
            />
        </Routes>
    );
}
