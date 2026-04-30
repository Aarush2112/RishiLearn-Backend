document.addEventListener('DOMContentLoaded', () => {

    const API_BASE = window.location.origin;

    // ── SIDEBAR NAVIGATION ────────────────────────────────────
    const navItems = document.querySelectorAll('.nav-item');
    const viewDashboard = document.getElementById('view-dashboard');
    const viewStudent = document.getElementById('view-student');
    const viewTeacher = document.getElementById('view-teacher');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const text = item.textContent.trim();

            if (text.includes('Dashboard') || text.includes('Add Student') || text.includes('Add Teacher')) {
                e.preventDefault();

                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                viewDashboard.style.display = 'none';
                viewStudent.style.display = 'none';
                viewTeacher.style.display = 'none';

                if (text.includes('Dashboard')) {
                    viewDashboard.style.display = 'grid';
                    loadStudents();
                } else if (text.includes('Add Student')) {
                    viewStudent.style.display = 'block';
                } else if (text.includes('Add Teacher')) {
                    viewTeacher.style.display = 'block';
                }
            }
        });
    });

    // ── GET ALL STUDENTS ──────────────────────────────────────
    async function loadStudents() {
        try {
            const res = await fetch(`${API_BASE}/api/students`);
            const data = await res.json();

            if (data.success) {
                renderLeaderboard(data.students);
                renderStats(data.count);
            }
        } catch (err) {
            console.error('Failed to load students:', err);
            showToast('Could not connect to backend', 'error');
        }
    }

    // ── RENDER LEADERBOARD ────────────────────────────────────
    function renderLeaderboard(students) {
        const list = document.querySelector('.leaderboard-list');
        if (!list) return;

        list.innerHTML = '';

        const rankClasses = ['rank-1', 'rank-2', 'rank-3'];

        students.forEach((student, index) => {
            const rankClass = rankClasses[index] || '';
            const initial = student.name.charAt(0).toUpperCase();
            const xp = 1000 - (index * 50);
            const widthPercent = Math.max(30, 100 - (index * 5));

            const li = document.createElement('li');
            li.className = `leaderboard-item ${rankClass}`;
            li.innerHTML = `
                <div class="rank-badge">${index + 1}</div>
                <div class="user-info">
                    <div class="user-avatar-sm">${initial}</div>
                    <span class="user-name">${student.name}</span>
                </div>
                <div class="user-stats">
                    <span class="user-xp">${xp} XP</span>
                    <div class="xp-bar">
                        <div class="xp-fill" style="width: ${widthPercent}%"></div>
                    </div>
                </div>
            `;
            list.appendChild(li);
        });
    }

    // ── RENDER STUDENT COUNT ──────────────────────────────────
    function renderStats(count) {
        const statValue = document.querySelector('.student-icon')
            ?.closest('.stat-content')
            ?.querySelector('.stat-value');
        if (statValue) {
            statValue.textContent = `${count}`;
        }
    }

    // ── ADD STUDENT (POST API) ────────────────────────────────
    const submitBtn = document.querySelector('#view-student .btn-submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const inputs = document.querySelectorAll('#view-student .input-control');
            const name       = inputs[0]?.value.trim();
            const email      = inputs[1]?.value.trim();
            const student_id = inputs[2]?.value.trim();
            const course     = inputs[3]?.value.trim();
            const semester   = inputs[4]?.value.trim();

            // Frontend validation
            if (!name || !email || !student_id || !course || !semester) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            // Loading state
            submitBtn.textContent = 'Adding...';
            submitBtn.disabled = true;

            try {
                const res = await fetch(`${API_BASE}/api/students`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, student_id, course, semester })
                });

                const data = await res.json();

                if (data.success) {
                    showToast(`✓ ${data.student.name} added successfully!`, 'success');
                    clearForm();
                    loadStudents(); // refresh leaderboard
                } else {
                    showToast(`✗ ${data.error}`, 'error');
                }

            } catch (err) {
                showToast('Could not connect to backend', 'error');
                console.error(err);
            } finally {
                submitBtn.textContent = 'Add Student';
                submitBtn.disabled = false;
            }
        });
    }

    // ── CLEAR FORM ────────────────────────────────────────────
    function clearForm() {
        document.querySelectorAll('#view-student .input-control')
            .forEach(input => input.value = '');
    }

    // ── TOAST NOTIFICATION ────────────────────────────────────
    function showToast(message, type = 'info') {
        let toast = document.getElementById('admin-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'admin-toast';
            toast.style.cssText = `
                position: fixed; bottom: 28px; left: 50%;
                transform: translateX(-50%) translateY(80px);
                backdrop-filter: blur(16px);
                color: #f1f5f9; font-size: 13px;
                padding: 12px 24px; border-radius: 99px;
                z-index: 9999; opacity: 0;
                transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
                white-space: nowrap; font-family: 'Inter', sans-serif;
                border: 1px solid;
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.background = type === 'error'
            ? 'rgba(236,72,153,0.15)'
            : 'rgba(139,92,246,0.15)';
        toast.style.borderColor = type === 'error'
            ? 'rgba(236,72,153,0.4)'
            : 'rgba(139,92,246,0.4)';

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(80px)';
        }, 3000);
    }

    // ── INITIAL LOAD ──────────────────────────────────────────
    loadStudents();

});