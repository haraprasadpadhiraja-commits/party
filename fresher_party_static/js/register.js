/* ==========================================================
   🎓 Registration form validation & success handling
   ========================================================== */
(function () {
    'use strict';

    const form = document.getElementById('regForm');
    const alert = document.getElementById('formAlert');
    if (!form) return;

    function setErr(id, msg) { const el = document.getElementById(id); if (el) el.textContent = msg || ''; }
    function clearErrors() {
        ['errName', 'errFather', 'errAddress', 'errPhone', 'errMarks', 'errBranch'].forEach(function (id) {
            const el = document.getElementById(id); if (el) el.textContent = '';
        });
        if (alert) alert.style.display = 'none';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();
        let ok = true;

        const name = document.getElementById('name').value.trim();
        const fatherName = document.getElementById('fatherName').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const marks = document.getElementById('marks').value.trim();
        const branch = document.getElementById('branch').value;

        // Validation
        if (!/^[A-Za-z][A-Za-z .'-]{2,}$/.test(name)) { setErr('errName', 'Enter a valid name (letters only).'); ok = false; }
        if (!/^[6-9]\d{9}$/.test(phone)) { setErr('errPhone', 'Enter a valid 10-digit mobile number (starts with 6-9).'); ok = false; }
        if (marks === '' || isNaN(marks) || Number(marks) < 0 || Number(marks) > 100) { setErr('errMarks', 'Marks must be between 0 and 100.'); ok = false; }
        if (!branch) { setErr('errBranch', 'Please select a branch.'); ok = false; }

        if (!ok) { if (alert) alert.style.display = 'block'; return; }

        // Save to local "database"
        const student = DB.addStudent({ name: name, fatherName: fatherName, address: address,
            phone: phone, marks: Number(marks), branch: branch });

        // Show success
        document.getElementById('suName').textContent = student.name;
        document.getElementById('suName2').textContent = student.name;
        document.getElementById('suReg').textContent = student.registrationNumber;
        document.getElementById('suBranch').textContent = student.branch;
        document.getElementById('suMarks').textContent = student.marks + '%';
        document.getElementById('suPhone').textContent = student.phone;
        document.getElementById('successModal').classList.add('show');
        launchConfetti();
        showToast('🎉 Registration Successful! Your registration has been completed successfully.', 'success');

        form.reset();
    });

    window.resetForm = function () {
        document.getElementById('successModal').classList.remove('show');
    };
    // Close modal on backdrop click
    const modal = document.getElementById('successModal');
    if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('show'); });
})();
