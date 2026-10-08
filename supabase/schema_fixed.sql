
-- ContCrops FIXED SCHEMA - يحل مشكلة uuid vs bigint
-- امسح القديم واعمل الجديد - نفس التصميم بالظبط

-- 1. امسح كل حاجة قديمة
drop table if exists crop_likes cascade;
drop table if exists follows cascade;
drop table if exists messages cascade;
drop table if exists discussion_comments cascade;
drop table if exists crop_comments cascade;
drop table if exists discussions cascade;
drop table if exists crops cascade;
drop table if exists colleagues cascade;

-- 2. اعمل الجداول من جديد - كلها bigint متوافقة
create table colleagues (
  id bigserial primary key,
  name text not null,
  city text,
  crops int default 0,
  followers int default 0,
  following int default 0,
  rating float default 4.9,
  online boolean default true,
  avatar text,
  cover text,
  specialty text,
  bio text,
  created_at timestamp default now()
);

create table crops (
  id bigserial primary key,
  name text not null,
  farmer text,
  farmer_id bigint references colleagues(id) on delete set null,
  city text,
  price text,
  qty text,
  category text check (category in ('فريش','مجمد','مجفف','محطات فرز وتعبئة','مستلزمات زراعة','مستلزمات انتاج','نقل ولوجيستك')),
  img text,
  avatar text,
  verified boolean default false,
  likes int default 0,
  comments int default 0,
  description text,
  created_at timestamp default now()
);

create table crop_comments (
  id bigserial primary key,
  crop_id bigint references crops(id) on delete cascade,
  user_name text,
  avatar text,
  text text,
  created_at timestamp default now()
);

create table discussions (
  id bigserial primary key,
  farmer_id bigint references colleagues(id) on delete set null,
  text text,
  likes int default 0,
  reposts int default 0,
  comments int default 0,
  created_at timestamp default now()
);

create table discussion_comments (
  id bigserial primary key,
  discussion_id bigint references discussions(id) on delete cascade,
  user_name text,
  text text,
  created_at timestamp default now()
);

create table messages (
  id bigserial primary key,
  sender_id bigint references colleagues(id) on delete set null,
  receiver_id bigint references colleagues(id) on delete set null,
  text text,
  read boolean default false,
  created_at timestamp default now()
);

create table follows (
  id bigserial primary key,
  follower_id bigint references colleagues(id) on delete cascade,
  following_id bigint references colleagues(id) on delete cascade,
  created_at timestamp default now(),
  unique(follower_id, following_id)
);

create table crop_likes (
  id bigserial primary key,
  crop_id bigint references crops(id) on delete cascade,
  user_id bigint references colleagues(id) on delete cascade,
  created_at timestamp default now(),
  unique(crop_id, user_id)
);

-- RLS + Policies
alter table colleagues enable row level security;
alter table crops enable row level security;
alter table crop_comments enable row level security;
alter table discussions enable row level security;
alter table discussion_comments enable row level security;
alter table messages enable row level security;
alter table follows enable row level security;
alter table crop_likes enable row level security;

create policy "public read" on colleagues for select using (true);
create policy "public all" on colleagues for all using (true) with check (true);
create policy "public read" on crops for select using (true);
create policy "public all" on crops for all using (true) with check (true);
create policy "public read" on crop_comments for select using (true);
create policy "public all" on crop_comments for all using (true) with check (true);
create policy "public read" on discussions for select using (true);
create policy "public all" on discussions for all using (true) with check (true);
create policy "public read" on discussion_comments for select using (true);
create policy "public all" on discussion_comments for all using (true) with check (true);
create policy "public read" on messages for select using (true);
create policy "public all" on messages for all using (true) with check (true);
create policy "public read" on follows for select using (true);
create policy "public all" on follows for all using (true) with check (true);
create policy "public read" on crop_likes for select using (true);
create policy "public all" on crop_likes for all using (true) with check (true);

-- بيانات تجريبية
insert into colleagues (name, city, crops, followers, following, rating, online, avatar, specialty, bio, cover) values
('أحمد المزارع','المنصورة',24,120,80,4.9,true,'https://i.pravatar.cc/100?img=12','خضروات','مزارع خضروات خبرة 15 سنة - المنصورة','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'),
('فاطمة للشتلات','القليوبية',18,95,60,4.8,true,'https://i.pravatar.cc/100?img=26','شتلات','مشتل شتلات هجين ومقاومة','https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'),
('محمد الفكهاني','الإسماعيلية',32,210,90,5.0,false,'https://i.pravatar.cc/100?img=15','فواكه','فواكه طازجة يوميا','https://images.unsplash.com/photo-1553279768-865429fa0078?w=800'),
('مزرعة النور','البحيرة',12,60,30,4.7,true,'https://i.pravatar.cc/100?img=45','حبوب','حبوب عالية الجودة','https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800');

insert into crops (name, farmer, farmer_id, city, price, qty, category, img, avatar, verified, likes, comments, description) values
('طماطم بلدي','أحمد المزارع',1,'المنصورة','12 جنيه/ك','5 طن','فريش','https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600','https://i.pravatar.cc/100?img=12',true,24,5,'طماطم بلدي طازجة من مزارع المنصورة، جودة عالية'),
('مانجو عويس','محمد الفكهاني',3,'الإسماعيلية','35 جنيه/ك','2 طن','فريش','https://images.unsplash.com/photo-1553279768-865429fa0078?w=600','https://i.pravatar.cc/100?img=15',true,42,8,'مانجو عويس إسماعيلية درجة أولى'),
('قمح مجفف','حسن الحبوب',1,'الشرقية','18 جنيه/ك','10 طن','مجفف','https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600','https://i.pravatar.cc/100?img=20',false,18,2,'قمح مجفف على الشمس'),
('خدمة نقل مبرد','سعيد للنقل',1,'الفيوم','4 جنيه/ك','20 طن','نقل ولوجيستك','https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600','https://i.pravatar.cc/100?img=33',true,31,4,'خدمة نقل مبرد لجميع المحافظات');

insert into discussions (farmer_id, text, likes, reposts, comments) values
(1,'موسم البياض الدقيقي بدأ بدري السنة دي بسبب الرطوبة، حد عنده حل مجرب؟',34,6,12),
(2,'شتلات الطماطم الهجين الجديدة وصلت، انتاجية اعلى 30% ومقاومة للذبول',28,4,8);

select 'ContCrops tables created successfully - نفس التصميم!' as result;
