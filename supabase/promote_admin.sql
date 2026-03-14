-- Promote a user to admin by email.
-- Run in Supabase Dashboard -> SQL Editor.

update public.profiles
set role = 'admin'
where id in (
  select id
  from auth.users
  where email = 'chaitali.darji@bacancy.com'
);

-- Verify
select
  u.email,
  p.role
from auth.users u
join public.profiles p on p.id = u.id
where u.email = 'chaitali.darji@bacancy.com';
