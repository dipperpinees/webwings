import { Container } from "@chakra-ui/react";
import SignUpForm from "../components/SignUpForm";

export default function SignUp() {
    return (<Container h="100vh" display="flex" alignItems="center" justifyContent="center">
        <SignUpForm />
    </Container>)
}