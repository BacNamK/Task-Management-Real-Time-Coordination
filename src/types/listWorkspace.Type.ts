export interface userType {
    id: string;
    name: string;
    image: string | null;
    role: string;
}

export interface workspace {
    id: string;
    name: string;
    slug: string;
    uuid: string;
    createdAt: Date | null;
}

export interface workspaceRp {
    yourOwn: onwType[];
    yourMem: onwType[];
}

export interface onwType {
    workspace: workspace;
    user: userType[];
}
