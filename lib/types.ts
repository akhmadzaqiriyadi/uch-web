// lib/types.ts

// Tipe untuk User
export type User = {
    id: string;
    created_at: string;
    email: string;
    full_name: string;
    role: 'admin' | 'editor' | 'member';
    avatar_url: string | null;
  };
  
  // Tipe untuk Tag
  export type Tag = {
    id: string;
    name: string;
  };
  
  // Tipe untuk Category
  export type Category = {
    id: string;
    name: string;
    type: 'article' | 'event';
  };
  
  // Tipe untuk Article
  export type Article = {
    id: string;
    created_at: string;
    title: string;
    content: string | null;
    image_url: string | null;
    author_id: string | null;
    status: 'draft' | 'published';
    slug: string;
  };
  
  // Tipe untuk Article dengan relasi-relasinya
  export type ArticleWithRelations = Article & {
    author?: User | null;
    tags?: Tag[] | null;
    category?: Category | null;
  };
  
  // Tipe untuk Event
  export type Event = {
    id: string;
    created_at: string;
    title: string;
    description: string | null;
    event_date: string;
    location: string | null;
    image_url: string | null;
    author_id: string | null;
    status: 'upcoming' | 'done' | 'canceled';
  };
  
  // Tipe untuk relasi event_tags (join table)
  export type EventTagRelation = {
    tag: Tag;
  };
  
  // Tipe untuk Event dengan relasi-relasinya
  export type EventWithRelations = Event & {
    author?: User | null;
    tags?: Tag[] | null;
    category?: Category | null;
  };
  
  // Tipe untuk hasil query Supabase (opsional, untuk tipe mentah)
  export type RawEventWithRelations = Event & {
    author?: User | null;
    tags?: EventTagRelation[] | null; // Reflects the Supabase query structure
    category?: Category | null;
  };