import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type User = Database['public']['Tables']['users']['Row'];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      login: async (email, password) => {
        try {
          const {
            data: { user: authUser },
            error: authError,
          } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError || !authUser) {
            console.error('Authentication error:', authError);
            return false;
          }

          // fetch existing user profile
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, name, is_admin, created_at')
            .eq('id', authUser.id)
            .maybeSingle();

          if (userError) {
            console.error('User data fetch error:', userError);
            return false;
          }

          // создание аккаунта если такого юзера нет
          if (!userData) {
            const { data: newUserData, error: createError } = await supabase
              .from('users')
              .insert([
                {
                  id: authUser.id,
                  email: authUser.email,
                  name: authUser.user_metadata?.name || email.split('@')[0],
                  is_admin: false,
                },
              ])
              .select('id, email, name, is_admin, created_at')
              .single();

            if (createError || !newUserData) {
              console.error('Failed to create user profile:', createError);
              return false;
            }

            set({
              user: newUserData,
              isAuthenticated: true,
              isAdmin: newUserData.is_admin,
            });

            return true;
          }

          // set state with existing user profile
          set({
            user: userData,
            isAuthenticated: true,
            isAdmin: userData.is_admin,
          });

          return true;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      register: async (name, email, password) => {
        try {
          // first sign up with supabase
          const {
            data: { user: authUser },
            error: signUpError,
          } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name, // include name in metadata
              },
            },
          });

          if (signUpError) {
            // проверка на наличие юзера
            if (signUpError.message === 'User already registered') {
              return {
                success: false,
                error:
                  'This email is already registered. Please try logging in instead.',
              };
            }
            // другие ошибки
            return {
              success: false,
              error: 'Failed to create account. Please try again.',
            };
          }

          if (!authUser) {
            return {
              success: false,
              error: 'Failed to create account. Please try again.',
            };
          }

          // create the user profile in our users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([
              {
                id: authUser.id,
                email,
                name,
                is_admin: false,
              },
            ])
            .select('id, email, name, is_admin, created_at')
            .single();

          if (userError) {
            console.error('User profile creation error:', userError);
            // clean auth user if profile creation fails
            await supabase.auth.admin.deleteUser(authUser.id);
            return {
              success: false,
              error: 'Failed to create user profile. Please try again.',
            };
          }

          // set user state
          set({
            user: userData,
            isAuthenticated: true,
            isAdmin: false,
          });

          return {
            success: true,
          };
        } catch (error) {
          console.error('Registration error:', error);
          return {
            success: false,
            error: 'An unexpected error occurred. Please try again.',
          };
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
