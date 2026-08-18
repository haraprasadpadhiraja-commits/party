/* ==========================================================
   🎓 FRESHER PARTY 2026 — SITE CONFIGURATION
   ----------------------------------------------------------
   EDIT THIS FILE to change your college details, photos,
   admin password, countdown date and gallery images.

   This site is 100% static (pure HTML/CSS/JS) — upload all
   the files to ANY web server and it just works.
   ========================================================== */

const SITE_CONFIG = {
    college: {
        name: "Modern Institute of Technology",
        shortName: "MIT",
        tagline: "Learn. Celebrate. Grow.",
        establishedYear: "1998",
        history: "Modern Institute of Technology was established in 1998 with a vision to provide " +
                 "quality technical education to students from all over the state. Over the years the " +
                 "college has grown into a centre of excellence with modern laboratories, a rich library " +
                 "and a vibrant campus community.",
        vision: "To be a leading institution producing skilled, ethical and innovative professionals who " +
                "contribute to society and the nation.",
        mission: "To impart quality education, foster research and innovation, nurture creativity and " +
                 "provide an inclusive and supportive learning environment for every student.",
        courses: ["B.Tech in Computer Science", "B.Tech in Information Technology", "B.Tech in Electronics",
                  "B.Tech in Mechanical Engineering", "B.Tech in Civil Engineering", "MBA in Business Management",
                  "B.Sc in Mathematics"],
        branches: ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil",
                   "Management", "Mathematics"],
        facilities: ["Modern Library", "Computer Labs", "Digital Classrooms", "Hostel & Mess",
                     "Sports Complex", "Wi-Fi Campus", "Auditorium & Seminar Halls"],
        principalName: "Dr. A. K. Mishra",
        principalMessage: "Dear students, welcome to the Fresher Party 2026! This is the beginning of a " +
                          "wonderful journey. Explore, learn, make friends and create memories that last " +
                          "a lifetime. Best wishes for your college career.",
        address: "Kalinga Nagar, Bhubaneswar, Odisha 751003",
        phone: "+91 674 2301234",
        email: "info@mit-college.edu",
        website: "www.mit-college.edu",
        // Logo image — put your file in images/ and reference it here, e.g. "images/logo.png"
        logo: "",
        // Hero background image (optional). Leave "" to use the built-in gradient.
        heroImage: ""
    },

    // 🎯 Fresher Party countdown target (JS Date). Set your date here.
    partyDate: "2026-12-15T18:00:00",

    // 🔐 Admin password (used for the client-side admin panel).
    // NOTE: For a pure static site the password lives in JS, so it is NOT
    // truly secure against a determined user. For real security use a server
    // (see the Django version). Change this default before going live.
    adminPassword: "HARA@#1234",
    adminUsername: "admin8144",

    // 🖼️ Gallery categories (order shown)
    galleryCategories: ["College", "Campus", "Classrooms", "Laboratories",
                        "Fresher Party", "Events", "Students", "Faculty"],

    // 🖼️ Default gallery images.
    // Replace these URLs (or use local paths like "images/photo1.jpg")
    // with your own college photographs.
    galleryImages: [
        { title: "Main Building",   category: "College",      url: "https://images.unsplash.com/photo-1562774053-701939374585?w=600" },
        { title: "Green Campus",    category: "Campus",       url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600" },
        { title: "Smart Classroom", category: "Classrooms",   url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600" },
        { title: "Computer Lab",    category: "Laboratories", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600" },
        { title: "Celebration",     category: "Fresher Party",url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600" },
        { title: "Annual Function", category: "Events",       url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600" },
        { title: "Student Life",    category: "Students",     url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600" },
        { title: "Faculty Meet",    category: "Faculty",      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" }
    ]
};
