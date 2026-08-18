/* ==========================================================
   🎓 FRESHER PARTY 2026 — LOCAL "DATABASE" LAYER
   ----------------------------------------------------------
   Uses the browser's localStorage so the static site can
   actually save, read, search and count records — just like
   a real database, but it lives in each visitor's browser.

   Keys used:
     fp_students    -> array of student objects
     fp_faculty     -> array of faculty objects
     fp_college     -> editable college info (admin)
     fp_gallery     -> editable gallery images (admin)
     fp_regcounter  -> internal counter for reg numbers
   ========================================================== */

const DB = (function () {
    'use strict';

    function get(key, fallback) {
        try {
            const v = localStorage.getItem(key);
            return v ? JSON.parse(v) : fallback;
        } catch (e) { return fallback; }
    }
    function set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    }

    // ---------- Seed (demo) data, clearly marked ----------
    const SEED_STUDENTS = [
        { name: "Hara Prasad Padhi", fatherName: "Krushna Chandra Padhi", address: "Bhubaneswar, Odisha", phone: "9861054321", marks: 88.5, branch: "Computer Science" },
        { name: "Priyanka Sahu", fatherName: "Ramesh Sahu", address: "Cuttack, Odisha", phone: "9937124560", marks: 92.0, branch: "Information Technology" },
        { name: "Ankit Mohanty", fatherName: "Suresh Mohanty", address: "Puri, Odisha", phone: "9778812345", marks: 76.4, branch: "Electronics" },
        { name: "Sneha Behera", fatherName: "Dilip Behera", address: "Bhubaneswar, Odisha", phone: "9853012567", marks: 81.2, branch: "Computer Science" },
        { name: "Rahul Das", fatherName: "Niranjan Das", address: "Khordha, Odisha", phone: "9864567890", marks: 67.8, branch: "Mechanical" },
        { name: "Ayesha Khan", fatherName: "Mohammed Khan", address: "Bhubaneswar, Odisha", phone: "9934011223", marks: 94.3, branch: "Management" },
        { name: "Subham Pattnaik", fatherName: "Bijay Pattnaik", address: "Jajpur, Odisha", phone: "9777001122", marks: 72.1, branch: "Civil" },
        { name: "Mamata Rout", fatherName: "Gopal Rout", address: "Balasore, Odisha", phone: "9853223344", marks: 85.0, branch: "Mathematics" }
    ];

    const SEED_FACULTY = [
        { name: "Mr. Alok Tripathy",    branch: "Computer Science",      designation: "Associate Professor", email: "alok@college.edu" },
        { name: "Mrs. Sunita Mahapatra",branch: "Mathematics",           designation: "Professor",           email: "sunita@college.edu" },
        { name: "Mr. Prakash Routray",  branch: "Management",            designation: "Assistant Professor", email: "prakash@college.edu" },
        { name: "Dr. Bhabani Shankar",  branch: "Information Technology",designation: "Head of Department",  email: "bhabani@college.edu" },
        { name: "Mrs. Rina Pattnaik",   branch: "Electronics",           designation: "Professor",           email: "rina@college.edu" }
    ];

    // ---------- Student database ----------
    function allStudents() {
        let list = get('fp_students', null);
        if (list === null) {
            list = [];
            SEED_STUDENTS.forEach(function (s, i) {
                list.push(makeStudent(s, i + 1));
            });
            set('fp_students', list);
        }
        return list;
    }

    function makeStudent(data, seq) {
        return {
            id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
            registrationNumber: regNumberFor(seq),
            name: data.name,
            fatherName: data.fatherName || "",
            address: data.address || "",
            phone: data.phone || "",
            marks: Number(data.marks || 0),
            branch: data.branch || "",
            createdAt: new Date().toISOString()
        };
    }

    function nextStudentSeq() {
        // Highest existing sequence for the current year.
        const year = new Date().getFullYear();
        const prefix = 'FR' + year;
        let max = 0;
        allStudents().forEach(function (s) {
            if (s.registrationNumber.indexOf(prefix) === 0) {
                const n = parseInt(s.registrationNumber.slice(prefix.length), 10);
                if (!isNaN(n) && n > max) max = n;
            }
        });
        return max + 1;
    }

    function regNumberFor(seq) {
        return 'FR' + new Date().getFullYear() + String(seq).padStart(4, '0');
    }

    function saveStudents(list) { set('fp_students', list); }

    function addStudent(data) {
        const list = allStudents();
        const student = makeStudent(data, nextStudentSeq());
        list.push(student);
        saveStudents(list);
        return student;
    }

    function updateStudent(id, data) {
        let list = allStudents();
        let updated = null;
        list = list.map(function (s) {
            if (s.id === id) {
                s.name = data.name; s.fatherName = data.fatherName; s.address = data.address;
                s.phone = data.phone; s.marks = Number(data.marks); s.branch = data.branch;
                updated = s;
            }
            return s;
        });
        saveStudents(list);
        return updated;
    }

    function deleteStudent(id) {
        let list = allStudents().filter(function (s) { return s.id !== id; });
        saveStudents(list);
    }

    function searchStudents(q) {
        q = (q || '').trim().toLowerCase();
        if (!q) return [];
        return allStudents().filter(function (s) {
            return (s.name + ' ' + s.registrationNumber + ' ' + s.branch + ' ' +
                    s.fatherName + ' ' + s.phone).toLowerCase().indexOf(q) !== -1;
        });
    }

    // ---------- Faculty database ----------
    function allFaculty() {
        let list = get('fp_faculty', null);
        if (list === null) {
            list = [];
            SEED_FACULTY.forEach(function (f, i) {
                f.id = 'fac-' + (i + 1);
                f.facultyNumber = 'FAC' + String(i + 1).padStart(3, '0');
                list.push(f);
            });
            set('fp_faculty', list);
        }
        return list;
    }
    function saveFaculty(list) { set('fp_faculty', list); }

    function nextFacultySeq() {
        let max = 0;
        allFaculty().forEach(function (f) {
            const n = parseInt(f.facultyNumber.replace('FAC', ''), 10);
            if (!isNaN(n) && n > max) max = n;
        });
        return max + 1;
    }

    function addFaculty(data) {
        const list = allFaculty();
        list.push({
            id: 'fac-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
            facultyNumber: 'FAC' + String(nextFacultySeq()).padStart(3, '0'),
            name: data.name, branch: data.branch,
            designation: data.designation || 'Faculty', email: data.email || ''
        });
        saveFaculty(list);
    }

    function updateFaculty(id, data) {
        let list = allFaculty().map(function (f) {
            if (f.id === id) {
                f.name = data.name; f.branch = data.branch;
                f.designation = data.designation; f.email = data.email;
            }
            return f;
        });
        saveFaculty(list);
    }

    function deleteFaculty(id) {
        saveFaculty(allFaculty().filter(function (f) { return f.id !== id; }));
    }

    function searchFaculty(q) {
        q = (q || '').trim().toLowerCase();
        if (!q) return [];
        return allFaculty().filter(function (f) {
            return (f.name + ' ' + f.facultyNumber + ' ' + f.branch + ' ' +
                    f.designation).toLowerCase().indexOf(q) !== -1;
        });
    }

    // ---------- College info (editable) ----------
    function collegeInfo() {
        let info = get('fp_college', null);
        if (info === null) {
            info = JSON.parse(JSON.stringify(SITE_CONFIG.college));
            set('fp_college', info);
        }
        return info;
    }
    function saveCollegeInfo(info) { set('fp_college', info); }

    // ---------- Gallery (editable) ----------
    function gallery() {
        let list = get('fp_gallery', null);
        if (list === null) {
            list = JSON.parse(JSON.stringify(SITE_CONFIG.galleryImages));
            set('fp_gallery', list);
        }
        return list;
    }
    function saveGallery(list) { set('fp_gallery', list); }

    // ---------- Counts ----------
    function totalStudents() { return allStudents().length; }
    function totalFaculty() { return allFaculty().length; }
    function totalBranches() {
        const b = {};
        allStudents().forEach(function (s) { b[s.branch] = 1; });
        return Object.keys(b).length;
    }

    return {
        allStudents, searchStudents, addStudent, updateStudent, deleteStudent,
        allFaculty, searchFaculty, addFaculty, updateFaculty, deleteFaculty,
        collegeInfo, saveCollegeInfo, gallery, saveGallery,
        totalStudents, totalFaculty, totalBranches, nextStudentSeq
    };
})();
