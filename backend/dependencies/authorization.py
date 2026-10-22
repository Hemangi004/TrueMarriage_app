from typing import List, Union
from fastapi import Depends, HTTPException, status
from backend.models.user import User
from backend.models.enums import UserRole
from backend.dependencies.auth import get_current_user


def require_role(allowed_roles: Union[UserRole, List[UserRole]]):
    """
    Reusable FastAPI dependency factory that enforces Role-Based Access Control (RBAC).
    1. Authenticates current user via get_current_user() (returns 401 if unauthenticated/inactive).
    2. Validates that current_user.role matches allowed_roles (returns 403 if unauthorized).
    """
    if isinstance(allowed_roles, UserRole):
        roles_set = {allowed_roles}
    else:
        roles_set = set(allowed_roles)

    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles_set:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "success": False,
                    "message": f"Access denied: Requires one of roles {[r.value for r in roles_set]}."
                }
            )
        return current_user

    return role_checker


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Convenience dependency enforcing ADMIN role authorization.
    Returns HTTP 403 Forbidden if user is authenticated but not an ADMIN.
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "success": False,
                "message": "Access denied: Administrator privileges required."
            }
        )
    return current_user
