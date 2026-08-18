"""
Register the models with Django's built-in admin interface.
"""

from django.contrib import admin

from .models import CollegeInfo, Faculty, GalleryImage, Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('registration_number', 'name', 'father_name',
                    'phone', 'marks', 'branch', 'created_at')
    list_filter = ('branch',)
    search_fields = ('name', 'registration_number', 'branch', 'phone')


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('faculty_number', 'name', 'branch', 'designation')
    search_fields = ('name', 'faculty_number', 'branch')


@admin.register(CollegeInfo)
class CollegeInfoAdmin(admin.ModelAdmin):
    list_display = ('college_name', 'tagline', 'established_year')


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'uploaded_at')
    list_filter = ('category',)
