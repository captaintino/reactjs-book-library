# Generated by Django 3.1.5 on 2021-05-14 02:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('booklibrary', '0005_auto_20210410_1137'),
    ]

    operations = [
        migrations.CreateModel(
            name='Arranger',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=200)),
                ('last_name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Composer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=200)),
                ('last_name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Lyracist',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=200)),
                ('last_name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Publisher',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('arranger', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='songs', to='booklibrary.arranger')),
                ('composer', models.ManyToManyField(to='booklibrary.Composer')),
                ('lyracists', models.ManyToManyField(to='booklibrary.Lyracist')),
                ('publisher', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='songs', to='booklibrary.publisher')),
            ],
        ),
        migrations.CreateModel(
            name='DateSung',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('song', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='booklibrary.song')),
            ],
        ),
    ]
