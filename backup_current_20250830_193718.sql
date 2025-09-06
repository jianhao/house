--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4 (Debian 15.4-1.pgdg110+1)
-- Dumped by pg_dump version 15.4 (Debian 15.4-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: browse_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.browse_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    house_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.browse_history OWNER TO postgres;

--
-- Name: collections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    house_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.collections OWNER TO postgres;

--
-- Name: consultations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    house_id uuid,
    type character varying(50) NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    contact_phone character varying(20),
    contact_name character varying(50),
    status character varying(20) DEFAULT 'pending'::character varying,
    reply_content text,
    replied_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.consultations OWNER TO postgres;

--
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    type character varying(50) NOT NULL,
    title character varying(200),
    content text NOT NULL,
    contact_info character varying(200),
    images jsonb DEFAULT '[]'::jsonb,
    status character varying(20) DEFAULT 'pending'::character varying,
    reply_content text,
    replied_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- Name: houses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.houses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(200) NOT NULL,
    cover_image text,
    images jsonb DEFAULT '[]'::jsonb,
    price numeric(12,2) NOT NULL,
    price_unit character varying(20) DEFAULT '万元'::character varying,
    area character varying(100),
    address text NOT NULL,
    location public.geometry(Point,4326),
    house_types jsonb DEFAULT '[]'::jsonb,
    delivery_time character varying(50),
    tags jsonb DEFAULT '[]'::jsonb,
    rating numeric(3,2) DEFAULT 0,
    developer character varying(200),
    property_company character varying(200),
    building_area character varying(100),
    plot_ratio numeric(5,2),
    green_rate numeric(5,2),
    parking_ratio character varying(50),
    school_district text,
    description text,
    nearby_facilities jsonb DEFAULT '[]'::jsonb,
    pros jsonb DEFAULT '[]'::jsonb,
    cons jsonb DEFAULT '[]'::jsonb,
    floor_plans jsonb DEFAULT '[]'::jsonb,
    sales_info jsonb DEFAULT '{}'::jsonb,
    status character varying(20) DEFAULT 'available'::character varying,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.houses OWNER TO postgres;

--
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(200) NOT NULL,
    summary text,
    content text NOT NULL,
    cover_image text,
    category character varying(50) NOT NULL,
    tags jsonb DEFAULT '[]'::jsonb,
    author character varying(100),
    source character varying(100),
    view_count integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    status character varying(20) DEFAULT 'published'::character varying,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.news OWNER TO postgres;

--
-- Name: policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.policies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(200) NOT NULL,
    summary text,
    content text NOT NULL,
    category character varying(50) NOT NULL,
    cover_image text,
    tags jsonb DEFAULT '[]'::jsonb,
    author character varying(100),
    source character varying(100),
    view_count integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    status character varying(20) DEFAULT 'published'::character varying,
    published_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.policies OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    openid character varying(100) NOT NULL,
    unionid character varying(100),
    nickname character varying(100) NOT NULL,
    avatar text,
    phone character varying(20),
    real_name character varying(50),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_login_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: viewing_appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.viewing_appointments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    house_id uuid NOT NULL,
    appointment_date date NOT NULL,
    appointment_time time without time zone NOT NULL,
    contact_name character varying(50) NOT NULL,
    contact_phone character varying(20) NOT NULL,
    visitor_count integer DEFAULT 1,
    special_requirements text,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.viewing_appointments OWNER TO postgres;

--
-- Data for Name: browse_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.browse_history (id, user_id, house_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: collections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.collections (id, user_id, house_id, created_at) FROM stdin;
\.


--
-- Data for Name: consultations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consultations (id, user_id, house_id, type, title, content, contact_phone, contact_name, status, reply_content, replied_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedback (id, user_id, type, title, content, contact_info, images, status, reply_content, replied_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: houses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.houses (id, name, cover_image, images, price, price_unit, area, address, location, house_types, delivery_time, tags, rating, developer, property_company, building_area, plot_ratio, green_rate, parking_ratio, school_district, description, nearby_facilities, pros, cons, floor_plans, sales_info, status, view_count, created_at, updated_at) FROM stdin;
d6a494af-2b43-4ad6-8a21-afd128a1383e	西湖印象花园	https://example.com/images/house1.jpg	[]	280.00	万元	西湖区	杭州市西湖区文三路123号	0101000020E610000004E78C28ED095E4067D5E76A2B463E40	["两室一厅", "三室两厅"]	2024年12月	["地铁沟通", "学区房", "精装修"]	4.50	绿城集团	\N	\N	\N	\N	\N	\N	位于西湖区核心地段，交通便利，配套完善，是理想的居住选择。	[]	[]	[]	[]	{}	available	0	2025-08-30 06:33:17.31544+00	2025-08-30 06:33:17.31544+00
da292d82-7f59-441e-8fae-5cff63e0a74e	钱江新城公寓	https://example.com/images/house2.jpg	[]	350.00	万元	江干区	杭州市上城区钱江路456号	0101000020E61000005396218E750D5E4057EC2FBB273F3E40	["一室一厅", "两室一厅"]	2025年6月	["江景房", "高层", "现代化"]	4.30	万科集团	\N	\N	\N	\N	\N	\N	钱江新城核心区域，享受城市繁华与江景美色。	[]	[]	[]	[]	{}	available	0	2025-08-30 06:33:17.31544+00	2025-08-30 06:33:17.31544+00
837ce0d6-78b1-4db3-b687-28dfc637cbc4	滨江科技城	https://example.com/images/house3.jpg	[]	420.00	万元	滨江区	杭州市滨江区江南大道789号	0101000020E6100000287E8CB96B0D5E40C286A757CA323E40	["三室两厅", "四室两厅"]	2024年9月	["科技园区", "配套齐全", "投资价值"]	4.70	保利地产	\N	\N	\N	\N	\N	\N	位于滨江高新技术开发区，周边科技企业云集，发展潜力巨大。	[]	[]	[]	[]	{}	available	0	2025-08-30 06:33:17.31544+00	2025-08-30 06:33:17.31544+00
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, title, summary, content, cover_image, category, tags, author, source, view_count, is_featured, status, published_at, created_at, updated_at) FROM stdin;
c17c98ec-c72b-4b49-9668-2f29a2d87178	杭州保障房政策最新解读	2024年杭州保障房申请条件和流程详细说明	根据最新政策，杭州市保障房申请条件进一步放宽...	\N	政策解读	[]	政策研究室	杭州住建局	0	t	published	2025-08-30 06:33:17.319079+00	2025-08-30 06:33:17.319079+00	2025-08-30 06:33:17.319079+00
d41c0c9a-f852-457c-b1ba-70de18dfa6bb	西湖区新增保障房项目开工	西湖区计划新建3000套保障房，预计2025年交付	为解决住房困难群体的居住问题，西湖区启动新一轮保障房建设...	\N	项目动态	[]	记者小王	杭州日报	0	f	published	2025-08-29 06:33:17.319079+00	2025-08-30 06:33:17.319079+00	2025-08-30 06:33:17.319079+00
\.


--
-- Data for Name: policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.policies (id, title, summary, content, category, cover_image, tags, author, source, view_count, is_featured, status, published_at, created_at, updated_at) FROM stdin;
6eebae9d-e4eb-4567-a376-466a5b6ba136	杭州市保障房申请条件详解	2024年最新杭州市保障房申请条件，包括户籍、收入、住房等要求	根据《杭州市保障性住房配售管理办法（试行）》，申请保障性住房需满足以下条件：\\n\\n一、基本条件\\n1. 主申请人具有杭州市区户籍3年以上，或持有杭州市区居住证3年以上\\n2. 申请家庭3年内在杭州市区无房\\n3. 家庭人均月收入低于3500元（单身申请人月收入低于4200元）\\n4. 家庭总资产低于规定标准\\n\\n二、户籍条件\\n- 主申请人及共同申请人应具有杭州市区常住户口3年以上\\n- 或持有杭州市区居住证3年以上，且在杭州市区连续缴纳社会保险或个人所得税3年以上\\n\\n三、住房条件\\n- 申请家庭在杭州市区范围内无自有住房\\n- 未享受过其他住房保障政策\\n- 家庭人均住房建筑面积低于17平方米\\n\\n四、收入条件\\n- 家庭人均月收入低于杭州市上年度城镇居民人均可支配收入的60%\\n- 单身申请人月收入标准可适当放宽\\n\\n五、资产条件\\n- 家庭总资产低于规定标准\\n- 不得拥有机动车（残疾人功能性补偿代步机动车除外）\\n\\n六、特殊情况\\n- 新就业大学生、外来务工人员等群体可适当放宽条件\\n- 人才引进对象按相关政策执行	申请条件	\N	[]	杭州市住保房管局	杭州市人民政府	0	t	published	2025-08-30 06:33:17.497507+00	2025-08-30 06:33:17.497507+00	2025-08-30 06:33:17.497507+00
27fd109e-1e37-4cd4-81a3-36d4c83098c8	保障房申请流程指南	详细介绍杭州市保障房申请的完整流程，从准备材料到最终入住	杭州市保障房申请流程如下：\\n\\n第一步：准备申请材料\\n1. 《杭州市保障性住房申请表》\\n2. 申请人及家庭成员身份证、户口簿\\n3. 婚姻状况证明\\n4. 收入证明（工资单、税单等）\\n5. 住房情况证明\\n6. 其他相关证明材料\\n\\n第二步：网上预申请\\n1. 登录杭州市住房保障管理系统\\n2. 填写基本信息\\n3. 上传相关材料\\n4. 提交预申请\\n\\n第三步：现场申请\\n1. 携带原件到户籍所在地街道办事处\\n2. 工作人员审核材料\\n3. 签字确认申请信息\\n4. 领取受理回执\\n\\n第四步：审核公示\\n1. 街道初审（5个工作日）\\n2. 区级复审（10个工作日）\\n3. 公示审核结果（7个工作日）\\n4. 异议处理\\n\\n第五步：摇号配租\\n1. 通过审核后进入摇号库\\n2. 参与定期摇号\\n3. 中签后选房\\n4. 签订租赁合同\\n\\n第六步：入住管理\\n1. 办理入住手续\\n2. 缴纳租金和押金\\n3. 定期复核资格\\n4. 遵守管理规定\\n\\n注意事项：\\n- 申请材料必须真实有效\\n- 及时关注审核进度\\n- 保持联系方式畅通\\n- 如有变化及时更新信息	申请流程	\N	[]	杭州市住保房管局	杭州市人民政府	0	t	published	2025-08-30 06:33:17.497507+00	2025-08-30 06:33:17.497507+00	2025-08-30 06:33:17.497507+00
a7441b9c-2fdd-48e8-8d37-0a1566d6b247	租金补贴政策说明	杭州市保障房租金补贴标准、申请条件和发放方式详细说明	杭州市保障房租金补贴政策：\\n\\n一、补贴标准\\n1. 一人户：每月补贴800元\\n2. 二人户：每月补贴1000元\\n3. 三人户：每月补贴1200元\\n4. 四人及以上户：每月补贴1400元\\n\\n二、申请条件\\n1. 符合保障房申请基本条件\\n2. 选择货币化保障方式\\n3. 在市场上租赁住房\\n4. 签订正式租赁合同\\n\\n三、申请材料\\n1. 租金补贴申请表\\n2. 房屋租赁合同\\n3. 租金缴费凭证\\n4. 银行账户信息\\n\\n四、发放方式\\n1. 按季度发放\\n2. 直接转入申请人银行账户\\n3. 发放期限最长5年\\n\\n五、管理要求\\n1. 定期核查租赁情况\\n2. 如实报告家庭变化\\n3. 不得转租或空置\\n4. 违规将停发补贴	租金补贴	\N	[]	杭州市住保房管局	杭州市人民政府	0	f	published	2025-08-30 06:33:17.497507+00	2025-08-30 06:33:17.497507+00	2025-08-30 06:33:17.497507+00
7cc9779e-6951-45d0-838a-5b5cc7a91557	保障房常见问题解答	汇总整理杭州市保障房申请和管理过程中的常见问题及解答	杭州市保障房常见问题解答：\\n\\nQ1：申请保障房需要什么条件？\\nA1：需要满足户籍、收入、住房、资产等多项条件，具体请参考申请条件详解。\\n\\nQ2：申请流程需要多长时间？\\nA2：从提交申请到审核完成一般需要20个工作日，摇号配租时间根据房源情况而定。\\n\\nQ3：可以同时申请多种保障房吗？\\nA3：不可以，每个家庭只能选择一种保障方式。\\n\\nQ4：租金如何计算？\\nA4：公租房租金为市场价的60-80%，具体根据地段和房型确定。\\n\\nQ5：保障房可以买卖吗？\\nA5：公租房只租不售，经济适用房有限制条件下可以上市交易。\\n\\nQ6：家庭情况发生变化怎么办？\\nA6：应及时向管理部门报告，根据新情况调整保障方式。\\n\\nQ7：如何查询申请进度？\\nA7：可通过杭州市住房保障管理系统或电话查询。\\n\\nQ8：对审核结果有异议怎么办？\\nA8：可在公示期内向相关部门提出异议申请。\\n\\nQ9：保障房可以装修吗？\\nA9：可以进行简单装修，但不得改变房屋结构。\\n\\nQ10：违规使用保障房有什么后果？\\nA10：将被取消保障资格，收回住房，并记入诚信档案。	常见问题	\N	[]	杭州市住保房管局	杭州市人民政府	0	f	published	2025-08-30 06:33:17.497507+00	2025-08-30 06:33:17.497507+00	2025-08-30 06:33:17.497507+00
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, openid, unionid, nickname, avatar, phone, real_name, created_at, updated_at, last_login_at) FROM stdin;
\.


--
-- Data for Name: viewing_appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.viewing_appointments (id, user_id, house_id, appointment_date, appointment_time, contact_name, contact_phone, visitor_count, special_requirements, status, created_at, updated_at) FROM stdin;
\.


--
-- Name: browse_history browse_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.browse_history
    ADD CONSTRAINT browse_history_pkey PRIMARY KEY (id);


--
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- Name: collections collections_user_id_house_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_user_id_house_id_key UNIQUE (user_id, house_id);


--
-- Name: consultations consultations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultations
    ADD CONSTRAINT consultations_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: houses houses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.houses
    ADD CONSTRAINT houses_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: policies policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_pkey PRIMARY KEY (id);


--
-- Name: users users_openid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_openid_key UNIQUE (openid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: viewing_appointments viewing_appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viewing_appointments
    ADD CONSTRAINT viewing_appointments_pkey PRIMARY KEY (id);


--
-- Name: idx_browse_history_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_browse_history_user_id ON public.browse_history USING btree (user_id);


--
-- Name: idx_collections_house_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_collections_house_id ON public.collections USING btree (house_id);


--
-- Name: idx_collections_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_collections_user_id ON public.collections USING btree (user_id);


--
-- Name: idx_consultations_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_consultations_user_id ON public.consultations USING btree (user_id);


--
-- Name: idx_houses_area; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_houses_area ON public.houses USING btree (area);


--
-- Name: idx_houses_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_houses_created_at ON public.houses USING btree (created_at);


--
-- Name: idx_houses_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_houses_location ON public.houses USING gist (location);


--
-- Name: idx_houses_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_houses_price ON public.houses USING btree (price);


--
-- Name: idx_houses_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_houses_status ON public.houses USING btree (status);


--
-- Name: idx_news_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_category ON public.news USING btree (category);


--
-- Name: idx_news_published_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_published_at ON public.news USING btree (published_at);


--
-- Name: idx_news_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_news_status ON public.news USING btree (status);


--
-- Name: idx_policies_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_category ON public.policies USING btree (category);


--
-- Name: idx_policies_published_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_published_at ON public.policies USING btree (published_at);


--
-- Name: idx_policies_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_status ON public.policies USING btree (status);


--
-- Name: idx_users_openid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_openid ON public.users USING btree (openid);


--
-- Name: idx_viewing_appointments_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_viewing_appointments_date ON public.viewing_appointments USING btree (appointment_date);


--
-- Name: idx_viewing_appointments_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_viewing_appointments_user_id ON public.viewing_appointments USING btree (user_id);


--
-- Name: browse_history update_browse_history_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_browse_history_updated_at BEFORE UPDATE ON public.browse_history FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: consultations update_consultations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: feedback update_feedback_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON public.feedback FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: houses update_houses_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_houses_updated_at BEFORE UPDATE ON public.houses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: news update_news_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: policies update_policies_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON public.policies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: viewing_appointments update_viewing_appointments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_viewing_appointments_updated_at BEFORE UPDATE ON public.viewing_appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: browse_history browse_history_house_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.browse_history
    ADD CONSTRAINT browse_history_house_id_fkey FOREIGN KEY (house_id) REFERENCES public.houses(id) ON DELETE CASCADE;


--
-- Name: browse_history browse_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.browse_history
    ADD CONSTRAINT browse_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: collections collections_house_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_house_id_fkey FOREIGN KEY (house_id) REFERENCES public.houses(id) ON DELETE CASCADE;


--
-- Name: collections collections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: consultations consultations_house_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultations
    ADD CONSTRAINT consultations_house_id_fkey FOREIGN KEY (house_id) REFERENCES public.houses(id) ON DELETE SET NULL;


--
-- Name: consultations consultations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultations
    ADD CONSTRAINT consultations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: feedback feedback_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: viewing_appointments viewing_appointments_house_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viewing_appointments
    ADD CONSTRAINT viewing_appointments_house_id_fkey FOREIGN KEY (house_id) REFERENCES public.houses(id) ON DELETE CASCADE;


--
-- Name: viewing_appointments viewing_appointments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.viewing_appointments
    ADD CONSTRAINT viewing_appointments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

