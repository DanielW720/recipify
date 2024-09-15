from rest_framework.exceptions import APIException


class PaginationError(APIException):
    """Pagination error."""

    status_code = 400
    default_detail = "Invalid pagination parameters"
    default_code = "invalid_pagination_parameters"

    def __init__(self, message=None):
        """Initialize the error."""
        if message:
            self.detail = f"{self.default_detail}: {message}"
