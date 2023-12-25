ADMIN_ORDERING = (
    ("domains", ("Locality", "AigarConfig")),
    ("app", ("Member", "InvoicingMonth", "Invoice", "ForthcomingInvoiceItem")),
)


def get_app_list(self, request, app_label=None):
    app_dict = self._build_app_dict(request, app_label)

    if not app_dict:
        return None
    new_admin_ordering = []
    if app_label:
        for ao in ADMIN_ORDERING:
            if ao[0] == app_label:
                new_admin_ordering.append(ao)
                break

    if not app_label:
        for app_key in list(app_dict.keys()):
            if not any(app_key in ao_app for ao_app in ADMIN_ORDERING):
                app_dict.pop(app_key)

    app_list = sorted(
        app_dict.values(),
        key=lambda x: [ao[0] for ao in ADMIN_ORDERING].index(x["app_label"]),
    )

    for app, ao in zip(app_list, new_admin_ordering or ADMIN_ORDERING, strict=False):
        if app["app_label"] == ao[0]:
            for model in list(app["models"]):
                if model["object_name"] not in ao[1]:
                    app["models"].remove(model)
        app["models"].sort(key=lambda x: ao[1].index(x["object_name"]))
    return app_list
