import math
from typing import Tuple, List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, or_, asc, desc
from backend.models.user import User
from backend.models.biodata import BiodataProfileModel
from backend.models.enums import UserRole, UserStatus
from backend.services.session_service import revoke_all_user_sessions

ALLOWED_SORT_FIELDS = {
    "created_at": User.created_at,
    "updated_at": User.updated_at,
    "last_login_at": User.last_login_at,
    "full_name": User.full_name,
    "email": User.email,
    "status": User.status,
}


def list_users_paginated(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    search: Optional[str] = None,
    status_filter: Optional[UserStatus] = None,
    role_filter: Optional[UserRole] = None,
    is_email_verified_filter: Optional[bool] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> Tuple[List[User], int, int]:
    """
    Retrieves a paginated, filtered, searchable, and safely sorted list of users.
    Searches across email, user full name, biodata profile ID, slug, and candidate name.
    """
    # 1. Parameter Validation
    if page < 1:
        raise ValueError("Page index must be >= 1")

    if page_size < 1 or page_size > 100:
        raise ValueError("Page size must be between 1 and 100")

    sort_field = ALLOWED_SORT_FIELDS.get(sort_by.lower())
    if sort_field is None:
        raise ValueError(f"Invalid sort_by field. Allowed fields: {list(ALLOWED_SORT_FIELDS.keys())}")

    sort_func = desc if sort_order.lower() == "desc" else asc

    # 2. Build Query
    stmt = select(User).outerjoin(BiodataProfileModel, User.id == BiodataProfileModel.user_id)
    count_query = select(func.count(func.distinct(User.id))).select_from(User).outerjoin(
        BiodataProfileModel, User.id == BiodataProfileModel.user_id
    )

    if search and search.strip():
        search_pattern = f"%{search.strip()}%"
        filter_clause = or_(
            User.email.ilike(search_pattern),
            User.full_name.ilike(search_pattern),
            BiodataProfileModel.id.ilike(search_pattern),
            BiodataProfileModel.slug.ilike(search_pattern),
            func.json_extract(BiodataProfileModel.profile_data, "$.fullName").ilike(search_pattern),
            func.json_extract(BiodataProfileModel.profile_data, "$.name").ilike(search_pattern),
        )
        stmt = stmt.where(filter_clause)
        count_query = count_query.where(filter_clause)

    if status_filter:
        stmt = stmt.where(User.status == status_filter)
        count_query = count_query.where(User.status == status_filter)

    if role_filter:
        stmt = stmt.where(User.role == role_filter)
        count_query = count_query.where(User.role == role_filter)

    if is_email_verified_filter is not None:
        stmt = stmt.where(User.is_email_verified == is_email_verified_filter)
        count_query = count_query.where(User.is_email_verified == is_email_verified_filter)

    # 3. Compute Total Count
    total_count = db.scalar(count_query) or 0

    # 4. Apply Sorting & Pagination
    stmt = stmt.order_by(sort_func(sort_field))
    offset = (page - 1) * page_size
    stmt = stmt.offset(offset).limit(page_size)

    users = list(db.scalars(stmt.options(joinedload(User.biodata))).unique().all())
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 0

    return users, total_count, total_pages


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    """
    Retrieves a single User by ID.
    """
    stmt = select(User).options(joinedload(User.biodata)).where(User.id == user_id)
    return db.scalar(stmt)


def change_user_status(
    db: Session,
    admin_user_id: str,
    target_user_id: str,
    new_status: UserStatus,
    reason: Optional[str] = None
) -> Tuple[bool, str, Optional[User]]:
    """
    Executes administrative status transitions:
    1. Prevents Admin self-lockout (Admin cannot block/deactivate self).
    2. Validates legal status transitions.
    3. Revokes all active sessions if status becomes BLOCKED or DEACTIVATED.
    """
    # 1. Admin Self-Protection Check
    if admin_user_id == target_user_id:
        if new_status in [UserStatus.BLOCKED, UserStatus.DEACTIVATED]:
            return False, "Administrators cannot block or deactivate their own account.", None

    # 2. Fetch Target User
    target_user = get_user_by_id(db, target_user_id)
    if not target_user:
        return False, "Target user not found.", None

    # 3. Status Transition Rules
    current_status = target_user.status

    if current_status == new_status:
        return True, f"User is already in status {new_status.value}", target_user

    # Prevent bypassing email verification for PENDING_VERIFICATION accounts
    if current_status == UserStatus.PENDING_VERIFICATION and new_status == UserStatus.ACTIVE:
        return False, "Pending accounts must complete email verification before becoming active.", None

    # Update status
    target_user.status = new_status
    db.flush()

    # 4. Session Revocation for Inactivating Transitions
    if new_status in [UserStatus.BLOCKED, UserStatus.DEACTIVATED]:
        revoke_all_user_sessions(db, target_user.id)

    db.commit()
    db.refresh(target_user)

    return True, f"User status updated from {current_status.value} to {new_status.value}", target_user
