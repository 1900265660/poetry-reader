from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn
from typing import Optional
from db import Database

# 加载环境变量
load_dotenv()

app = FastAPI(title="诗歌阅读API", version="1.0.0")

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化数据库
DATABASE_URL = os.getenv("DATABASE_URL")
db = Database(DATABASE_URL)

@app.on_event("startup")
async def startup_event():
    """应用启动时连接数据库"""
    if db.connect():
        print("✓ 数据库连接成功")
    else:
        print("✗ 数据库连接失败")

@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭时断开数据库连接"""
    db.close()
    print("数据库连接已关闭")

@app.get("/health")
async def health_check():
    """健康检查"""
    db_healthy = db.health_check()
    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "database": "connected" if db_healthy else "disconnected"
    }

@app.get("/api/poems/random")
async def get_random_poem():
    """获取随机诗歌"""
    poem = db.get_random_poem()
    if not poem:
        raise HTTPException(status_code=404, detail="未找到诗歌")
    
    return {
        "success": True,
        "data": {
            "id": poem["id"],
            "title": poem["title"],
            "author": poem["author"],
            "dynasty": poem["dynasty"],
            "content": poem["content"]
        }
    }

@app.get("/api/poems/{poem_id}")
async def get_poem_by_id(poem_id: int):
    """根据ID获取诗歌详情"""
    poem = db.get_poem_by_id(poem_id)
    if not poem:
        raise HTTPException(status_code=404, detail="诗歌不存在")
    
    return {
        "success": True,
        "data": {
            "id": poem["id"],
            "title": poem["title"],
            "author": poem["author"],
            "dynasty": poem["dynasty"],
            "content": poem["content"]
        }
    }

@app.get("/api/poems")
async def search_poems(
    q: Optional[str] = Query(None, description="搜索关键词（标题/作者/内容）"),
    author: Optional[str] = Query(None, description="作者名称"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量")
):
    """搜索诗歌"""
    result = db.search_poems(keyword=q, author=author, page=page, page_size=page_size)
    
    return {
        "success": True,
        "data": result["data"],
        "pagination": {
            "total": result["total"],
            "page": result["page"],
            "page_size": result["page_size"],
            "total_pages": (result["total"] + page_size - 1) // page_size
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    print(f"启动服务于端口 {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
