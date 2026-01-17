-- 这个SQL文件包含在Supabase中创建的函数定义

-- 列出所有表的函数
CREATE OR REPLACE FUNCTION public.list_tables()
RETURNS TABLE(table_name text)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  ORDER BY table_name;
END;
$$;

-- 更新用户积分的函数
CREATE OR REPLACE FUNCTION public.update_user_credits(p_user_id text, p_amount integer)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.profiles
  SET credits = credits + p_amount
  WHERE user_id = p_user_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;