import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

export function SearchRepo() {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({...searchParams, "q": e.target.value})  
    }

    return (
        <InputGroup>
            <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input onChange={handleSearch} type="text" placeholder="Search..." fontSize="sm" />
        </InputGroup>
    );
}
