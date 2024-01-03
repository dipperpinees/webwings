import { Text, TextProps } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface LogoProps {
    styles?: TextProps;
    redirect?: string;
}

export function Logo({ styles = {}, redirect = "/" }: LogoProps) {
    return (
        <Link to={redirect}>
            <Text as="h5" fontWeight={900} fontSize={24} {...styles}>
                Webwings
            </Text>
        </Link>
    );
}
