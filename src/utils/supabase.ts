import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getCurrentUser = async (request: NextRequest) => {
  const token = request.headers.get('Authorization')!;
  if (!token) {
    return { error: { message: 'No authorization token provided', status: 400 } };
  }
  const { data, error } = await supabase.auth.getUser(token);
console.log(data,error)
  if (!data) {
    return { error: { message: 'User not found', status: 400 } };
  }

  return { currentUser: data, error };
};