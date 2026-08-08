const LDCE_LIBRARY_KEYS = {
  users: 'ldce_library_users',
  session: 'ldce_library_session_user',
  borrowed: 'ldce_library_borrowed_books',
  history: 'ldce_library_history'
};

const LDCE_ACCOUNT_SAMPLE = {
  borrowedBooks: [
    {
      id: 'bk-1001',
      name: 'Data Structures',
      author: 'Mark Allen Weiss',
      issueDate: '01 Aug 2026',
      dueDate: '15 Aug 2026',
      status: 'Active'
    },
    {
      id: 'bk-1002',
      name: 'Database Management System',
      author: 'Korth',
      issueDate: '03 Aug 2026',
      dueDate: '17 Aug 2026',
      status: 'Active'
    },
    {
      id: 'bk-1003',
      name: 'Operating Systems',
      author: 'Abraham Silberschatz',
      issueDate: '20 Jul 2026',
      dueDate: '03 Aug 2026',
      status: 'Overdue'
    }
  ],
  history: [
    { type: 'Issued', title: 'Data Structures', date: '01 Aug 2026' },
    { type: 'Returned', title: 'Operating Systems', date: '30 Jul 2026' },
    { type: 'Renewed', title: 'Computer Networks', date: '28 Jul 2026' }
  ]
};

function normalizeAccountData() {
  if (!localStorage.getItem(LDCE_LIBRARY_KEYS.borrowed)) {
    localStorage.setItem(LDCE_LIBRARY_KEYS.borrowed, JSON.stringify(LDCE_ACCOUNT_SAMPLE.borrowedBooks));
  }

  if (!localStorage.getItem(LDCE_LIBRARY_KEYS.history)) {
    localStorage.setItem(LDCE_LIBRARY_KEYS.history, JSON.stringify(LDCE_ACCOUNT_SAMPLE.history));
  }
}

