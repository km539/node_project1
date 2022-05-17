
/*
drop table if exists categories cascade;
drop table if exists questions cascade;
drop table if exists users cascade;
drop table if exists scores;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists categories(
    id serial not null,
    category_name varchar(50) not null,
    primary key(id)
);

create table if not exists questions(
    id serial not null,
    question text not null,
    choice text [] not null,
    answer int not null,
    category_id int not null,
    primary key(id),
    foreign key(category_id) references categories(id) on delete cascade
);

create table if not exists users(
    id uuid DEFAULT uuid_generate_v4 (),
    user_pw varchar(255) not null,
    user_role int not null,
    user_name varchar(50) not null,
    primary key(id)
);

create table if not exists scores(
    id serial not null,
    score int,
    status varchar(50),
    taken_time int,
    start_time bigint,
    end_time bigint,
    user_id uuid not null,
    category_id int not null,
    primary key(id),
    foreign key(category_id) references categories(id) on delete cascade,
    foreign key(user_id) references users(id) on delete cascade
);

insert into categories(category_name) values ('動物'),('雑学'),('日本');

insert into questions(question, choice, answer, category_id) 
 values ('鶴は千年、亀は万年と言いますが、亀の長寿記録は何年くらいでしょうか',array ['100年','200年','300年','400年'],1,1),
        ('シマウマの鳴き声は、次の中のどれでしょうか',array ['ワン','モー','ブー','ヒヒーン'],0,1),
        ('キリンの鳴き声は、次の中のどれでしょうか',array ['鳴かない','モー','ブー','ヒヒーン'],1,1),
        ('日本の首都はどこ',array ['東京','大阪','静岡','北海道'],0,3),
        ('日本で使われている通貨',array ['ドル','エン','ユーロ','ポンド'],1,3),
        ('日本の西洋での愛称',array ['日出国','赤い竜','地球の正反対側','火の国'],0,3),
        ('キンカクジとは何',array ['寺','山','町','駅'],0,3),
        ('東京大阪間の最速時間',array ['5時間30分','3時間30分','4時間30分','2時間30分'],3,3),
        ('日本の国旗の色',array ['黄＆緑','赤＆白','青＆赤','緑＆白'],1,3),
        ('神道とは何',array ['電車の車種','町','宗教','郷土料理'],2,3),
        ('日本の総人口',array ['1億人','8000万人','1億2000万人','1億5000万人'],2,3),
        ('日本の元号は',array ['昭和','平成','令和','明治'],2,3),
        ('日本の100代目総理大臣',array ['麻生太郎','岸田文雄','菅直人','福田康夫'],1,3);
        

insert into users(user_pw,user_role,user_name)
 values('9999', 1, 'kyoji');

 */