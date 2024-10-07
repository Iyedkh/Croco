# Generated by Django 5.0.3 on 2024-09-25 17:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0020_store_crocoteamproduct_crocoteamimage_crocoteamvideo_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='crocowearproduct',
            name='color',
            field=models.CharField(choices=[('black', 'Black'), ('white', 'White'), ('blue', 'Blue'), ('red', 'Red'), ('orange', 'Orange'), ('green', 'Green')], default='black', max_length=50),
        ),
        migrations.AlterField(
            model_name='crocowearproduct',
            name='size',
            field=models.CharField(choices=[('S', 'Small'), ('M', 'Medium'), ('L', 'Large')], default='M', max_length=50),
        ),
        migrations.CreateModel(
            name='CrocoNutritionProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('flavor', models.CharField(choices=[('chocolat', 'Chocolat'), ('vanille', 'Vanille'), ('fraise', 'Fraise'), ('caramel', 'Caramel'), ('cookies', 'Cookies')], max_length=50)),
                ('product', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='nutrition_details', to='main.product')),
            ],
        ),
    ]
