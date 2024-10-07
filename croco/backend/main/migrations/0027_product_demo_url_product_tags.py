# Generated by Django 5.0.3 on 2024-09-27 10:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0026_remove_product_demo_url_remove_product_tags_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='demo_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='tags',
            field=models.TextField(null=True),
        ),
    ]
