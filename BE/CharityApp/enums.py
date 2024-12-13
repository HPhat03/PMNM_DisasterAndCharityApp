from django_enumfield import enum


class UserRole(enum.Enum):
    CIVILIAN = 0
    CHARITY_ORG = 1
    ADMIN = 2


class ContentPictureType(enum.Enum):
    CONTENT = 0
    RESULT = 1


class LocationState(enum.Enum):
    NORMAL = 0
    PANDEMIC = 1
    DISASTER = 2


class WayType(enum.Enum):
    IMPORT = 0
    EXPORT = 1
