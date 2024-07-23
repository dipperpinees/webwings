import { Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import OAuth from "./OAuth";
import ForgotPassword from "./ForgotPassword";

export const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="sign-up" element={<SignUp />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="oauth/github" element={<OAuth />} />
            <Route path="reset-password/*" element={<ForgotPassword />} />
        </Routes>
    );
};
