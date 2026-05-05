// src/lib/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          website: string | null
          role: 'user' | 'admin'
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          website?: string | null
          role?: 'user' | 'admin'
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          website?: string | null
          role?: 'user' | 'admin'
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          domain: 'frontend' | 'backend' | 'data'
          type: 'feature' | 'bug' | 'refactor' | 'data' | 'research'
          status: 'backlog' | 'ready' | 'in_progress' | 'blocked' | 'review' | 'done'
          priority: 'low' | 'medium' | 'high' | 'critical'
          due_date: string | null
          impact: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          domain: 'frontend' | 'backend' | 'data'
          type: 'feature' | 'bug' | 'refactor' | 'data' | 'research'
          status?: 'backlog' | 'ready' | 'in_progress' | 'blocked' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          due_date?: string | null
          impact?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          domain?: 'frontend' | 'backend' | 'data'
          type?: 'feature' | 'bug' | 'refactor' | 'data' | 'research'
          status?: 'backlog' | 'ready' | 'in_progress' | 'blocked' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          due_date?: string | null
          impact?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      task_dependencies: {
        Row: {
          id: string
          task_id: string
          depends_on_task_id: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          depends_on_task_id: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          depends_on_task_id?: string
          created_at?: string
        }
      }
    }
  }
}