"""
Seed the database with clearly-marked DEMO data so the website is not empty.

Usage:
    python manage.py seed_demo

This only runs if there are no existing records (it never overwrites data).
"""

from django.core.management.base import BaseCommand

from party.models import CollegeInfo, Faculty, GalleryImage, Student


# Clearly marked demo data sets.
DEMO_STUDENTS = [
    ("Hara Prasad Padhi", "Krushna Chandra Padhi", "Bhubaneswar, Odisha", "9861054321", 88.50, "Computer Science"),
    ("Priyanka Sahu", "Ramesh Sahu", "Cuttack, Odisha", "9937124560", 92.00, "Information Technology"),
    ("Ankit Mohanty", "Suresh Mohanty", "Puri, Odisha", "9778812345", 76.40, "Electronics"),
    ("Sneha Behera", "Dilip Behera", "Bhubaneswar, Odisha", "9853012567", 81.20, "Computer Science"),
    ("Rahul Das", "Niranjan Das", "Khordha, Odisha", "9864567890", 67.80, "Mechanical"),
    ("Ayesha Khan", "Mohammed Khan", "Bhubaneswar, Odisha", "9934011223", 94.30, "Management"),
    ("Subham Pattnaik", "Bijay Pattnaik", "Jajpur, Odisha", "9777001122", 72.10, "Civil"),
    ("Mamata Rout", "Gopal Rout", "Balasore, Odisha", "9853223344", 85.00, "Mathematics"),
]

DEMO_FACULTY = [
    ("Mr. Alok Tripathy", "Computer Science", "Associate Professor", "alok@college.edu"),
    ("Mrs. Sunita Mahapatra", "Mathematics", "Professor", "sunita@college.edu"),
    ("Mr. Prakash Routray", "Management", "Assistant Professor", "prakash@college.edu"),
    ("Dr. Bhabani Shankar", "Information Technology", "Head of Department", "bhabani@college.edu"),
    ("Mrs. Rina Pattnaik", "Electronics", "Professor", "rina@college.edu"),
]

DEMO_COLLEGE = {
    "college_name": "Modern Institute of Technology",
    "tagline": "Learn. Celebrate. Grow.",
    "established_year": "1998",
    "history": "Modern Institute of Technology was established in 1998 with a vision to provide "
               "quality technical education to students from all over the state. Over the years, the "
               "college has grown into a centre of excellence with modern laboratories, a rich library "
               "and a vibrant campus community.",
    "vision": "To be a leading institution producing skilled, ethical and innovative professionals "
              "who contribute to society and the nation.",
    "mission": "To impart quality education, foster research and innovation, nurture creativity and "
               "provide an inclusive and supportive learning environment for every student.",
    "courses": "B.Tech in Computer Science\nB.Tech in Information Technology\nB.Tech in Electronics\n"
               "B.Tech in Mechanical Engineering\nB.Tech in Civil Engineering\nMBA in Business Management\nB.Sc in Mathematics",
    "branches": "Computer Science\nInformation Technology\nElectronics\nMechanical\nCivil\nManagement\nMathematics",
    "facilities": "Modern Library\nComputer Labs\nDigital Classrooms\nHostel & Mess\nSports Complex\nWi-Fi Campus\nAuditorium & Seminar Halls",
    "principal_name": "Dr. A. K. Mishra",
    "principal_message": "Dear students, welcome to the Fresher Party 2026! This is the beginning of a "
                         "wonderful journey. Explore, learn, make friends and create memories that last "
                         "a lifetime. Best wishes for your college career.",
    "address": "Kalinga Nagar, Bhubaneswar, Odisha 751003",
    "phone": "+91 674 2301234",
    "email": "info@mit-college.edu",
    "website": "www.mit-college.edu",
}


class Command(BaseCommand):
    help = "Seed clearly-marked demo data into the database (skips if data exists)."

    def handle(self, *args, **options):
        self.stdout.write("Seeding DEMO data (marked as demo)…")

        if Student.objects.exists():
            self.stdout.write(self.style.WARNING("Students already exist — skipping student seed."))
        else:
            for row in DEMO_STUDENTS:
                s = Student(
                    registration_number=Student.generate_registration_number(),
                    name=row[0], father_name=row[1], address=row[2],
                    phone=row[3], marks=row[4], branch=row[5])
                s.save()
            self.stdout.write(self.style.SUCCESS(f"Added {len(DEMO_STUDENTS)} demo students."))

        if Faculty.objects.exists():
            self.stdout.write(self.style.WARNING("Faculty already exist — skipping faculty seed."))
        else:
            for row in DEMO_FACULTY:
                f = Faculty(
                    faculty_number=Faculty.generate_faculty_number(),
                    name=row[0], branch=row[1], designation=row[2], email=row[3])
                f.save()
            self.stdout.write(self.style.SUCCESS(f"Added {len(DEMO_FACULTY)} demo faculty."))

        if CollegeInfo.objects.exists():
            self.stdout.write(self.style.WARNING("College info already set — skipping."))
        else:
            CollegeInfo.objects.create(**DEMO_COLLEGE)
            self.stdout.write(self.style.SUCCESS("Added demo college information."))

        if GalleryImage.objects.exists():
            self.stdout.write(self.style.WARNING("Gallery already has images — skipping."))
        else:
            # Add clearly-marked sample gallery entries using sample images.
            samples = [
                ("Main Building", "College", "https://images.unsplash.com/photo-1562774053-701939374585?w=600"),
                ("Green Campus", "Campus", "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600"),
                ("Smart Classroom", "Classrooms", "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600"),
                ("Computer Lab", "Laboratories", "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600"),
                ("Celebration Stage", "Fresher Party", "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600"),
                ("Annual Function", "Events", "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600"),
                ("Student Activities", "Students", "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600"),
                ("Faculty Meet", "Faculty", "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"),
            ]
            for title, category, url in samples:
                GalleryImage.objects.create(title=title, category=category, image_url=url)
            self.stdout.write(self.style.SUCCESS("Added demo gallery images (sample URLs)."))

        self.stdout.write(self.style.SUCCESS(
            "Demo seeding complete. Replace sample gallery images/URLs with your own in the admin panel."))
