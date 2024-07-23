import authFetch from "@/utils/auth-fetch";
import { OAUTH_TYPE } from "@/utils/get-github-url";
import { Center, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignInGithub } from "..";

export default function OAuth() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const {mutateAsync: signInGithubHandler} = useSignInGithub();

    useEffect(() => {
        if (!search) return;
        (async () => {
            const searchParams = new URLSearchParams(search);
            const code = searchParams.get("code");
            const state = searchParams.get("state") || "/";
            const type = Number(searchParams.get("type")) as OAUTH_TYPE;
            if (type === OAUTH_TYPE["GRANT"]) {
                await authFetch("/user/grant/github?code=" + code, { method: "POST" });
            } 

            if (type === OAUTH_TYPE["SIGNIN"] && code) {
                await signInGithubHandler(code);
            }
            navigate(state)
        })();
    }, [search, navigate]);

    return <Center height="100vh">
         <Spinner size="xl" color="teal" />
    </Center>;
}
