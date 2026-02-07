-- Create songs table
create table public.songs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  price integer not null,
  preview_url text not null,
  image_url text not null,
  stripe_price_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.songs enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
on public.songs
for select
to public
using (true);

-- Optional: Insert dummy data for testing
insert into public.songs (title, price, preview_url, image_url, stripe_price_id)
values 
  ('Cyberpunk City', 1500, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1515630278258-407f66498911', 'price_dummy_1'),
  ('Ambient Space', 1000, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', 'price_dummy_2');
