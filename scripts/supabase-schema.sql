-- ============================================
-- Portfolio App — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Abouts
create table abouts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  img_path text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Works (Portfolio Projects)
create table works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  project_link text,
  code_link text,
  img_path text not null,
  tags text[] not null default '{}',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Skills
create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bg_color text not null default '#edf2f8',
  icon_path text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Experiences (year groups)
create table experiences (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Experience Works (individual jobs under each year)
create table experience_works (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references experiences(id) on delete cascade,
  name text not null,
  company text not null,
  "desc" text,
  sort_order integer default 0
);

-- Testimonials
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  img_path text not null,
  feedback text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Brands
create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  img_path text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Contacts (form submissions)
create table contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- Row Level Security
-- ============================================

alter table abouts enable row level security;
alter table works enable row level security;
alter table skills enable row level security;
alter table experiences enable row level security;
alter table experience_works enable row level security;
alter table testimonials enable row level security;
alter table brands enable row level security;
alter table contacts enable row level security;

-- Public read for content tables
create policy "Public read" on abouts for select using (true);
create policy "Public read" on works for select using (true);
create policy "Public read" on skills for select using (true);
create policy "Public read" on experiences for select using (true);
create policy "Public read" on experience_works for select using (true);
create policy "Public read" on testimonials for select using (true);
create policy "Public read" on brands for select using (true);

-- Public insert for contact form
create policy "Public insert" on contacts for insert with check (true);

-- Authenticated (admin) full access on all tables
create policy "Admin all" on abouts for all using (auth.role() = 'authenticated');
create policy "Admin all" on works for all using (auth.role() = 'authenticated');
create policy "Admin all" on skills for all using (auth.role() = 'authenticated');
create policy "Admin all" on experiences for all using (auth.role() = 'authenticated');
create policy "Admin all" on experience_works for all using (auth.role() = 'authenticated');
create policy "Admin all" on testimonials for all using (auth.role() = 'authenticated');
create policy "Admin all" on brands for all using (auth.role() = 'authenticated');
create policy "Admin all" on contacts for all using (auth.role() = 'authenticated');

-- ============================================
-- Storage Bucket
-- Run this AFTER creating the bucket in the dashboard:
--   1. Go to Storage > New Bucket
--   2. Name: "portfolio-images"
--   3. Check "Public bucket"
-- Then run the policy below:
-- ============================================

-- Allow public read access to portfolio images
create policy "Public read images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload/update/delete images
create policy "Admin upload images"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

create policy "Admin update images"
  on storage.objects for update
  using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

create policy "Admin delete images"
  on storage.objects for delete
  using (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');
