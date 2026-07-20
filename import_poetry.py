#!/usr/bin/env python3
"""导入 chinese-poetry 全唐诗数据到 PostgreSQL"""

import json
import os
import glob
import psycopg2

DB = {
    'host': '127.0.0.1',
    'port': 5433,
    'user': 'postgres',
    'password': 'poetry123',
    'database': 'poetry',
}

DATA_DIR = '/tmp/chinese-poetry/全唐诗'

def main():
    conn = psycopg2.connect(**DB)
    cur = conn.cursor()

    # 建表
    cur.execute('''
        CREATE TABLE IF NOT EXISTS poems (
            id SERIAL PRIMARY KEY,
            poetry_id VARCHAR(100) UNIQUE,
            title VARCHAR(500) NOT NULL,
            author VARCHAR(200),
            dynasty VARCHAR(50) DEFAULT '唐',
            content TEXT NOT NULL,
            source VARCHAR(100) DEFAULT 'chinese-poetry',
            created_at TIMESTAMP DEFAULT NOW()
        )
    ''')
    cur.execute('CREATE INDEX IF NOT EXISTS idx_poems_author ON poems(author)')
    cur.execute('CREATE INDEX IF NOT EXISTS idx_poems_title ON poems(title)')
    conn.commit()
    print('✅ 表创建完成')

    # 导入
    files = sorted(glob.glob(os.path.join(DATA_DIR, 'poet.tang.*.json')))
    print(f'共 {len(files)} 个数据文件')

    total = 0
    inserted = 0
    skipped = 0

    for fpath in files:
        with open(fpath) as f:
            records = json.load(f)

        for rec in records:
            total += 1
            pid = rec.get('id', '')
            title = rec.get('title', '无题')
            author = rec.get('author', '佚名')
            paras = rec.get('paragraphs', [])
            content = '\n'.join(paras) if isinstance(paras, list) else str(paras)

            if not pid or not content.strip():
                skipped += 1
                continue

            try:
                cur.execute(
                    'INSERT INTO poems (poetry_id, title, author, content) VALUES (%s,%s,%s,%s) ON CONFLICT (poetry_id) DO NOTHING',
                    (pid, title, author, content)
                )
                inserted += 1
            except Exception as e:
                skipped += 1

            if inserted % 2000 == 0:
                conn.commit()
                print(f'  进度: {inserted}/{total} (跳过 {skipped})')

        conn.commit()
        fname = os.path.basename(fpath)
        print(f'  ✅ {fname}: {inserted} 已入库')

    conn.commit()
    cur.execute('SELECT COUNT(*) FROM poems')
    count = cur.fetchone()[0]
    cur.close()
    conn.close()

    print(f'\n=== 完成 ===')
    print(f'总记录: {total}')
    print(f'已入库: {inserted}')
    print(f'已跳过: {skipped}')
    print(f'数据库总数: {count}')

if __name__ == '__main__':
    main()
