import { supabase } from '@/lib/supabase';
import { EventWithRelations, RawEventWithRelations, Tag } from '@/lib/types';
import { notFound } from 'next/navigation';

// Get all events (with status filter option)
export async function getEvents(status?: 'upcoming' | 'done' | 'canceled'): Promise<EventWithRelations[]> {
  let query = supabase
    .from('events')
    .select(`
      *,
      author:users(*),
      tags:event_tags(tag:tags(*))
    `);
    
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('event_date', { ascending: status === 'done' ? false : true });
  
  if (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
  
  // Process the data to match our EventWithRelations type
  return (data as RawEventWithRelations[]).map(item => {
    const event: EventWithRelations = {
      ...item,
      author: item.author,
      tags: item.tags?.map(tagRel => tagRel.tag) ?? null, // tagRel is now typed as EventTagRelation
      category: item.category ?? null,
    };
    
    return event;
  });
}

// Get upcoming events
export async function getUpcomingEvents(): Promise<EventWithRelations[]> {
  return getEvents('upcoming');
}

// Get a single event by ID
export async function getEventById(id: string): Promise<EventWithRelations> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      author:users(*),
      tags:event_tags(tag:tags(*))
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    notFound();
  }
  
  // Process the data to match our EventWithRelations type
  const event: EventWithRelations = {
    ...data,
    author: (data as RawEventWithRelations).author,
    tags: (data as RawEventWithRelations).tags?.map(tagRel => tagRel.tag) ?? null,
    category: (data as RawEventWithRelations).category ?? null,
  };
  
  return event;
}

// Get events by tag
export async function getEventsByTag(tagName: string): Promise<EventWithRelations[]> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      author:users(*),
      tags:event_tags!inner(tag:tags!inner(*))
    `)
    .eq('tags.tag.name', tagName)
    .order('event_date', { ascending: true });
  
  if (error) {
    console.error(`Error fetching events with tag ${tagName}:`, error);
    throw new Error('Failed to fetch events by tag');
  }
  
  // Process the data to match our EventWithRelations type
  return (data as RawEventWithRelations[]).map(item => {
    const event: EventWithRelations = {
      ...item,
      author: item.author,
      tags: item.tags?.map(tagRel => tagRel.tag) ?? null,
      category: item.category ?? null,
    };
    
    return event;
  });
}

// Get all event tags
export async function getAllEventTags(): Promise<Tag[]> {
  const { data: tagIds, error: subqueryError } = await supabase
    .from('event_tags')
    .select('tag_id');
  
  if (subqueryError) {
    console.error('Error fetching tag IDs:', subqueryError);
    throw new Error('Failed to fetch tag IDs');
  }
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .in('id', tagIds.map(tag => tag.tag_id));
  
  if (error) {
    console.error('Error fetching event tags:', error);
    throw new Error('Failed to fetch event tags');
  }
  
  return data;
}