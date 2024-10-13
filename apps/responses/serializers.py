from rest_framework import serializers
from .models import Respuesta, Tag

class TagSerializer(serializers.ModelSerializer):
    respuestas_count = serializers.IntegerField(source='get_respuestas_count', read_only=True)

    class Meta:
        model = Tag
        fields = ['id', 'nombre', 'respuestas_count']

class RespuestaSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tags_list = serializers.ListField(child=serializers.CharField(), write_only=True)
    usuario = serializers.StringRelatedField()

    class Meta:
        model = Respuesta
        fields = ['id', 'contenido', 'fecha_creacion', 'usuario', 'tags', 'tags_list']
        read_only_fields = ['fecha_creacion', 'usuario']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags_list', [])
        respuesta = Respuesta.objects.create(**validated_data)
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(nombre=tag_name)
            respuesta.tags.add(tag)
        return respuesta

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags_list', None)
        instance = super().update(instance, validated_data)
        if tags_data is not None:
            instance.tags.clear()
            for tag_name in tags_data:
                tag, _ = Tag.objects.get_or_create(nombre=tag_name)
                instance.tags.add(tag)
        return instance