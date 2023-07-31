from back.exceptions import AIGARError


class ConfigError(AIGARError):
    """Error configuring the app.

    Where the user tries to do an invalid operationg configuring the app, like remove a Zone that already has users, or removing an InvoiceConcept.
    """
