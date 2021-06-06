from rest_framework import serializers
from .models import *
class AuthorEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id','first_name', 'last_name')
class GenreEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id','category')
class SeriesEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Series
        fields = ('id','name')
class BookEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('id', 'title', 'notes', 'author', 'genre', 'series','number_in_series','owned')

class BookGetSerializer(serializers.ModelSerializer):
    author_obj = serializers.SerializerMethodField('get_author')
    genre_obj = serializers.SerializerMethodField('get_genre')
    series_obj = serializers.SerializerMethodField('get_series')


    def get_author(self, book):
        return AuthorEditSerializer(book.author, many=False).data
    def get_genre(self, book):
        return GenreEditSerializer(book.genre, many=False).data
    def get_series(self, book):
        if book.series:
            return SeriesEditSerializer(book.series, many=False).data
        else:
            return {}
    class Meta:
        model = Book
        fields = ('id', 'title', 'notes', 'author', 'genre', 'series', 'author_obj', 'genre_obj', 'series_obj','number_in_series', 'owned')

class AuthorGetSerializer(serializers.ModelSerializer):
    books = BookGetSerializer(many=True)

    class Meta:
        model = Author
        fields = ('id','first_name', 'last_name', 'books')


class GenreGetSerializer(serializers.ModelSerializer):
    books = BookGetSerializer(many=True)

    class Meta:
        model = Genre
        fields = ('id','category', 'books')


class SeriesGetSerializer(serializers.ModelSerializer):
    books = BookGetSerializer(many=True)

    class Meta:
        model = Series
        fields = ('id','name', 'books')

#********************************************************************************************************
#******************************************* MUSIC LIBRARY **********************************************
#********************************************************************************************************

class PeopleEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = People
        fields = ('id', 'first_name', 'last_name')

class PublisherEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ('id','name')

class SongEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('id', 'title', 'composers', 'arrangers','publisher', 'lyricists')

class SongGetSerializer(serializers.ModelSerializer):
    composers_list = serializers.SerializerMethodField('get_composers')
    publisher_obj = serializers.SerializerMethodField('get_publisher')
    arrangers_list = serializers.SerializerMethodField('get_arrangers')
    lyricists_list = serializers.SerializerMethodField('get_lyricists')
    def get_composers(self, song):
        return PeopleEditSerializer(song.composers, many=True).data
    def get_publisher(self, song):
        return PublisherEditSerializer(song.publisher, many=False).data
    def get_arrangers(self, song):
        return PeopleEditSerializer(song.arrangers, many=True).data
    def get_lyricists(self, song):
        return PeopleEditSerializer(song.lyricists, many=True).data
    class Meta:
        model = Song
        fields = ('id', 'title','publisher', 'composers', 'arrangers', 'lyricists', 'publisher_obj', 'composers_list', 'arrangers_list', 'lyricists_list')


class PeopleGetSerializer(serializers.ModelSerializer):
    songs_composed = serializers.SerializerMethodField('get_composed')
    songs_arranged = serializers.SerializerMethodField('get_arranged')
    songs_lirisized = serializers.SerializerMethodField('get_lirisized')
    def get_composed(self, person):
        return SongEditSerializer(person.songs_composed, many=True).data
    def get_arranged(self, person):
        return SongEditSerializer(person.songs_arranged, many=True).data
    def get_lirisized(self, person):
        return SongEditSerializer(person.songs_lirisized, many=True).data


    class Meta:
        model = People
        fields = ('id', 'first_name', 'last_name', 'songs_composed', 'songs_arranged', 'songs_lirisized')

class PublisherGetSerializer(serializers.ModelSerializer):
    songs = SongEditSerializer(many=True)

    class Meta:
        model = Publisher
        fields = ('id', 'name', 'songs')