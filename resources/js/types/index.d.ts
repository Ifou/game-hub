import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role?: string | null;
    avatar?: string;
    profile_picture?: string | null;
    background_picture?: string | null;
    birthdate?: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Game {
    id: number;
    title: string;
    description: string;
    category: string;
    tags: string[];
    version: string;
    min_players?: number;
    max_players?: number;
    file_path: string;
    thumbnail_path?: string;
    status: 'draft' | 'published' | 'archived';
    downloads_count: number;
    views_count: number;
    average_rating?: number;
    is_featured: boolean;
    user_id: number;
    user?: User;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Update {
    id: number;
    title: string;
    content: string;
    type: 'update' | 'patch' | 'hotfix' | 'announcement' | 'news';
    importance: 'low' | 'medium' | 'high' | 'critical';
    is_pinned: boolean;
    views_count: number;
    likes_count: number;
    comments_count: number;
    published_at: string;
    user_id: number;
    game_id?: number;
    user?: User;
    game?: Game;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Discussion {
    id: number;
    title: string;
    content: string;
    category: string;
    tags: string[];
    views_count: number;
    replies_count: number;
    upvotes: number;
    downvotes: number;
    is_locked: boolean;
    is_pinned: boolean;
    is_featured: boolean;
    last_activity_at: string;
    user_id: number;
    game_id?: number;
    user?: User;
    game?: Game;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Comment {
    id: number;
    content: string;
    upvotes: number;
    downvotes: number;
    is_moderator_comment: boolean;
    is_highlighted: boolean;
    edited_at?: string;
    parent_id?: number;
    commentable_type: string;
    commentable_id: number;
    user_id: number;
    user?: User;
    replies?: Comment[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
