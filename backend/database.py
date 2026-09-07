import sqlite3
from datetime import datetime
from typing import Optional, List, Dict, Any, Tuple
from backend.config import DB_PATH

def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(conversation_id) REFERENCES conversations(id)
        )
    """)
    conn.commit()
    conn.close()

# Auto-initialize on import
init_db()

# User operations
def create_user(username: str, email: str, password_hash: str) -> int:
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute(
        "INSERT INTO users(username, email, password_hash, created_at) VALUES(?,?,?,?)",
        (username, email, password_hash, now)
    )
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return user_id

def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email FROM users WHERE id=?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"id": row["id"], "username": row["username"], "email": row["email"]}
    return None

def get_user_by_identifier(identifier: str) -> Optional[sqlite3.Row]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, username, email, password_hash FROM users WHERE username=? OR email=?",
        (identifier.strip(), identifier.strip().lower())
    )
    row = cursor.fetchone()
    conn.close()
    return row

# Conversation operations
def get_user_conversations(user_id: int) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.id, c.title, c.created_at, c.updated_at,
               (SELECT COUNT(*) FROM messages WHERE conversation_id=c.id) as message_count,
               (SELECT content FROM messages WHERE conversation_id=c.id ORDER BY id DESC LIMIT 1) as last_message
        FROM conversations c
        WHERE c.user_id=?
        ORDER BY c.updated_at DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r["id"],
            "title": r["title"],
            "created_at": r["created_at"],
            "updated_at": r["updated_at"],
            "message_count": r["message_count"],
            "last_message": r["last_message"] or ""
        }
        for r in rows
    ]

def create_conversation(user_id: int, title: str) -> Dict[str, Any]:
    now = datetime.now().isoformat()
    clean_title = (title or "New Conversation").strip()[:80]
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO conversations(user_id, title, created_at, updated_at) VALUES(?,?,?,?)",
        (user_id, clean_title, now, now)
    )
    chat_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {
        "id": chat_id,
        "title": clean_title,
        "created_at": now,
        "updated_at": now,
        "messages": []
    }

def get_conversation(chat_id: int, user_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, title, created_at, updated_at FROM conversations WHERE id=? AND user_id=?",
        (chat_id, user_id)
    )
    chat_row = cursor.fetchone()
    if not chat_row:
        conn.close()
        return None

    cursor.execute(
        "SELECT id, role, content, created_at FROM messages WHERE conversation_id=? ORDER BY id ASC",
        (chat_id,)
    )
    msg_rows = cursor.fetchall()
    conn.close()

    return {
        "id": chat_row["id"],
        "title": chat_row["title"],
        "created_at": chat_row["created_at"],
        "updated_at": chat_row["updated_at"],
        "messages": [
            {
                "id": m["id"],
                "role": m["role"],
                "content": m["content"],
                "created_at": m["created_at"]
            }
            for m in msg_rows
        ]
    }

def update_conversation_title(chat_id: int, user_id: int, new_title: str) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE conversations SET title=? WHERE id=? AND user_id=?",
        (new_title.strip()[:80], chat_id, user_id)
    )
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success

def delete_conversation(chat_id: int, user_id: int) -> bool:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM messages WHERE conversation_id=? AND conversation_id IN (SELECT id FROM conversations WHERE id=? AND user_id=?)",
        (chat_id, chat_id, user_id)
    )
    cursor.execute("DELETE FROM conversations WHERE id=? AND user_id=?", (chat_id, user_id))
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success

# Message operations
def save_message(chat_id: int, role: str, content: str) -> Tuple[int, str]:
    now = datetime.now().isoformat()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO messages(conversation_id, role, content, created_at) VALUES(?,?,?,?)",
        (chat_id, role, content, now)
    )
    msg_id = cursor.lastrowid
    cursor.execute("UPDATE conversations SET updated_at=? WHERE id=?", (now, chat_id))
    conn.commit()
    conn.close()
    return msg_id, now

def get_conversation_history(chat_id: int) -> List[Dict[str, str]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT role, content FROM messages WHERE conversation_id=? ORDER BY id ASC",
        (chat_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [{"role": r["role"], "content": r["content"]} for r in rows]