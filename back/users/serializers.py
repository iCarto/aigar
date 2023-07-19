from django.contrib.auth.models import Group

from rest_framework import serializers

from .models import User


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("url", "id", "name")


class UserSerializer(serializers.ModelSerializer):

    groups = serializers.SlugRelatedField(
        many=True,
        queryset=Group.objects.all(),
        read_only=False,
        allow_null=False,
        slug_field="name",
    )

    def create(self, validated_data):
        if "password" in validated_data:
            password = validated_data["password"]
        else:
            raise serializers.ValidationError(
                {"password": ["Este campo no puede estar en blanco."]}
            )
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        if "password" in validated_data:
            password = validated_data.pop("password")
            instance.set_password(password)

        return super().update(instance, validated_data)

    class Meta:
        model = User
        fields = (
            "url",
            "id",
            "username",
            "first_name",
            "groups",
            "last_login",
            "password",
        )
        extra_kwargs = {"password": {"write_only": True, "required": False}}