function getUserCollection() {
  const raw = localStorage.getItem(LDCE_LIBRARY_KEYS.users);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

function setUserCollection(users) {
  localStorage.setItem(LDCE_LIBRARY_KEYS.users, JSON.stringify(users));
}

function getCurrentSessionUser() {
  const raw = localStorage.getItem(LDCE_LIBRARY_KEYS.session);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function setCurrentSessionUser(user) {
  localStorage.setItem(LDCE_LIBRARY_KEYS.session, JSON.stringify(user));
}

function clearCurrentSessionUser() {
  localStorage.removeItem(LDCE_LIBRARY_KEYS.session);
}

function showToast(message, type = 'success') {
  const toastWrapper = document.getElementById('toastWrapper');
  if (!toastWrapper) {
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastWrapper.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderAccountPage() {
  const accountView = document.getElementById('account-view');
  if (!accountView) {
    return;
  }

  const currentSession = getCurrentSessionUser();

  if (!currentSession) {
    renderLoginPage();
  } else {
    renderDashboardPage(currentSession);
  }
}

function renderLoginPage() {
  const accountView = document.getElementById('account-view');
  if (!accountView) {
    return;
  }

  accountView.innerHTML = `
    <section class="account-auth-wrap">
      <section class="auth-panel">
        <div class="auth-content">
          <h2>Welcome Back</h2>
          <p class="auth-subtitle">Login to access your library account</p>
          <div id="loginMessage" class="message"></div>
          <form class="account-form" id="loginForm">
            <div class="form-group">
              <label for="loginIdentifier">Student Email / Enrollment Number</label>
              <input type="text" id="loginIdentifier" name="loginIdentifier" placeholder="e.g. student@ldce.ac.in or 21CE001" required />
            </div>
            <div class="form-group">
              <label for="loginPassword">Password</label>
              <input type="password" id="loginPassword" name="password" placeholder="••••••••" required />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Login</button>
              <button type="button" class="form-link" id="forgotPassword">Forgot Password?</button>
            </div>
          </form>
          <p class="subtle-text">
            New student? <button class="form-link" id="showRegister">Create an account</button>
          </p>
        </div>
      </section>

      <aside class="auth-aside">
        <h3>Student Library Services</h3>
        <p>Access your circulation records, reading activity, and account services.</p>
        <ul>
          <li>Book issue and renewals</li>
          <li>Library history</li>
          <li>Academic reading support</li>
        </ul>
        <a class="btn btn-secondary" href="../index.html">Back to Home</a>
      </aside>
    </section>
  `;

  const loginForm = document.getElementById('loginForm');
  const showRegister = document.getElementById('showRegister');
  const forgotPassword = document.getElementById('forgotPassword');

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      loginUser();
    });
  }

  if (showRegister) {
    showRegister.addEventListener('click', function () {
      renderRegisterPage();
    });
  }

  if (forgotPassword) {
    forgotPassword.addEventListener('click', function () {
      showToast('Password recovery is a frontend prototype flow.', 'success');
    });
  }
}

function renderRegisterPage() {
  const accountView = document.getElementById('account-view');
  if (!accountView) {
    return;
  }

  accountView.innerHTML = `
    <section class="account-auth-wrap">
      <section class="auth-panel">
        <div class="auth-content">
          <h2>Create Your Library Account</h2>
          <p class="auth-subtitle">Register to access library services</p>
          <div id="registerMessage" class="message"></div>
          <form class="account-form" id="registerForm">
            <div class="form-row">
              <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" required />
              </div>
              <div class="form-group">
                <label for="enrollmentNumber">Enrollment Number</label>
                <input type="text" id="enrollmentNumber" name="enrollmentNumber" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">College Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div class="form-group">
                <label for="branch">Branch</label>
                <select id="branch" name="branch" required>
                  <option value="">Choose branch</option>
                  <option>Computer Engineering</option>
                  <option>Information Technology</option>
                  <option>Electronics & Communication</option>
                  <option>Electrical Engineering</option>
                  <option>Mechanical Engineering</option>
                  <option>Civil Engineering</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="semester">Semester</label>
                <select id="semester" name="semester" required>
                  <option value="">Choose semester</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                </select>
              </div>
              <div></div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required />
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create Account</button>
            </div>

            <p>
              Already have an account? <button class="form-link" id="loginFromRegister">Login</button>
            </p>
          </form>
        </div>
      </section>

      <aside class="auth-aside">
        <h3>Library Membership</h3>
        <p>Use your LDCE college account to access borrowing, reading, and support services.</p>
        <ul>
          <li>Student account profile</li>
          <li>Reading history</li>
          <li>Book circulation updates</li>
        </ul>
        <a class="btn btn-secondary" href="../index.html">Explore Library</a>
      </aside>
    </section>
  `;

  const registerForm = document.getElementById('registerForm');
  const loginLink = document.getElementById('loginFromRegister');

  if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
      event.preventDefault();
      registerUser();
    });
  }

  if (loginLink) {
    loginLink.addEventListener('click', function () {
      renderLoginPage();
    });
  }
}

