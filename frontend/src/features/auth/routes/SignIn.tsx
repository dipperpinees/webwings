import { Container } from "@chakra-ui/react";
import SignInForm from "../components/SignInForm";

export default function SignIn() {
    return (<Container h="100vh" display="flex" alignItems="center" justifyContent="center">
        <SignInForm />
    </Container>)
}