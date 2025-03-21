# Generated by Django 5.1.1 on 2024-10-07 03:44

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('responses', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='respuesta',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='respuestas', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='respuestatag',
            name='respuesta',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='responses.respuesta'),
        ),
        migrations.AddField(
            model_name='respuestatag',
            name='tag',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='responses.tag'),
        ),
        migrations.AddField(
            model_name='respuesta',
            name='tags',
            field=models.ManyToManyField(related_name='respuestas', through='responses.RespuestaTag', to='responses.tag'),
        ),
        migrations.AlterUniqueTogether(
            name='respuestatag',
            unique_together={('respuesta', 'tag')},
        ),
    ]
