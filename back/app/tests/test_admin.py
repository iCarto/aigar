import pytest


pytestmark = pytest.mark.django_db


def test_with_unauthenticated_client(client):
    response = client.get("/gestion", follow=True)

    assert response.status_code == 200
    assert response.redirect_chain[-1] == ("/gestion/login/?next=/gestion/", 302)


def test_with_authenticated_client(client, django_user_model):
    username = "user1"
    password = "bar"
    django_user_model.objects.create_superuser(username=username, password=password)

    client.login(username=username, password=password)

    response = client.get("/gestion", follow=True)
    assert response.status_code == 200
    assert response.redirect_chain[-1] == ("/gestion/", 301)


def test_with_authenticated_client2(admin_client):
    response = admin_client.get("/gestion", follow=True)
    assert response.status_code == 200
    assert response.redirect_chain[-1] == ("/gestion/", 301)
