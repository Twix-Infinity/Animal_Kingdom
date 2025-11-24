const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const tabButtons = document.querySelectorAll('.tab-btn');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });

        document.getElementById(`${tab}-form`).classList.add('active');
    });
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const data = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.success) {
            window.location.href = '/dashboard';
        }
    } catch (error) {
        showError('login-error', error.message);
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        showError('signup-error', 'Passwords do not match');
        return;
    }

    try {
        const data = await apiRequest('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.success) {
            window.location.href = '/dashboard';
        }
    } catch (error) {
        showError('signup-error', error.message);
    }
});
