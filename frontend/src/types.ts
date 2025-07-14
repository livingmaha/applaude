export interface User {
    id: number;
    email: string;
    username: string;
    is_superuser: boolean;
}

export interface BlogPost {
    id: number;
    title: string;
    content: string;
    main_image_url: string | null;
    author: User | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}
