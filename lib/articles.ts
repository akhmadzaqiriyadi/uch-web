// lib/articles.ts

import { supabase } from './supabase';
import type { Article, ArticleWithRelations, Tag, User } from './types';

// Mengambil semua artikel yang published
export async function getPublishedArticles(): Promise<ArticleWithRelations[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:users(id, full_name, avatar_url),
      tags:article_tags(tags(*))
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }

  return (data ?? []).map((article: any) => ({
    ...article,
    author: article.author as User,
    tags: (article.tags as { tags: Tag }[])?.map(tag => tag.tags),
  }));
}

// Mengambil artikel berdasarkan slug
export async function getArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:users(id, full_name, avatar_url),
      tags:article_tags(tags(*))
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    return null;
  }

  return {
    ...data,
    author: data.author as User,
    tags: (data.tags as { tags: Tag }[])?.map(tag => tag.tags),
  };
}



// Fungsi untuk membuat slug dari judul
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Hapus karakter spesial
    .replace(/\s+/g, '-')     // Ganti spasi dengan tanda hubung
    .replace(/-+/g, '-')      // Hapus tanda hubung berlebih
    .trim();                  // Hapus spasi di awal dan akhir
}


// Mengambil artikel berdasarkan nama tag
export async function getArticlesByTag(tagName: string): Promise<ArticleWithRelations[]> {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:users(id, full_name, avatar_url),
        tags:article_tags!inner(tags!inner(*))
      `)
      .eq('status', 'published')
      .eq('tags.tags.name', tagName)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error(`Error fetching articles with tag ${tagName}:`, error);
      throw error;
    }
  
    return (data ?? []).map((article: any) => ({
      ...article,
      author: article.author as User,
      tags: (article.tags as { tags: Tag }[])?.map(tag => tag.tags),
    }));
  }
  
  // Optional: Add a function to get all available tags
  export async function getAllTags(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
  
    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  
    return data ?? [];
  }