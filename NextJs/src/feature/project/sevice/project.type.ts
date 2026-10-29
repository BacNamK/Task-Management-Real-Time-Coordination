export interface project {
    uuid: string;
    name: string;
    createdAt: Date;
    slug: string;
    description: string;
    _count?: { members: number; boards: number };
}

export interface projectOwner {
    name: string | null;
    image: string | null;
}

export interface projectListItem {
    project: project;
    owner: projectOwner;
}

export interface projectCollections {
    yourOwn: projectListItem[];
    yourMem: projectListItem[];
}

export interface projectMember {
    id?: string | number;
    name?: string | null;
    role?: string | null;
    avatar?: string | null;
    user?: {
        id?: string | number;
        name?: string | null;
        image?: string | null;
    } | null;
}

export type projectMemberSearchResult =
    | { user: { id: string; name: string | null; image: string | null }; projectId: string }
    | { message: string }
    | string;

export interface projectDetail extends project {
    boards: Array<{
        id: string;
        title: string;
        description: string;
        _count?: { cycle?: number; tasks?: number };
    }>;
    members: projectMember[];
}

export type createprojectDto = Pick<project, 'name'>;
