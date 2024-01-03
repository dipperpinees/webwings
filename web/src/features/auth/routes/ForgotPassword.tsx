import { Route, Routes } from "react-router-dom";
import { ForgotPasswordRequest, ResetPasswordForm } from "../components";

export default function ForgotPassword() {
    return (
        <Routes>
            <Route path="" element={<ResetPasswordForm />}/>
            <Route path="request" element={<ForgotPasswordRequest />} />
        </Routes>
    )
}