function registerUser() {
  const form = document.getElementById('registerForm');
  if (!form) {
    return;
  }

  const formData = new FormData(form);
  const payload = {
    fullName: formData.get('fullName').trim(),
    enrollmentNumber: formData.get('enrollmentNumber').trim(),
    email: formData.get('email').trim(),
    branch: formData.get('branch').trim(),
    semester: formData.get('semester').trim(),
    password: formData.get('password').trim(),
    confirmPassword: formData.get('confirmPassword').trim()
  };

  const message = document.getElementById('registerMessage');

  if (!payload.fullName || !payload.enrollmentNumber || !payload.email || !payload.branch || !payload.semester || !payload.password || !payload.confirmPassword) {
    showFormMessage(message, 'Please fill in all required fields.', 'error');
    return;
  }

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
  if (!emailIsValid) {
    showFormMessage(message, 'Enter a valid college email ID.', 'error');
    return;
  }

  if (payload.password.length < 6) {
    showFormMessage(message, 'Password must be at least 6 characters.', 'error');
    return;
  }

  if (payload.password !== payload.confirmPassword) {
    showFormMessage(message, 'Password and confirm password must match.', 'error');
    return;
  }

  const users = getUserCollection();
  const duplicate = users.some((user) => {
    return user.email.toLowerCase() === payload.email.toLowerCase() || user.enrollmentNumber.toLowerCase() === payload.enrollmentNumber.toLowerCase();
  });

  if (duplicate) {
    showFormMessage(message, 'This student is already registered. Please login.', 'error');
    return;
  }

  users.push({
    id: cryptoRandomId(),
    fullName: payload.fullName,
    enrollmentNumber: payload.enrollmentNumber,
    email: payload.email,
    branch: payload.branch,
    semester: payload.semester,
    password: payload.password
  });

  setUserCollection(users);
  showFormMessage(message, 'Account created successfully!', 'success');

  showToast('Account created successfully!', 'success');

  setTimeout(() => {
    renderLoginPage();
    const loginMessage = document.getElementById('loginMessage');
    if (loginMessage) {
      showFormMessage(loginMessage, 'Account created successfully!', 'success');
    }
  }, 300);
}

function cryptoRandomId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return 'user-' + Date.now() + '-' + Math.round(Math.random() * 10000);
}

function loginUser() {
  const accountView = document.getElementById('account-view');
  const identifier = document.getElementById('loginIdentifier')?.value.trim();
  const password = document.getElementById('loginPassword')?.value.trim();
  const message = document.getElementById('loginMessage');

  if (!identifier || !password) {
    showFormMessage(message, 'Please enter your student email/enrollment and password.', 'error');
    return;
  }

  const users = getUserCollection();
  const matchedUser = users.find((user) => {
    return (
      (user.email && user.email.toLowerCase() === identifier.toLowerCase()) ||
      (user.enrollmentNumber && user.enrollmentNumber.toLowerCase() === identifier.toLowerCase())
    ) && user.password === password;
  });

  if (!matchedUser) {
    showFormMessage(message, 'Invalid credentials. Please register or try again.', 'error');
    return;
  }

  setCurrentSessionUser(matchedUser);
  normalizeAccountData();

  showToast('Login successful.', 'success');

  if (accountView) {
    renderDashboardPage(matchedUser);
  }
}

function logoutUser() {
  clearCurrentSessionUser();
  const accountView = document.getElementById('account-view');
  if (accountView) {
    renderLoginPage();
  }

  showToast('You have been logged out.', 'success');
}

