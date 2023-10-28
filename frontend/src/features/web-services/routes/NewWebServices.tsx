import { useState } from 'react';
import SelectRepositories from '../components/SelectRepositories';
import { GithubRepo } from '../types/Repositories';
import CreateWebService from '../components/CreateWebService';

export default function WebServices() {
    const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);

    if (selectedRepo) {
        return <CreateWebService repo={selectedRepo}/>;
    }

    return <SelectRepositories setSelectedRepo={setSelectedRepo}/>;
}
