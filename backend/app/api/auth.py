import re
from fastapi import APIRouter, HTTPException, Depends

from backend.app.schemas.auth import SignupRequest, LoginRequest
from backend.app.core.security import hash_password, verify_password, create_jwt_token, get_current_user
from backend.app.database.db import create_user, get_user_by_identifier

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup")
def signup(req: SignupRequest):
    """Register a new user account."""
    u = req.username.strip()
    e = req.email.strip().lower()
    p = req.password

    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", e):
        raise HTTPException(status_code=400, detail="Enter a valid email address.")

    try:
        user_id = create_user(u, e, hash_password(p))
        token = create_jwt_token(user_id, u, e)
        return {
            "success": True,
            "message": "Account created successfully.",
            "token": token,
            "user": {"id": user_id, "username": u, "email": e}
        }
    except Exception as err:
        if "UNIQUE" in str(err) or "IntegrityError" in str(type(err)):
            raise HTTPException(status_code=400, detail="That username or email is already registered.")
        raise HTTPException(status_code=500, detail=str(err))


@router.post("/login")
def login(req: LoginRequest):
    """Authenticate user and return a JWT token."""
    user_row = get_user_by_identifier(req.identifier)
    if not user_row or not verify_password(req.password, user_row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username/email or password.")

    user_data = {
        "id": user_row["id"],
        "username": user_row["username"],
        "email": user_row["email"]
    }
    token = create_jwt_token(user_data["id"], user_data["username"], user_data["email"])
    return {"success": True, "token": token, "user": user_data}


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return {"user": user}

