import { Container, Heading } from "@chakra-ui/react";

interface Props {
    children: React.ReactNode;
    title: string | React.ReactNode;
}

export function TitleLayout({ children, title }: Props) {
    return (
        <Container maxW="container.xl" py={6} px={8}>
            {typeof title === "string" ? (
                <Heading as="h3" fontSize="1.5rem" mb={6}>
                    {title}
                </Heading>
            ) : (
                title
            )}
            {children}
        </Container>
    );
}
