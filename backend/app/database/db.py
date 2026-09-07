import sqlite3
from datetime import datetime
from typing import Optional, List, Dict, Any, Tuple

from backend.app.core.config import DB_PATH


def get_db() -> sqlite3.Connection:
    """Get a SQLite connection with Row factory enabled."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """Initialize all database tables if they don't exist. Safe to call on existing DB."""
    conn = get_db()
    cursor = conn.cursor()

    # Core tables
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
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            model TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
        )
    """)

    # Extended tables for new features
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS uploaded_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER NOT NULL,
            message_id INTEGER,
            filename TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            file_path TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS generated_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            conversation_id INTEGER,
            prompt TEXT NOT NULL,
            image_path TEXT NOT NULL,
            model TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    """)

    # Add 'model' column to messages if it doesn't exist (migration for existing DBs)
    try:
        cursor.execute("ALTER TABLE messages ADD COLUMN model TEXT")
    except sqlite3.OperationalError:
        pass  # Column already exists

    conn.commit()
    conn.close()


# Auto-initialize on import
init_db()


# ─── User operations ───────────────────────────────────────────────────────────

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


# ─── Conversation operations ────────────────────────────────────────────────────

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
        "SELECT id, role, content, model, created_at FROM messages WHERE conversation_id=? ORDER BY id ASC",
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
                "model": m["model"],
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
        "DELETE FROM messages WHERE conversation_id=? AND conversation_id IN "
        "(SELECT id FROM conversations WHERE id=? AND user_id=?)",
        (chat_id, chat_id, user_id)
    )
    cursor.execute("DELETE FROM conversations WHERE id=? AND user_id=?", (chat_id, user_id))
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success


# ─── Message operations ─────────────────────────────────────────────────────────

def save_message(chat_id: int, role: str, content: str, model: str = None) -> Tuple[int, str]:
    now = datetime.now().isoformat()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO messages(conversation_id, role, content, model, created_at) VALUES(?,?,?,?,?)",
        (chat_id, role, content, model, now)
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


# ─── Generated images ──────────────────────────────────────────────────────────

def save_generated_image(user_id: int, conversation_id: Optional[int],
                          prompt: str, image_path: str, model: str = None) -> int:
    now = datetime.now().isoformat()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO generated_images(user_id, conversation_id, prompt, image_path, model, created_at) VALUES(?,?,?,?,?,?)",
        (user_id, conversation_id, prompt, image_path, model, now)
    )
    img_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return img_id


def get_user_generated_images(user_id: int, limit: int = 20) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, prompt, image_path, model, created_at FROM generated_images WHERE user_id=? ORDER BY id DESC LIMIT ?",
        (user_id, limit)
    )
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r["id"],
            "prompt": r["prompt"],
            "image_path": r["image_path"],
            "model": r["model"],
            "created_at": r["created_at"]
        }
        for r in rows
    ]