function renderDashboardPage(user) {
  const accountView = document.getElementById('account-view');
  if (!accountView) {
    return;
  }

  const borrowedBooks = loadBorrowedBooks();
  const dueSoon = getDueSoonBooks(borrowedBooks);

  accountView.innerHTML = `
    <section class="dashboard-panel">
      <div class="profile-panel">
        <div class="profile-layout">
          <div class="profile-card">
            <div class="profile-avatar">${escapeHtml((user.fullName || 'LD').charAt(0))}</div>
            <div class="profile-name">${escapeHtml(user.fullName)}</div>
            <div class="profile-branch">${escapeHtml(user.branch || 'Branch')}</div>
          </div>
          <div>
            <div class="section-header">
              <div>
                <p class="eyebrow">👤 Student Profile</p>
                <h2>Student Profile</h2>
              </div>
              <button class="btn btn-secondary btn-small" id="editProfileButton">Edit Profile</button>
            </div>
            <div class="profile-details">
              <div class="form-row">
                <div class="form-group">
                  <label>Student Name</label>
                  <div class="profile-readout">${escapeHtml(user.fullName)}</div>
                </div>
                <div class="form-group">
                  <label>Enrollment Number</label>
                  <div class="profile-readout">${escapeHtml(user.enrollmentNumber)}</div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Email</label>
                  <div class="profile-readout">${escapeHtml(user.email)}</div>
                </div>
                <div class="form-group">
                  <label>Branch</label>
                  <div class="profile-readout">${escapeHtml(user.branch)}</div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Semester</label>
                  <div class="profile-readout">${escapeHtml(user.semester)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="dashboard-section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Library Summary</p>
            <h2>Library Summary</h2>
          </div>
        </div>
        <div class="dashboard-grid">
          <article class="summary-card">
            <span class="card-label">Currently Borrowed</span>
            <div class="metric">📚 ${borrowedBooks.length}</div>
          </article>
          <article class="summary-card">
            <span class="card-label">Returned Books</span>
            <div class="metric">✅ 8</div>
          </article>
          <article class="summary-card">
            <span class="card-label">Overdue Books</span>
            <div class="metric">⚠️ ${getOverdueBooks(borrowedBooks).length}</div>
          </article>
          <article class="summary-card">
            <span class="card-label">Total Books Read</span>
            <div class="metric">📖 10</div>
          </article>
        </div>
      </section>

      <section class="dashboard-section">
        <div class="section-header">
          <div>
            <p class="eyebrow">My Borrowed Books</p>
            <h2>My Borrowed Books</h2>
          </div>
          <button class="btn btn-secondary btn-small" id="refreshBorrowed">Refresh</button>
        </div>
        <div class="table-wrap">
          <table class="account-table">
            <thead>
              <tr>
                <th>Book Name</th>
                <th>Author</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${loadBorrowedBooksRows(borrowedBooks)}
            </tbody>
          </table>
        </div>
      </section>

      <section class="dashboard-section">
        <div class="due-soon-card">
          <h3>Due Soon 🔔</h3>
          ${renderDueSoon(dueSoon)}
        </div>
      </section>

      <section class="dashboard-section">
        <div class="section-header">
          <div>
            <p class="eyebrow">Library History</p>
            <h2>Library History</h2>
          </div>
        </div>
        <ul class="library-history-list">
          ${loadLibraryHistory().map((item) => `
            <li>${escapeHtml(item.title)} — ${escapeHtml(item.type)} — ${escapeHtml(item.date)}</li>
          `).join('')}
        </ul>
      </section>

      <section class="dashboard-section settings-panel">
        <div class="section-header">
          <div>
            <p class="eyebrow">Account Settings</p>
            <h2>Account Settings</h2>
          </div>
        </div>
        <div class="settings-list">
          <div class="setting-item">
            <span>👤 Edit Profile</span>
            <button class="btn btn-secondary btn-small" id="editProfileFromSettings">Edit Profile</button>
          </div>
          <div class="setting-item">
            <span>🔒 Change Password</span>
            <button class="btn btn-secondary btn-small" id="changePasswordButton">Change Password</button>
          </div>
          <div class="setting-item">
            <span>🔔 Notification Preferences</span>
            <label class="toggle-row">
              <span class="switch">
                <input type="checkbox" checked id="notifDue" />
                <span class="slider"></span>
              </span>
              <span>Due date reminders</span>
            </label>
            <label class="toggle-row">
              <span class="switch">
                <input type="checkbox" checked id="notifNew" />
                <span class="slider"></span>
              </span>
              <span>New book notifications</span>
            </label>
          </div>
          <div class="setting-item">
            <span>🚪 Logout</span>
            <button class="btn btn-primary btn-small" id="logoutButton">Logout</button>
          </div>
        </div>
      </section>
    </section>
  `;

  const editButton = document.getElementById('editProfileButton');
  const editSettings = document.getElementById('editProfileFromSettings');
  const logoutButton = document.getElementById('logoutButton');
  const quickLogoutButton = document.getElementById('quickLogoutButton');
  const changePasswordButton = document.getElementById('changePasswordButton');

  if (editButton || editSettings) {
    const target = editButton || editSettings;
    target.addEventListener('click', () => {
      openProfileModal(user);
    });
  }

  if (logoutButton || quickLogoutButton) {
    const each = [logoutButton, quickLogoutButton].filter(Boolean);
    each.forEach((element) => {
      element.addEventListener('click', () => {
        logoutUser();
      });
    });
  }

  if (changePasswordButton) {
    changePasswordButton.addEventListener('click', () => {
      openChangePasswordModal();
    });
  }

  const settingsRefresh = document.getElementById('refreshBorrowed');
  if (settingsRefresh) {
    settingsRefresh.addEventListener('click', () => {
      const newBooks = loadBorrowedBooks();
      showToast('Library records refreshed.', 'success');
      renderDashboardPage(user);
    });
  }

  document.querySelectorAll('[data-account-nav]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const nav = event.target.closest('[data-account-nav]')?.dataset?.accountNav;
      if (nav && nav === 'borrowed') {
        document.querySelector('#account-view').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function openProfileModal(user) {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop is-open';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Edit Profile</h3>
        <button class="modal-close" aria-label="Close">×</button>
      </div>
      <div id="profileModalMessage" class="message"></div>
      <form id="profileEditForm" class="account-form">
        <div class="form-group">
          <label for="editFullName">Student Name</label>
          <input type="text" id="editFullName" name="fullName" value="${escapeHtml(user.fullName)}" required />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="editEnrollment">Enrollment Number</label>
            <input type="text" id="editEnrollment" name="enrollmentNumber" value="${escapeHtml(user.enrollmentNumber)}" required />
          </div>
          <div class="form-group">
            <label for="editEmail">College Email</label>
            <input type="email" id="editEmail" name="email" value="${escapeHtml(user.email)}" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="editBranch">Branch</label>
            <select id="editBranch" name="branch" required>
              ${branchOptions(user.branch)}
            </select>
          </div>
          <div class="form-group">
            <label for="editSemester">Semester</label>
            <select id="editSemester" name="semester" required>
              ${semesterOptions(user.semester)}
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Save Changes</button>
          <button type="button" class="btn btn-secondary" id="cancelProfileEdit">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#cancelProfileEdit')?.addEventListener('click', closeModal);
  modal.querySelector('.modal-close')?.addEventListener('click', closeModal);

  modal.querySelector('#profileEditForm').addEventListener('submit', (event) => {
    event.preventDefault();
    updateProfile(event.currentTarget, user);
  });
}

function closeModal() {
  const modal = document.querySelector('.modal-backdrop.is-open');
  if (modal) {
    modal.remove();
  }
}

function updateProfile(form, existingUser) {
  const formData = new FormData(form);
  const nextUser = {
    ...existingUser,
    fullName: formData.get('fullName').trim(),
    enrollmentNumber: formData.get('enrollmentNumber').trim(),
    email: formData.get('email').trim(),
    branch: formData.get('branch').trim(),
    semester: formData.get('semester').trim()
  };

  const message = document.getElementById('profileModalMessage');

  if (!nextUser.fullName || !nextUser.enrollmentNumber || !nextUser.email || !nextUser.branch || !nextUser.semester) {
    showFormMessage(message, 'Please fill all profile fields.', 'error');
    return;
  }

  const users = getUserCollection();
  const duplicate = users.some((item) => {
    if (item.id === existingUser.id) {
      return false;
    }

    return item.email.toLowerCase() === nextUser.email.toLowerCase() || item.enrollmentNumber.toLowerCase() === nextUser.enrollmentNumber.toLowerCase();
  });

  if (duplicate) {
    showFormMessage(message, 'A different account already exists with that email or enrollment number.', 'error');
    return;
  }

  const index = users.findIndex((item) => item.id === existingUser.id);
  if (index >= 0) {
    users[index] = nextUser;
    setUserCollection(users);
    setCurrentSessionUser(nextUser);

    closeModal();
    renderDashboardPage(nextUser);
    showToast('Profile updated successfully.', 'success');
  }
}

function openChangePasswordModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop is-open';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Change Password</h3>
        <button class="modal-close" aria-label="Close">×</button>
      </div>
      <div id="passwordMessage" class="message"></div>
      <form id="passwordForm" class="account-form">
        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input type="password" id="currentPassword" name="currentPassword" required />
        </div>
        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input type="password" id="newPassword" name="newPassword" required />
        </div>
        <div class="form-group">
          <label for="confirmNewPassword">Confirm New Password</label>
          <input type="password" id="confirmNewPassword" name="confirmNewPassword" required />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Update Password</button>
          <button type="button" class="btn btn-secondary" id="cancelPassword">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#cancelPassword')?.addEventListener('click', closeModal);
  modal.querySelector('.modal-close')?.addEventListener('click', closeModal);

  modal.querySelector('#passwordForm').addEventListener('submit', (event) => {
    event.preventDefault();
    changePassword(event.currentTarget);
  });
}

function changePassword(form) {
  const formData = new FormData(form);
  const currentPassword = formData.get('currentPassword').trim();
  const newPassword = formData.get('newPassword').trim();
  const confirmNewPassword = formData.get('confirmNewPassword').trim();
  const sessionUser = getCurrentSessionUser();
  const message = document.getElementById('passwordMessage');

  if (!sessionUser) {
    return;
  }

  if (currentPassword !== sessionUser.password) {
    showFormMessage(message, 'Current password is incorrect.', 'error');
    return;
  }

  if (newPassword.length < 6) {
    showFormMessage(message, 'New password must be at least 6 characters.', 'error');
    return;
  }

  if (newPassword !== confirmNewPassword) {
    showFormMessage(message, 'New passwords do not match.', 'error');
    return;
  }

  const users = getUserCollection();
  const index = users.findIndex((item) => item.id === sessionUser.id);

  if (index >= 0) {
    users[index].password = newPassword;
    setUserCollection(users);

    const newSession = users[index];
    setCurrentSessionUser(newSession);

    closeModal();
    showToast('Password changed successfully.', 'success');
    renderDashboardPage(newSession);
  }
}

function loadAccountData() {
  normalizeAccountData();
  return {
    borrower: loadBorrowedBooks(),
    history: loadLibraryHistory()
  };
}

function loadBorrowedBooks() {
  normalizeAccountData();

  const raw = localStorage.getItem(LDCE_LIBRARY_KEYS.borrowed);
  if (!raw) {
    return LDCE_ACCOUNT_SAMPLE.borrowedBooks;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return LDCE_ACCOUNT_SAMPLE.borrowedBooks;
  }
}

function loadBorrowedBooksRows(books) {
  if (!books || books.length === 0) {
    return `<tr><td colspan="6"><div class="empty-state">No borrowed books available.</div></td></tr>`;
  }

  return books.map((book) => {
    const statusClass = book.status === 'Overdue' ? 'status-overdue' : 'status-active';
    const statusIcon = book.status === 'Overdue' ? '🔴' : '🟢';
    const canRenew = book.status === 'Active';

    return `<tr>
      <td>${escapeHtml(book.name)}</td>
      <td>${escapeHtml(book.author)}</td>
      <td>${escapeHtml(book.issueDate)}</td>
      <td>${escapeHtml(book.dueDate)}</td>
      <td><span class="status-badge ${statusClass}">${statusIcon} ${escapeHtml(book.status)}</span></td>
      <td>
        ${canRenew ? `<button class="btn btn-secondary btn-small renew-book" data-book-id="${escapeHtml(book.id)}">Renew</button>` : `<span class="status-badge status-overdue">Payment Required</span>`}
      </td>
    </tr>`;
  }).join('');
}

function loadLibraryHistory() {
  normalizeAccountData();

  const raw = localStorage.getItem(LDCE_LIBRARY_KEYS.history);
  if (!raw) {
    return LDCE_ACCOUNT_SAMPLE.history;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return LDCE_ACCOUNT_SAMPLE.history;
  }
}

function renewBook(bookId) {
  const books = loadBorrowedBooks();
  const selected = books.find((book) => book.id === bookId);

  if (!selected) {
    showToast('Book not found.', 'error');
    return;
  }

  const originalDueDate = selected.dueDate;

  const due = new Date('2026-08-15T00:00:00');
  due.setDate(due.getDate() + 14);

  selected.dueDate = formatRenewDate(due);
  selected.status = 'Active';

  localStorage.setItem(LDCE_LIBRARY_KEYS.borrowed, JSON.stringify(books));

  const history = loadLibraryHistory();
  history.unshift({ type: 'Renewed', title: selected.name, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) });
  localStorage.setItem(LDCE_LIBRARY_KEYS.history, JSON.stringify(history));

  const currentUser = getCurrentSessionUser();
  if (currentUser) {
    renderDashboardPage(currentUser);
  }

  showToast(`Renewed ${selected.name}. Due date ${originalDueDate} → ${selected.dueDate}.`, 'success');
}

function formatRenewDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function getDueSoonBooks(books) {
  return books.filter((book) => book.status === 'Active' && daysRemaining(book.dueDate) <= 7);
}

function getOverdueBooks(books) {
  return books.filter((book) => book.status === 'Overdue');
}

function daysRemaining(dueDate) {
  const due = parseBookDueDate(dueDate);
  if (!due) {
    return 99;
  }

  const now = new Date('2026-08-08T00:00:00');
  const diff = due - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

function parseBookDueDate(value) {
  const parts = value.split(' ');
  if (parts.length !== 3) {
    return null;
  }

  const day = Number(parts[0]);
  const month = monthLookup(parts[1]);
  const year = Number(parts[2]);

  if (!month || Number.isNaN(day) || Number.isNaN(year)) {
    return null;
  }

  return new Date(year, month, day);
}

function monthLookup(shortMonth) {
  const map = {
    'Jan': 0,
    'Feb': 1,
    'Mar': 2,
    'Apr': 3,
    'May': 4,
    'Jun': 5,
    'Jul': 6,
    'Aug': 7,
    'Sep': 8,
    'Oct': 9,
    'Nov': 10,
    'Dec': 11
  };

  return map[shortMonth];
}

function renderDueSoon(dueSoonBooks) {
  if (!dueSoonBooks || dueSoonBooks.length === 0) {
    return `<p class="no-data">No books due soon.</p>`;
  }

  return `<ul class="due-soon-list">
    ${dueSoonBooks.map((book) => {
      const remaining = Math.max(1, daysRemaining(book.dueDate) - 2);
      return `<li><strong>${escapeHtml(book.name)}</strong><br />Due: ${escapeHtml(book.dueDate)}<br /><span>${remaining} days remaining</span></li>`;
    }).join('')}
  </ul>`;
}

function branchOptions(selected) {
  const branches = ['Computer Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'];
  return branches.map((branch) => `<option value="${branch}" ${branch === selected ? 'selected' : ''}>${branch}</option>`).join('');
}

function semesterOptions(selected) {
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
  return semesters.map((semester) => `<option value="${semester}" ${semester === selected ? 'selected' : ''}>${semester}</option>`).join('');
}

function showFormMessage(element, message, type) {
  if (!element) {
    return;
  }

  element.className = `message is-visible ${type}`;
  element.textContent = message;
}

function initAccountFlow() {
  normalizeAccountData();
  renderAccountPage();

  const accountView = document.getElementById('account-view');
  if (accountView) {
    accountView.addEventListener('click', (event) => {
      if (event.target.classList.contains('renew-book')) {
        const bookId = event.target.dataset.bookId;
        renewBook(bookId);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initAccountFlow);
