ADMIN_ORDERING = (
    ("domains", ("Locality", "AigarConfig")),
    ("app", ("Member", "InvoicingMonth", "Invoice", "ForthcomingInvoiceItem")),
)


def get_app_list(self, request, app_label=None):
    app_dict = self._build_app_dict(request, app_label)

    if not app_dict:
        return
    NEW_ADMIN_ORDERING = []
    if app_label:
        print(app_label)
        for ao in ADMIN_ORDERING:
            if ao[0] == app_label:
                NEW_ADMIN_ORDERING.append(ao)
                break

    if not app_label:
        for app_key in list(app_dict.keys()):
            if not any(app_key in ao_app for ao_app in ADMIN_ORDERING):
                app_dict.pop(app_key)

    app_list = sorted(
        app_dict.values(),
        key=lambda x: [ao[0] for ao in ADMIN_ORDERING].index(x["app_label"]),
    )

    for app, ao in zip(app_list, NEW_ADMIN_ORDERING or ADMIN_ORDERING):
        if app["app_label"] == ao[0]:
            for model in list(app["models"]):
                if not model["object_name"] in ao[1]:
                    app["models"].remove(model)
        app["models"].sort(key=lambda x: ao[1].index(x["object_name"]))
    return app_list
