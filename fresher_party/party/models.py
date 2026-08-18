"""
Database models for the Fresher Party Management System.

Models:
    Student          - registered fresher students
    Faculty          - faculty directory
    CollegeInfo      - editable "About our college" content
    GalleryImage     - photo gallery entries
"""

from django.db import models
from django.utils import timezone


class Student(models.Model):
    """A registered fresher student."""

    # Branches offered at the college
    BRANCH_CHOICES = [
        ('Computer Science', 'Computer Science'),
        ('Information Technology', 'Information Technology'),
        ('Electronics', 'Electronics & Communication'),
        ('Mechanical', 'Mechanical Engineering'),
        ('Civil', 'Civil Engineering'),
        ('Management', 'Business Management'),
        ('Mathematics', 'Mathematics'),
        ('Other', 'Other'),
    ]

    registration_number = models.CharField(
        max_length=20, unique=True, editable=False, db_index=True,
        help_text="Auto-generated unique registration number, e.g. FR20260001",
    )
    name = models.CharField(max_length=120, db_index=True)
    father_name = models.CharField(max_length=120, blank=True)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=15)
    marks = models.DecimalField(
        max_digits=5, decimal_places=2, default=0.00,
        help_text="Percentage marks obtained (e.g. 86.50)",
    )
    branch = models.CharField(max_length=40, choices=BRANCH_CHOICES, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['registration_number']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['branch']),
            models.Index(fields=['registration_number']),
        ]

    def __str__(self):
        return f"{self.registration_number} - {self.name}"

    @classmethod
    def generate_registration_number(cls):
        """
        Generate the next sequential registration number.

        Format: FR + year + 4-digit sequence.
        Example: FR20260001, FR20260002, ...
        """
        year = timezone.now().year
        prefix = f"FR{year}"
        # Find the highest sequence number already used for this year.
        last = cls.objects.filter(registration_number__startswith=prefix) \
            .order_by('-registration_number').first()
        if last:
            try:
                seq = int(last.registration_number[len(prefix):]) + 1
            except (ValueError, IndexError):
                seq = 1
        else:
            seq = 1
        return f"{prefix}{seq:04d}"


class Faculty(models.Model):
    """A faculty member shown in the directory."""

    faculty_number = models.CharField(
        max_length=20, unique=True, editable=False, db_index=True,
        help_text="Auto-generated faculty number, e.g. FAC001",
    )
    name = models.CharField(max_length=120, db_index=True)
    branch = models.CharField(max_length=40, db_index=True)
    designation = models.CharField(max_length=120, blank=True, default='Faculty')
    email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['faculty_number']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['branch']),
        ]

    def __str__(self):
        return f"{self.faculty_number} - {self.name}"

    @classmethod
    def generate_faculty_number(cls):
        """Generate the next sequential faculty number, e.g. FAC001."""
        last = cls.objects.order_by('-faculty_number').first()
        if last:
            try:
                seq = int(last.faculty_number[3:]) + 1
            except (ValueError, IndexError):
                seq = 1
        else:
            seq = 1
        return f"FAC{seq:03d}"


class CollegeInfo(models.Model):
    """
    Editable information about the college shown on the About page.

    Stored as a single row (the admin edits it from the admin dashboard).
    """

    college_name = models.CharField(max_length=200, default='Modern Institute of Technology')
    tagline = models.CharField(max_length=200, blank=True, default='Learn. Celebrate. Grow.')
    history = models.TextField(blank=True, default='')
    vision = models.TextField(blank=True, default='')
    mission = models.TextField(blank=True, default='')
    courses = models.TextField(blank=True, default='')
    branches = models.TextField(blank=True, default='')
    facilities = models.TextField(blank=True, default='')
    principal_name = models.CharField(max_length=200, blank=True, default='')
    principal_message = models.TextField(blank=True, default='')
    address = models.TextField(blank=True, default='')
    phone = models.CharField(max_length=30, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    website = models.CharField(max_length=200, blank=True, default='')
    established_year = models.CharField(max_length=20, blank=True, default='')
    logo = models.ImageField(upload_to='college/', blank=True, null=True)
    hero_image = models.ImageField(upload_to='college/', blank=True, null=True)

    class Meta:
        verbose_name = 'College Information'
        verbose_name_plural = 'College Information'

    def __str__(self):
        return self.college_name

    @classmethod
    def get_info(cls):
        """Return the single editable college-info row (create it if missing)."""
        obj = cls.objects.first()
        if obj is None:
            obj = cls.objects.create()
        return obj


class GalleryImage(models.Model):
    """A photo shown in the gallery, grouped by category."""

    CATEGORY_CHOICES = [
        ('College', 'College'),
        ('Campus', 'Campus'),
        ('Classrooms', 'Classrooms'),
        ('Laboratories', 'Laboratories'),
        ('Fresher Party', 'Fresher Party'),
        ('Events', 'Events'),
        ('Students', 'Students'),
        ('Faculty', 'Faculty'),
    ]

    title = models.CharField(max_length=150, blank=True)
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES, db_index=True)
    image = models.ImageField(upload_to='gallery/', blank=True, null=True)
    # Allow a fallback external image URL / remote path if no file is uploaded.
    image_url = models.CharField(max_length=500, blank=True,
                                 help_text="Optional external image URL used if no image file is uploaded.")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'title']

    def __str__(self):
        return f"{self.category}: {self.title or self.id}"

    @property
    def display_url(self):
        """Return the image URL that should actually be shown."""
        if self.image:
            return self.image.url
        return self.image_url or ''
