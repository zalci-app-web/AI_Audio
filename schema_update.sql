-- Create purchases table if it doesn't exist
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  song_id uuid references public.songs not null,
  stripe_session_id text not null,
  amount integer not null,
  currency text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.purchases enable row level security;

-- Create policy to allow users to view their own purchases
create policy "Users can view own purchases"
on public.purchases
for select
to authenticated
using (auth.uid() = user_id);

-- Create policy to allow admin/service_role to insert purchases (for webhooks)
create policy "Service role can insert purchases"
on public.purchases
for insert
to service_role
with check (true);
