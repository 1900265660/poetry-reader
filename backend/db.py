import psycopg2
from psycopg2.extras import RealDictCursor
import os
from typing import Optional, List, Dict, Any

class Database:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.conn = None
    
    def connect(self):
        """建立数据库连接"""
        try:
            self.conn = psycopg2.connect(self.database_url)
            return True
        except Exception as e:
            print(f"数据库连接失败: {e}")
            return False
    
    def close(self):
        """关闭数据库连接"""
        if self.conn:
            self.conn.close()
    
    def get_connection(self):
        """获取数据库连接"""
        if not self.conn or self.conn.closed:
            self.connect()
        return self.conn
    
    def execute_query(self, query: str, params: tuple = None) -> List[Dict[str, Any]]:
        """执行查询并返回结果"""
        try:
            conn = self.get_connection()
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, params)
                results = cur.fetchall()
                return [dict(row) for row in results]
        except Exception as e:
            print(f"查询执行失败: {e}")
            return []
    
    def execute_one(self, query: str, params: tuple = None) -> Optional[Dict[str, Any]]:
        """执行查询并返回单条结果"""
        try:
            conn = self.get_connection()
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, params)
                result = cur.fetchone()
                return dict(result) if result else None
        except Exception as e:
            print(f"查询执行失败: {e}")
            return None
    
    def get_random_poem(self) -> Optional[Dict[str, Any]]:
        """获取随机诗歌"""
        query = """
            SELECT id, poetry_id, title, author, dynasty, content
            FROM poems
            ORDER BY RANDOM()
            LIMIT 1
        """
        return self.execute_one(query)
    
    def get_poem_by_id(self, poem_id: int) -> Optional[Dict[str, Any]]:
        """根据ID获取诗歌"""
        query = """
            SELECT id, poetry_id, title, author, dynasty, content
            FROM poems
            WHERE id = %s
        """
        return self.execute_one(query, (poem_id,))
    
    def search_poems(self, keyword: Optional[str] = None, author: Optional[str] = None, 
                    page: int = 1, page_size: int = 20) -> Dict[str, Any]:
        """搜索诗歌"""
        offset = (page - 1) * page_size
        
        # 构建查询条件
        conditions = []
        params = []
        
        if keyword:
            conditions.append("(title LIKE %s OR author LIKE %s OR content LIKE %s)")
            keyword_pattern = f"%{keyword}%"
            params.extend([keyword_pattern, keyword_pattern, keyword_pattern])
        
        if author:
            conditions.append("author LIKE %s")
            params.append(f"%{author}%")
        
        where_clause = " AND ".join(conditions) if conditions else "1=1"
        
        # 获取总数
        count_query = f"SELECT COUNT(*) as total FROM poems WHERE {where_clause}"
        count_result = self.execute_one(count_query, tuple(params))
        total = count_result['total'] if count_result else 0
        
        # 获取数据
        data_query = f"""
            SELECT id, poetry_id, title, author, dynasty, 
                   SUBSTRING(content, 1, 50) as content
            FROM poems
            WHERE {where_clause}
            ORDER BY id
            LIMIT %s OFFSET %s
        """
        params.extend([page_size, offset])
        poems = self.execute_query(data_query, tuple(params))
        
        return {
            "total": total,
            "page": page,
            "page_size": page_size,
            "data": poems
        }
    
    def health_check(self) -> bool:
        """健康检查"""
        try:
            conn = self.get_connection()
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
                return True
        except:
            return False
