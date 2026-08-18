/* ==========================================================
   🎓 Admin panel — login gate, student/faculty CRUD,
   college editor, gallery manager, Excel/PDF exports.
   ========================================================== */
(function () {
    'use strict';

    const loginGate = document.getElementById('loginGate');
    const adminPanel = document.getElementById('adminPanel');

    // ---------- Session ----------
    function isLoggedIn() {
        try { return localStorage.getItem('fp_admin') === '1'; } catch (e) { return false; }
    }
    function setLoggedIn(v) {
        try { localStorage.setItem('fp_admin', v ? '1' : '0'); } catch (e) {}
    }

    // ---------- Login ----------
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const u = document.getElementById('loginUser').value.trim();
        const p = document.getElementById('loginPass').value;
        if (u === SITE_CONFIG.adminUsername && p === SITE_CONFIG.adminPassword) {
            setLoggedIn(true);
            showGate(false);
            showToast('✅ Logged in successfully.', 'success');
        } else {
            document.getElementById('loginAlert').style.display = 'block';
            showToast('⚠️ Invalid username or password.', 'error');
        }
    });

    function showGate(show) {
        loginGate.style.display = show ? '' : 'none';
        adminPanel.style.display = show ? 'none' : '';
    }
    window.adminLogout = function () {
        setLoggedIn(false);
        showGate(true);
        showToast('You have been logged out.', 'warning');
    };

    // ---------- Tabs ----------
    const tabs = document.querySelectorAll('[data-tab]');
    function switchTab(tab) {
        document.querySelectorAll('.tab-pane').forEach(function (p) { p.style.display = 'none'; });
        document.getElementById('tab-' + tab).style.display = '';
        tabs.forEach(function (t) {
            if (t.getAttribute('data-tab') === tab) { t.className = 'btn btn-primary'; }
            else t.className = 'btn btn-outline';
        });
        if (tab === 'students') renderStudents();
        if (tab === 'faculty') renderFaculty();
        if (tab === 'college') fillCollegeForm();
        if (tab === 'gallery') { fillCategorySelect(); renderGallery(); }
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { switchTab(t.getAttribute('data-tab')); }); });

    // ---------- Stats ----------
    function refreshStats() {
        document.getElementById('aStudents').textContent = DB.totalStudents();
        document.getElementById('aFaculty').textContent = DB.totalFaculty();
        document.getElementById('aBranches').textContent = DB.totalBranches();
    }

    // ---------- Students ----------
    function renderStudents() {
        const q = (document.getElementById('stuQ').value || '').trim().toLowerCase();
        let list = DB.allStudents();
        if (q) list = DB.searchStudents(q);
        const tbody = document.getElementById('stuTable');
        if (!list.length) { tbody.innerHTML = '<tr><td colspan="7" class="muted center">No students found.</td></tr>'; return; }
        tbody.innerHTML = list.map(function (s) {
            return '<tr><td class="mono">' + s.registrationNumber + '</td><td>' + escapeHtml(s.name) + '</td>' +
                '<td>' + escapeHtml(s.fatherName) + '</td><td>' + s.phone + '</td>' +
                '<td><span class="badge branch-badge">' + escapeHtml(s.branch) + '</span></td><td>' + s.marks + '%</td>' +
                '<td class="row-actions">' +
                '<button class="icon-btn view" title="View" onclick="viewStudent(\'' + s.id + '\')"><i class="fas fa-eye"></i></button>' +
                '<button class="icon-btn edit" title="Edit" onclick="openStudentModal(\'' + s.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button class="icon-btn del" title="Delete" data-confirm="Are you sure you want to delete this student? This action cannot be undone." data-cb="deleteStudentCb" data-id="' + s.id + '"><i class="fas fa-trash"></i></button>' +
                '</td></tr>';
        }).join('');
    }
    window.renderStudents = renderStudents;
    document.getElementById('stuQ').addEventListener('input', function () {
        clearTimeout(this._t); this._t = setTimeout(renderStudents, 250);
    });

    // Student modal add/edit
    let editingStudentId = null;
    window.openStudentModal = function (id) {
        editingStudentId = id || null;
        document.getElementById('studentModalTitle').textContent = id ? 'Edit Student' : 'Add Student';
        ['smErrName', 'smErrPhone', 'smErrMarks'].forEach(function (x) { document.getElementById(x).textContent = ''; });
        if (id) {
            const s = DB.allStudents().find(function (x) { return x.id === id; });
            if (s) {
                document.getElementById('smName').value = s.name; document.getElementById('smFather').value = s.fatherName;
                document.getElementById('smAddress').value = s.address; document.getElementById('smPhone').value = s.phone;
                document.getElementById('smMarks').value = s.marks; document.getElementById('smBranch').value = s.branch;
            }
        } else {
            ['smName', 'smFather', 'smAddress', 'smPhone', 'smMarks'].forEach(function (x) { document.getElementById(x).value = ''; });
            document.getElementById('smBranch').value = '';
        }
        document.getElementById('studentModal').classList.add('show');
    };
    window.closeStudentModal = function () { document.getElementById('studentModal').classList.remove('show'); };

    window.saveStudent = function () {
        const data = {
            name: document.getElementById('smName').value.trim(),
            fatherName: document.getElementById('smFather').value.trim(),
            address: document.getElementById('smAddress').value.trim(),
            phone: document.getElementById('smPhone').value.trim(),
            marks: document.getElementById('smMarks').value,
            branch: document.getElementById('smBranch').value
        };
        let ok = true;
        if (!/^[A-Za-z][A-Za-z .'-]{2,}$/.test(data.name)) { document.getElementById('smErrName').textContent = 'Enter a valid name.'; ok = false; }
        if (!/^[6-9]\d{9}$/.test(data.phone)) { document.getElementById('smErrPhone').textContent = 'Enter a valid 10-digit number.'; ok = false; }
        if (data.marks === '' || isNaN(data.marks) || Number(data.marks) < 0 || Number(data.marks) > 100) { document.getElementById('smErrMarks').textContent = 'Marks 0-100.'; ok = false; }
        if (!ok) return;
        if (editingStudentId) DB.updateStudent(editingStudentId, data);
        else DB.addStudent(data);
        closeStudentModal(); refreshStats(); renderStudents();
        showToast('✅ Record saved successfully.', 'success');
    };

    window.viewStudent = function (id) {
        const s = DB.allStudents().find(function (x) { return x.id === id; });
        if (!s) return;
        const details = [
            ['Name', s.name], ['Registration', s.registrationNumber], ["Father's Name", s.fatherName],
            ['Address', s.address], ['Phone', s.phone], ['Marks', s.marks + '%'], ['Branch', s.branch]
        ].map(function (r) { return '<div class="detail-row"><span>' + r[0] + '</span><span>' + escapeHtml(r[1]) + '</span></div>'; }).join('');
        document.getElementById('studentModalTitle').textContent = 'Student Details';
        document.getElementById('smName').value = s.name; document.getElementById('smFather').value = s.fatherName;
        document.getElementById('smAddress').value = s.address; document.getElementById('smPhone').value = s.phone;
        document.getElementById('smMarks').value = s.marks; document.getElementById('smBranch').value = s.branch;
        // Replace form area with a simple details view via a modal
        const modal = document.getElementById('studentModal');
        const inner = modal.querySelector('.modal-card');
        inner.innerHTML = '<h3>🎓 ' + escapeHtml(s.name) + '</h3><div class="profile-details">' + details + '</div>' +
            '<div class="form-actions"><button class="btn btn-primary" onclick="window.__closeView()"><i class="fas fa-check"></i> Close</button></div>';
        modal.classList.add('show');
        window.__closeView = function () { closeStudentModal(); setTimeout(openStudentModal, 0); /* reopen for edit if needed */ };
    };

    window.deleteStudentCb = function (btn) {
        DB.deleteStudent(btn.getAttribute('data-id'));
        refreshStats(); renderStudents();
        showToast('🗑️ Record deleted successfully.', 'success');
    };

    // ---------- Faculty ----------
    function renderFaculty() {
        const tbody = document.getElementById('facTable');
        const list = DB.allFaculty();
        if (!list.length) { tbody.innerHTML = '<tr><td colspan="6" class="muted center">No faculty found.</td></tr>'; return; }
        tbody.innerHTML = list.map(function (f) {
            return '<tr><td class="mono">' + f.facultyNumber + '</td><td>' + escapeHtml(f.name) + '</td>' +
                '<td><span class="badge branch-badge">' + escapeHtml(f.branch) + '</span></td><td>' + escapeHtml(f.designation) + '</td>' +
                '<td>' + escapeHtml(f.email) + '</td>' +
                '<td class="row-actions">' +
                '<button class="icon-btn edit" title="Edit" onclick="openFacultyModal(\'' + f.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button class="icon-btn del" title="Delete" data-confirm="Are you sure you want to delete this faculty member?" data-cb="deleteFacultyCb" data-id="' + f.id + '"><i class="fas fa-trash"></i></button>' +
                '</td></tr>';
        }).join('');
    }
    window.renderFaculty = renderFaculty;

    let editingFacultyId = null;
    window.openFacultyModal = function (id) {
        editingFacultyId = id || null;
        document.getElementById('facultyModalTitle').textContent = id ? 'Edit Faculty' : 'Add Faculty';
        if (id) {
            const f = DB.allFaculty().find(function (x) { return x.id === id; });
            if (f) {
                document.getElementById('fmName').value = f.name; document.getElementById('fmBranch').value = f.branch;
                document.getElementById('fmDesig').value = f.designation; document.getElementById('fmEmail').value = f.email;
            }
        } else { ['fmName', 'fmBranch', 'fmDesig', 'fmEmail'].forEach(function (x) { document.getElementById(x).value = ''; }); }
        document.getElementById('facultyModal').classList.add('show');
    };
    window.closeFacultyModal = function () { document.getElementById('facultyModal').classList.remove('show'); };

    window.saveFaculty = function () {
        const data = {
            name: document.getElementById('fmName').value.trim(),
            branch: document.getElementById('fmBranch').value.trim(),
            designation: document.getElementById('fmDesig').value.trim() || 'Faculty',
            email: document.getElementById('fmEmail').value.trim()
        };
        if (!data.name || !data.branch) { showToast('⚠️ Name and branch are required.', 'error'); return; }
        if (editingFacultyId) DB.updateFaculty(editingFacultyId, data);
        else DB.addFaculty(data);
        closeFacultyModal(); refreshStats(); renderFaculty();
        showToast('✅ Faculty saved successfully.', 'success');
    };
    window.deleteFacultyCb = function (btn) {
        DB.deleteFaculty(btn.getAttribute('data-id'));
        refreshStats(); renderFaculty();
        showToast('🗑️ Record deleted successfully.', 'success');
    };

    // ---------- College editor ----------
    function fillCollegeForm() {
        const c = DB.collegeInfo();
        document.getElementById('cName').value = c.name;
        document.getElementById('cTagline').value = c.tagline || '';
        document.getElementById('cYear').value = c.establishedYear || '';
        document.getElementById('cWebsite').value = c.website || '';
        document.getElementById('cAddress').value = c.address || '';
        document.getElementById('cPhone').value = c.phone || '';
        document.getElementById('cEmail').value = c.email || '';
        document.getElementById('cHistory').value = c.history || '';
        document.getElementById('cVision').value = c.vision || '';
        document.getElementById('cMission').value = c.mission || '';
        document.getElementById('cCourses').value = (c.courses || []).join('\n');
        document.getElementById('cBranches').value = (c.branches || []).join('\n');
        document.getElementById('cFacilities').value = (c.facilities || []).join('\n');
        document.getElementById('cPrincipal').value = c.principalName || '';
        document.getElementById('cPmsg').value = c.principalMessage || '';
        document.getElementById('cLogo').value = c.logo || '';
        document.getElementById('cHero').value = c.heroImage || '';
    }
    window.saveCollege = function () {
        const c = DB.collegeInfo();
        c.name = document.getElementById('cName').value.trim();
        c.tagline = document.getElementById('cTagline').value.trim();
        c.establishedYear = document.getElementById('cYear').value.trim();
        c.website = document.getElementById('cWebsite').value.trim();
        c.address = document.getElementById('cAddress').value.trim();
        c.phone = document.getElementById('cPhone').value.trim();
        c.email = document.getElementById('cEmail').value.trim();
        c.history = document.getElementById('cHistory').value.trim();
        c.vision = document.getElementById('cVision').value.trim();
        c.mission = document.getElementById('cMission').value.trim();
        c.courses = document.getElementById('cCourses').value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
        c.branches = document.getElementById('cBranches').value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
        c.facilities = document.getElementById('cFacilities').value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
        c.principalName = document.getElementById('cPrincipal').value.trim();
        c.principalMessage = document.getElementById('cPmsg').value.trim();
        c.logo = document.getElementById('cLogo').value.trim();
        c.heroImage = document.getElementById('cHero').value.trim();
        DB.saveCollegeInfo(c);
        showToast('✅ College information updated.', 'success');
    };

    // ---------- Gallery manager ----------
    function fillCategorySelect() {
        const sel = document.getElementById('gCat');
        sel.innerHTML = SITE_CONFIG.galleryCategories.map(function (c) { return '<option>' + c + '</option>'; }).join('');
    }
    function renderGallery() {
        const grid = document.getElementById('galGrid');
        const list = DB.gallery();
        if (!list.length) { grid.innerHTML = '<p class="muted">No images.</p>'; return; }
        grid.innerHTML = list.map(function (g, i) {
            const src = g.url || '';
            const inner = src ? '<img src="' + src + '" alt="" loading="lazy">' : '<div class="gallery-placeholder">📷</div>';
            return '<div class="gallery-item">' + inner +
                '<div class="gallery-overlay"><span>' + escapeHtml(g.title) + '</span><span class="gallery-cat">' + escapeHtml(g.category) + '</span></div>' +
                '<div class="gallery-admin-actions">' +
                '<button class="icon-btn del" title="Delete" data-confirm="Delete this image?" data-cb="deleteGalleryCb" data-index="' + i + '"><i class="fas fa-trash"></i></button>' +
                '</div></div>';
        }).join('');
    }
    window.addGallery = function () {
        const title = document.getElementById('gTitle').value.trim();
        const cat = document.getElementById('gCat').value;
        const url = document.getElementById('gUrl').value.trim();
        if (!url) { showToast('⚠️ Please enter an image URL.', 'error'); return; }
        const list = DB.gallery();
        list.push({ title: title || cat, category: cat, url: url });
        DB.saveGallery(list);
        document.getElementById('gTitle').value = ''; document.getElementById('gUrl').value = '';
        renderGallery();
        showToast('✅ Image added.', 'success');
    };
    window.deleteGalleryCb = function (btn) {
        const idx = Number(btn.getAttribute('data-index'));
        const list = DB.gallery(); list.splice(idx, 1); DB.saveGallery(list);
        renderGallery();
        showToast('🗑️ Image deleted.', 'success');
    };

    // ---------- Exports ----------
    function studentRows() {
        const q = (document.getElementById('stuQ').value || '').trim().toLowerCase();
        let list = q ? DB.searchStudents(q) : DB.allStudents();
        return {
            headers: ['Registration Number', 'Student Name', "Father's Name", 'Address', 'Phone', 'Marks', 'Branch', 'Registration Date'],
            rows: list.map(function (s) {
                return [s.registrationNumber, s.name, s.fatherName, s.address, s.phone, s.marks, s.branch,
                    new Date(s.createdAt).toLocaleString()];
            })
        };
    }

    window.exportExcel = function () {
        const d = studentRows();
        if (typeof XLSX === 'undefined') { showToast('⚠️ Excel library not loaded (need internet).', 'error'); return; }
        const ws = XLSX.utils.aoa_to_sheet([d.headers].concat(d.rows));
        ws['!cols'] = d.headers.map(function (_, i) { return { wch: [18, 24, 20, 30, 14, 10, 22, 18][i] || 18 }; });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students');
        XLSX.writeFile(wb, 'students_export.xlsx');
        showToast('📊 Excel exported (' + d.rows.length + ' students).', 'success');
    };

    window.exportPDF = function () {
        const d = studentRows();
        // Build a print-friendly HTML and open a new window for print/save as PDF.
        const html = '<html><head><title>Students Export</title><style>' +
            'body{font-family:sans-serif;padding:30px}h1{color:#4f46e5;text-align:center;margin:0}' +
            '.sub{text-align:center;color:#555;margin-bottom:20px}' +
            'table{width:100%;border-collapse:collapse;font-size:12px}' +
            'th{background:#4f46e5;color:#fff;padding:8px;text-align:left}' +
            'td{padding:6px;border-bottom:1px solid #ddd}' +
            'tr:nth-child(even){background:#f5f5ff}</style></head><body>' +
            '<h1>' + escapeHtml(SITE_CONFIG.college.name) + '</h1>' +
            '<p class="sub">Fresher Party Registration List — Total: ' + d.rows.length + ' students · ' + new Date().toLocaleString() + '</p>' +
            '<table><thead><tr>' + d.headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
            d.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + escapeHtml(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
            '</tbody></table></body></html>';
        const w = window.open('', '_blank');
        if (w) {
            w.document.write(html);
            w.document.close();
            w.focus();
            setTimeout(function () { w.print(); }, 400);
            showToast('📄 PDF window opened — use Print → Save as PDF.', 'success');
        } else {
            showToast('⚠️ Pop-up blocked. Please allow pop-ups.', 'error');
        }
    };

    // ---------- Init ----------
    showGate(!isLoggedIn());
    if (isLoggedIn()) {
        document.getElementById('adminUser').textContent = SITE_CONFIG.adminUsername;
        refreshStats();
        switchTab('students');
    }
})();
