# Generated by Django 5.1.2 on 2025-01-11 03:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('responses', '0002_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='respuesta',
            options={'ordering': ['order'], 'verbose_name': 'Respuesta', 'verbose_name_plural': 'Respuestas'},
        ),
        migrations.AddField(
            model_name='respuesta',
            name='order',
            field=models.IntegerField(default=0),
        ),
    ]
