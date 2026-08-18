"""
Forms for the Fresher Party Management System.

Django forms provide built-in server-side validation (CSRF, required fields,
field types) which we rely on for security and data integrity.
"""

import re

from django import forms

from .models import Student, Faculty, CollegeInfo, GalleryImage


class StudentRegistrationForm(forms.ModelForm):
    """Public registration form used by fresher students."""

    class Meta:
        model = Student
        fields = ['name', 'father_name', 'address', 'phone', 'marks', 'branch']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'input-field', 'placeholder': 'e.g. Hara Prasad Padhi'}),
            'father_name': forms.TextInput(attrs={
                'class': 'input-field', 'placeholder': "Father's full name"}),
            'address': forms.Textarea(attrs={
                'class': 'input-field', 'rows': 3,
                'placeholder': 'Your permanent address'}),
            'phone': forms.TextInput(attrs={
                'class': 'input-field', 'placeholder': '10-digit mobile number'}),
            'marks': forms.NumberInput(attrs={
                'class': 'input-field', 'step': '0.01', 'min': '0', 'max': '100',
                'placeholder': 'e.g. 86.50'}),
            'branch': forms.Select(attrs={'class': 'input-field'}),
        }

    def clean_name(self):
        """Name must contain only letters and spaces."""
        name = self.cleaned_data['name'].strip()
        if not re.match(r"^[A-Za-z][A-Za-z .'-]{2,}$", name):
            raise forms.ValidationError(
                "Please enter a valid student name (letters and spaces only).")
        return name

    def clean_phone(self):
        """Phone must be a valid 10-digit Indian mobile number."""
        phone = self.cleaned_data['phone'].strip()
        if not re.match(r"^[6-9]\d{9}$", phone):
            raise forms.ValidationError(
                "Please enter a valid 10-digit mobile number (starts with 6-9).")
        return phone

    def clean_marks(self):
        marks = self.cleaned_data['marks']
        if marks is None or marks < 0 or marks > 100:
            raise forms.ValidationError("Marks must be between 0 and 100.")
        return marks


class StudentForm(forms.ModelForm):
    """Admin form to add/edit a student (full control)."""

    class Meta:
        model = Student
        fields = ['name', 'father_name', 'address', 'phone', 'marks', 'branch']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'input-field'}),
            'father_name': forms.TextInput(attrs={'class': 'input-field'}),
            'address': forms.Textarea(attrs={'class': 'input-field', 'rows': 3}),
            'phone': forms.TextInput(attrs={'class': 'input-field'}),
            'marks': forms.NumberInput(attrs={'class': 'input-field', 'step': '0.01'}),
            'branch': forms.Select(attrs={'class': 'input-field'}),
        }

    def clean_phone(self):
        phone = self.cleaned_data['phone'].strip()
        if not re.match(r"^[6-9]\d{9}$", phone):
            raise forms.ValidationError(
                "Please enter a valid 10-digit mobile number (starts with 6-9).")
        return phone

    def clean_marks(self):
        marks = self.cleaned_data['marks']
        if marks is None or marks < 0 or marks > 100:
            raise forms.ValidationError("Marks must be between 0 and 100.")
        return marks


class FacultyForm(forms.ModelForm):
    """Admin form to add/edit a faculty member."""

    class Meta:
        model = Faculty
        fields = ['name', 'branch', 'designation', 'email']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'input-field'}),
            'branch': forms.TextInput(attrs={'class': 'input-field'}),
            'designation': forms.TextInput(attrs={'class': 'input-field'}),
            'email': forms.EmailInput(attrs={'class': 'input-field'}),
        }


class CollegeInfoForm(forms.ModelForm):
    """Admin form to edit the About-the-college content."""

    class Meta:
        model = CollegeInfo
        fields = [
            'college_name', 'tagline', 'history', 'vision', 'mission',
            'courses', 'branches', 'facilities', 'principal_name',
            'principal_message', 'address', 'phone', 'email', 'website',
            'established_year', 'logo', 'hero_image',
        ]
        widgets = {
            'college_name': forms.TextInput(attrs={'class': 'input-field'}),
            'tagline': forms.TextInput(attrs={'class': 'input-field'}),
            'history': forms.Textarea(attrs={'class': 'input-field', 'rows': 3}),
            'vision': forms.Textarea(attrs={'class': 'input-field', 'rows': 3}),
            'mission': forms.Textarea(attrs={'class': 'input-field', 'rows': 3}),
            'courses': forms.Textarea(attrs={'class': 'input-field', 'rows': 3}),
            'branches': forms.Textarea(attrs={'class': 'input-field', 'rows': 3}),
            'facilities': forms.Textarea(attrs={'class': 'input-field', 'rows': 3}),
            'principal_name': forms.TextInput(attrs={'class': 'input-field'}),
            'principal_message': forms.Textarea(attrs={'class': 'input-field', 'rows': 3}),
            'address': forms.Textarea(attrs={'class': 'input-field', 'rows': 3}),
            'phone': forms.TextInput(attrs={'class': 'input-field'}),
            'email': forms.EmailInput(attrs={'class': 'input-field'}),
            'website': forms.TextInput(attrs={'class': 'input-field'}),
            'established_year': forms.TextInput(attrs={'class': 'input-field'}),
        }


class GalleryImageForm(forms.ModelForm):
    """Admin form to add/edit a gallery image."""

    class Meta:
        model = GalleryImage
        fields = ['title', 'category', 'image', 'image_url']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'input-field'}),
            'category': forms.Select(attrs={'class': 'input-field'}),
            'image_url': forms.URLInput(attrs={'class': 'input-field',
                                               'placeholder': 'Optional external URL'}),
        }
