import enum


class UserRole(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class UserStatus(str, enum.Enum):
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    ACTIVE = "ACTIVE"
    DEACTIVATED = "DEACTIVATED"
    BLOCKED = "BLOCKED"


class ProfileModerationStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CHANGES_REQUESTED = "CHANGES_REQUESTED"


class OTPType(str, enum.Enum):
    EMAIL = "EMAIL"
    PHONE = "PHONE"


class OTPPurpose(str, enum.Enum):
    REGISTRATION = "REGISTRATION"
    FORGOT_PASSWORD = "FORGOT_PASSWORD"
    PASSWORD_RESET = "PASSWORD_RESET"


class AuthProvider(str, enum.Enum):
    LOCAL = "LOCAL"
    GOOGLE = "GOOGLE"


class InterestStatus(str, enum.Enum):
    """
    Lifecycle of an Interest record.

    Business rules:
      PENDING   - Interest sent, awaiting recipient action.
      ACCEPTED  - Recipient accepted the interest. Connection established.
      DECLINED  - Recipient declined. Sender may send a NEW interest after
                  DECLINED (no constraint blocks re-sending).
      WITHDRAWN - Sender withdrew before recipient responded.
                  A new interest may be sent again after WITHDRAWN.
      MATCHED   - Reciprocal interest detected: B expressed interest toward A
                  while A already had PENDING toward B. Both interests are
                  resolved to MATCHED simultaneously.

    Duplicate prevention is enforced at the service layer:
      Only one PENDING or ACCEPTED or MATCHED interest may exist between
      a given (sender, receiver) pair at any time.
      DECLINED and WITHDRAWN are historical records and do NOT prevent
      a fresh PENDING interest from being created.
    """
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    DECLINED = "DECLINED"
    WITHDRAWN = "WITHDRAWN"
    MATCHED = "MATCHED"


class NotificationType(str, enum.Enum):
    INTEREST_RECEIVED = "INTEREST_RECEIVED"
    INTEREST_ACCEPTED = "INTEREST_ACCEPTED"
    INTEREST_DECLINED = "INTEREST_DECLINED"
    INTEREST_WITHDRAWN = "INTEREST_WITHDRAWN"
    MUTUAL_INTEREST = "MUTUAL_INTEREST"
    ADMIN_BROADCAST = "ADMIN_BROADCAST"
    SYSTEM = "SYSTEM"
    PROMOTION = "PROMOTION"
    FEATURE = "FEATURE"

