/**
 * TASKORA - Modern Productivity SaaS Application
 * Codveda Web Development Internship - Level 1: Task 3 (Introduction to JavaScript)
 *
 * Architecture & Features:
 * - Dynamic Greeting & Motivational System
 * - Live Progress Tracking System with Smooth CSS Transitions
 * - Number Ticker Animation for Real-Time Statistics
 * - Natural Relative Date Engine (Today, Tomorrow, Overdue, Formatted Dates)
 * - Custom Animated Checkboxes & Realistic Task State Transitions
 * - Search with Real-Time Query Highlighting
 * - Multi-dimensional Filtering (Status tabs, Priority select, Sidebar categories)
 * - 3-Dot Action Dropdown Menus with Click-Outside Handling
 * - Interactive Modal System (Create, Edit, Delete Confirmation, Settings)
 * - Toast Notification System (3s auto-dismiss with smooth slide-up)
 * - Keyboard Shortcuts (Escape, Enter, 'N' for new task, '/' for search)
 * - Initial Loading Experience & LocalStorage Persistence
 */

// ==========================================
// 1. Initial State & Realistic SaaS Data Engine
// ==========================================

const LOCAL_STORAGE_KEY = "taskora_saas_tasks_v2";

/**
 * Helper to compute an ISO date string (YYYY-MM-DD) offset from today.
 */
function getOffsetDateString(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const INITIAL_SAMPLE_TASKS = [
  {
    id: 1,
    title: "Finish JavaScript Task 3",
    category: "Study",
    priority: "High",
    dueDate: getOffsetDateString(0), // Due Today
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Review AI Resume Analyzer",
    category: "Work",
    priority: "Medium",
    dueDate: getOffsetDateString(1), // Due Tomorrow
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Learn Event Listeners",
    category: "Study",
    priority: "High",
    dueDate: getOffsetDateString(4), // Aug 28
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: "Update GitHub README",
    category: "Work",
    priority: "Low",
    dueDate: getOffsetDateString(6), // Aug 30
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: "Plan Weekend",
    category: "Personal",
    priority: "Low",
    dueDate: getOffsetDateString(9), // Sep 02
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    title: "Submit Portfolio Assignment",
    category: "Work",
    priority: "High",
    dueDate: getOffsetDateString(-1),
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    title: "Refactor CSS Design Tokens",
    category: "Work",
    priority: "Medium",
    dueDate: getOffsetDateString(0), // Due Today
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    title: "Practice DOM Manipulation & Flexbox",
    category: "Study",
    priority: "High",
    dueDate: getOffsetDateString(-2),
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 9,
    title: "Schedule Weekly Dental Checkup",
    category: "Personal",
    priority: "Low",
    dueDate: getOffsetDateString(12),
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    title: "Sync with Mentor on Task 3 Review",
    category: "Study",
    priority: "Medium",
    dueDate: getOffsetDateString(3),
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 11,
    title: "Submit Internship Milestone Feedback",
    category: "Work",
    priority: "High",
    dueDate: getOffsetDateString(-3), // Overdue
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 12,
    title: "Read Clean Code Chapters 4-6",
    category: "Study",
    priority: "Low",
    dueDate: getOffsetDateString(15),
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// App State
let tasks = [];
let activeNavigation = "dashboard"; // "dashboard" | "all" | "important" | "completed" | "category-study" | "category-work" | "category-personal"
let activeStatusFilter = "all"; // "all" | "active" | "completed"
let activePriorityFilter = "all"; // "all" | "High" | "Medium" | "Low"
let searchQuery = "";
let currentEditingTaskId = null;
let taskToDeleteId = null;
let openDropdownTaskId = null;

// Animated number counter cache
const prevStatCounts = {
  total: 0,
  active: 0,
  completed: 0
};

// ==========================================
// 2. DOM Elements Cache
// ==========================================

const DOM = {
  // Loader & Layout
  appLoader: document.getElementById("appLoader"),
  sidebar: document.getElementById("sidebar"),
  sidebarBackdrop: document.getElementById("sidebarBackdrop"),
  menuToggleBtn: document.getElementById("menuToggleBtn"),
  navLinks: document.querySelectorAll(".nav-link"),
  settingsBtn: document.getElementById("settingsBtn"),

  // Search
  searchInput: document.getElementById("searchInput"),
  searchClearBtn: document.getElementById("searchClearBtn"),
  searchKbdHint: document.getElementById("searchKbdHint"),
  searchActivePill: document.getElementById("searchActivePill"),

  // Header & Greetings
  greetingTitle: document.getElementById("greetingTitle"),
  greetingSubtitle: document.getElementById("greetingSubtitle"),
  motivationalBadge: document.getElementById("motivationalBadge"),
  motivationalIcon: document.getElementById("motivationalIcon"),
  motivationalText: document.getElementById("motivationalText"),
  currentDateDisplay: document.getElementById("currentDateDisplay"),

  // Live Progress System
  progressSectionCard: document.getElementById("progressSectionCard"),
  progressStatusText: document.getElementById("progressStatusText"),
  progressRatio: document.getElementById("progressRatio"),
  progressBarFill: document.getElementById("progressBarFill"),

  // Stats Counters
  statTotal: document.getElementById("statTotal"),
  statActive: document.getElementById("statActive"),
  statCompleted: document.getElementById("statCompleted"),

  // Sidebar Counts
  countAll: document.getElementById("countAll"),
  countImportant: document.getElementById("countImportant"),
  countCompleted: document.getElementById("countCompleted"),
  countStudy: document.getElementById("countStudy"),
  countWork: document.getElementById("countWork"),
  countPersonal: document.getElementById("countPersonal"),

  // Main Section Controls
  sectionHeading: document.getElementById("sectionHeading"),
  sectionCountBadge: document.getElementById("sectionCountBadge"),
  filterPillBtns: document.querySelectorAll(".filter-pill-btn"),
  priorityFilterSelect: document.getElementById("priorityFilterSelect"),
  taskList: document.getElementById("taskList"),
  emptyState: document.getElementById("emptyState"),
  emptyIcon: document.getElementById("emptyIcon"),
  emptyTitle: document.getElementById("emptyTitle"),
  emptySubtitle: document.getElementById("emptySubtitle"),
  createFirstTaskBtn: document.getElementById("createFirstTaskBtn"),

  // Add / Edit Task Trigger Buttons
  quickAddBtn: document.getElementById("quickAddBtn"),
  newBtnHeader: document.getElementById("newBtnHeader"),

  // Modal 1: Create & Edit Task
  taskModal: document.getElementById("taskModal"),
  taskModalTitle: document.getElementById("taskModalTitle"),
  taskModalCloseBtn: document.getElementById("taskModalCloseBtn"),
  taskModalCancelBtn: document.getElementById("taskModalCancelBtn"),
  taskSubmitBtn: document.getElementById("taskSubmitBtn"),
  taskForm: document.getElementById("taskForm"),
  taskNameInput: document.getElementById("taskNameInput"),
  taskCategorySelect: document.getElementById("taskCategorySelect"),
  taskPrioritySelect: document.getElementById("taskPrioritySelect"),
  taskDueDateInput: document.getElementById("taskDueDateInput"),
  taskNameError: document.getElementById("taskNameError"),
  taskCategoryError: document.getElementById("taskCategoryError"),
  taskPriorityError: document.getElementById("taskPriorityError"),
  taskDueDateError: document.getElementById("taskDueDateError"),

  // Modal 2: Delete Confirmation
  deleteModal: document.getElementById("deleteModal"),
  deleteModalCloseBtn: document.getElementById("deleteModalCloseBtn"),
  deleteModalCancelBtn: document.getElementById("deleteModalCancelBtn"),
  deleteModalConfirmBtn: document.getElementById("deleteModalConfirmBtn"),

  // Modal 3: Settings
  settingsModal: document.getElementById("settingsModal"),
  settingsModalCloseBtn: document.getElementById("settingsModalCloseBtn"),
  settingsModalDoneBtn: document.getElementById("settingsModalDoneBtn"),
  resetSampleDataBtn: document.getElementById("resetSampleDataBtn"),
  clearCompletedBtn: document.getElementById("clearCompletedBtn"),

  // Toast Container
  toastContainer: document.getElementById("toastContainer")
};

// ==========================================
// 3. Storage & State Management
// ==========================================

function loadTasksFromStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      tasks = JSON.parse(raw);
    } else {
      tasks = [...INITIAL_SAMPLE_TASKS];
      saveTasksToStorage();
    }
  } catch (err) {
    console.error("Error reading localStorage, using initial sample data", err);
    tasks = [...INITIAL_SAMPLE_TASKS];
  }
}

function saveTasksToStorage() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error("Error saving to localStorage", err);
  }
}

// ==========================================
// 4. Natural Date Engine & Formatting
// ==========================================

/**
 * Parses "YYYY-MM-DD" into a local Date object reset to midnight.
 */
function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  const parts = dateStr.split("-");
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

/**
 * Returns natural date representation:
 * - "Today"
 * - "Tomorrow"
 * - "Yesterday (Overdue)" / "X days overdue"
 * - "Aug 28", "Sep 02"
 */
function getNaturalDateInfo(dueDateStr, isCompleted) {
  if (!dueDateStr) {
    return { text: "No date", isOverdue: false, isToday: false };
  }

  const targetDate = parseLocalDate(dueDateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Difference in whole calendar days
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const isToday = diffDays === 0;
  const isOverdue = diffDays < 0 && !isCompleted;

  if (isToday) {
    return { text: "Today", isOverdue: false, isToday: true };
  }

  if (diffDays === 1) {
    return { text: "Tomorrow", isOverdue: false, isToday: false };
  }

  if (diffDays === -1 && !isCompleted) {
    return { text: "1 day overdue", isOverdue: true, isToday: false };
  }

  if (diffDays < -1 && !isCompleted) {
    return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true, isToday: false };
  }

  // Format month and day: e.g. "Aug 28"
  const formatted = targetDate.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  return { text: formatted, isOverdue: false, isToday: false };
}

// ==========================================
// 5. Dynamic Dashboard, Greetings & Live Progress
// ==========================================

function updateGreetingAndDashboardHeader() {
  const now = new Date();
  const hour = now.getHours();
  let greeting = "Good Evening";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  if (DOM.greetingTitle) {
    DOM.greetingTitle.textContent = `${greeting}, Deepak 👋`;
  }

  // Dynamic Date Formatting: e.g. "Monday, August 24"
  const dateOptions = { weekday: "long", month: "long", day: "numeric" };
  const formattedDate = now.toLocaleDateString("en-US", dateOptions);
  if (DOM.currentDateDisplay) {
    DOM.currentDateDisplay.textContent = formattedDate;
  }
}

/**
 * Animated number ticker for statistic cards
 */
function animateValue(element, start, end, duration = 300, padZero = false) {
  if (!element) return;
  if (start === end) {
    element.textContent = padZero && end < 10 && end >= 0 ? `0${end}` : String(end);
    return;
  }

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * ease);

    element.textContent = padZero && current < 10 && current >= 0 ? `0${current}` : String(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Updates Live Progress Bar, Motivational Message, and Counts.
 */
function updateDashboardMetrics() {
  const totalCount = tasks.length;
  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  const studyCount = tasks.filter(t => t.category === "Study" && !t.completed).length;
  const workCount = tasks.filter(t => t.category === "Work" && !t.completed).length;
  const personalCount = tasks.filter(t => t.category === "Personal" && !t.completed).length;
  const importantCount = tasks.filter(t => t.priority === "High" && !t.completed).length;

  // 1. Animate Statistics Cards
  animateValue(DOM.statTotal, prevStatCounts.total, totalCount, 300, false);
  animateValue(DOM.statActive, prevStatCounts.active, activeCount, 300, true);
  animateValue(DOM.statCompleted, prevStatCounts.completed, completedCount, 300, true);

  prevStatCounts.total = totalCount;
  prevStatCounts.active = activeCount;
  prevStatCounts.completed = completedCount;

  // 2. Sidebar Navigation Badges
  if (DOM.countAll) DOM.countAll.textContent = totalCount;
  if (DOM.countImportant) DOM.countImportant.textContent = importantCount;
  if (DOM.countCompleted) DOM.countCompleted.textContent = completedCount;
  if (DOM.countStudy) DOM.countStudy.textContent = studyCount;
  if (DOM.countWork) DOM.countWork.textContent = workCount;
  if (DOM.countPersonal) DOM.countPersonal.textContent = personalCount;

  // 3. Live Progress Tracker System
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  if (DOM.progressBarFill) {
    DOM.progressBarFill.style.width = `${percentage}%`;
  }
  if (DOM.progressStatusText) {
    DOM.progressStatusText.textContent = `${percentage}% Complete`;
  }
  if (DOM.progressRatio) {
    DOM.progressRatio.textContent = `${completedCount} of ${totalCount} completed`;
  }

  // 4. Dynamic Productivity Subtitle & Motivational Message
  if (DOM.greetingSubtitle) {
    if (activeCount === 0 && totalCount > 0) {
      DOM.greetingSubtitle.textContent = "You're all caught up! All tasks completed today.";
    } else if (activeCount === 1) {
      DOM.greetingSubtitle.textContent = "You have 1 task remaining today.";
    } else {
      DOM.greetingSubtitle.textContent = `You have ${activeCount} tasks remaining today.`;
    }
  }

  if (DOM.motivationalText && DOM.motivationalIcon) {
    if (totalCount > 0 && activeCount === 0) {
      DOM.motivationalIcon.textContent = "🎉";
      DOM.motivationalText.textContent = "Amazing! You've completed everything for today.";
    } else if (totalCount > 0 && percentage >= 50) {
      DOM.motivationalIcon.textContent = "🚀";
      DOM.motivationalText.textContent = "Great progress. Keep the momentum going!";
    } else {
      DOM.motivationalIcon.textContent = "✨";
      DOM.motivationalText.textContent = "Let's make some progress today.";
    }
  }
}

// ==========================================
// 6. Task Filtering & Dynamic Rendering
// ==========================================

function getFilteredTasks() {
  return tasks.filter(task => {
    // 1. Navigation Filter
    if (activeNavigation === "important" && task.priority !== "High") return false;
    if (activeNavigation === "completed" && !task.completed) return false;
    if (activeNavigation === "category-study" && task.category !== "Study") return false;
    if (activeNavigation === "category-work" && task.category !== "Work") return false;
    if (activeNavigation === "category-personal" && task.category !== "Personal") return false;

    // 2. Status Tab Filter (All / Active / Completed)
    if (activeStatusFilter === "active" && task.completed) return false;
    if (activeStatusFilter === "completed" && !task.completed) return false;

    // 3. Priority Dropdown Filter
    if (activePriorityFilter !== "all" && task.priority !== activePriorityFilter) return false;

    // 4. Search Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchCategory = task.category.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory) return false;
    }

    return true;
  });
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Wraps matching query inside search highlight mark tags.
 */
function highlightMatch(text, query) {
  const safeText = escapeHTML(text);
  if (!query || query.trim() === "") return safeText;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  return safeText.replace(regex, `<mark class="search-highlight">$1</mark>`);
}

function renderTaskList() {
  const filtered = getFilteredTasks();

  // Close any open action dropdown
  closeAllDropdowns();

  // Update Section Title & Count
  updateSectionHeader(filtered.length);

  if (filtered.length === 0) {
    DOM.taskList.innerHTML = "";
    DOM.emptyState.style.display = "flex";

    // Dynamic Empty States
    if (searchQuery.trim() !== "") {
      DOM.emptyIcon.textContent = "🔍";
      DOM.emptyTitle.textContent = "No tasks found";
      DOM.emptySubtitle.textContent = `No results matching "${escapeHTML(searchQuery)}". Try a different search.`;
      DOM.createFirstTaskBtn.style.display = "none";
    } else if (activeNavigation === "completed" || activeStatusFilter === "completed") {
      DOM.emptyIcon.textContent = "✓";
      DOM.emptyTitle.textContent = "No completed tasks yet";
      DOM.emptySubtitle.textContent = "Complete your first task to see it reflected here.";
      DOM.createFirstTaskBtn.style.display = "none";
    } else if (activeNavigation === "important") {
      DOM.emptyIcon.textContent = "⭐";
      DOM.emptyTitle.textContent = "No important tasks";
      DOM.emptySubtitle.textContent = "Mark tasks as High Priority to focus on high-impact work.";
      DOM.createFirstTaskBtn.style.display = "inline-flex";
    } else {
      DOM.emptyIcon.textContent = "📋";
      DOM.emptyTitle.textContent = "No tasks yet";
      DOM.emptySubtitle.textContent = "Create your first task and start organizing your day.";
      DOM.createFirstTaskBtn.style.display = "inline-flex";
    }
    return;
  }

  DOM.emptyState.style.display = "none";

  // Render Tasks Grid Rows
  const htmlRows = filtered.map(task => {
    const dateInfo = getNaturalDateInfo(task.dueDate, task.completed);
    const categoryClass = task.category.toLowerCase();
    const priorityClass = task.priority.toLowerCase();
    const highlightedTitle = highlightMatch(task.title, searchQuery);

    return `
      <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
        
        <!-- Checkbox -->
        <div class="col-check">
          <label class="custom-checkbox" title="${task.completed ? 'Mark as active' : 'Mark as completed'}">
            <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''} />
            <div class="checkbox-visual">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </label>
        </div>

        <!-- Title -->
        <div class="col-title">
          <span class="task-title">${highlightedTitle}</span>
        </div>

        <!-- Category -->
        <div class="col-category">
          <span class="badge-category badge-cat-${categoryClass}">
            <span class="cat-dot"></span>
            ${task.category}
          </span>
        </div>

        <!-- Priority (Subtle & Professional) -->
        <div class="col-priority">
          <span class="priority-marker priority-${priorityClass}">
            <span class="priority-dot"></span>
            ${task.priority}
          </span>
        </div>

        <!-- Due Date -->
        <div class="col-date">
          <span class="due-date-indicator ${dateInfo.isOverdue ? 'overdue' : ''} ${dateInfo.isToday ? 'today' : ''}" title="Due date: ${task.dueDate}">
            ${dateInfo.text}
          </span>
        </div>

        <!-- Three-dot Actions Menu -->
        <div class="col-actions">
          <div class="menu-action-wrapper">
            <button class="btn-icon-menu task-menu-btn" data-id="${task.id}" aria-label="Task options" title="More options">
              •••
            </button>
            <div class="action-dropdown" id="dropdown-${task.id}">
              <button class="action-menu-item edit-task-btn" data-id="${task.id}">
                <span>✏️</span>
                <span>Edit Task</span>
              </button>
              <button class="action-menu-item delete-item delete-task-btn" data-id="${task.id}">
                <span>🗑️</span>
                <span>Delete Task</span>
              </button>
            </div>
          </div>
        </div>

      </li>
    `;
  }).join("");

  DOM.taskList.innerHTML = htmlRows;
}

function updateSectionHeader(count) {
  let title = "My Tasks";

  switch (activeNavigation) {
    case "dashboard":
    case "all":
      title = "All Tasks";
      break;
    case "important":
      title = "Important Tasks";
      break;
    case "completed":
      title = "Completed Tasks";
      break;
    case "category-study":
      title = "Study Workspace";
      break;
    case "category-work":
      title = "Work Workspace";
      break;
    case "category-personal":
      title = "Personal Workspace";
      break;
  }

  if (DOM.sectionHeading) DOM.sectionHeading.textContent = title;
  if (DOM.sectionCountBadge) DOM.sectionCountBadge.textContent = `${count} task${count === 1 ? '' : 's'}`;

  if (DOM.searchActivePill) {
    if (searchQuery.trim() !== "") {
      DOM.searchActivePill.textContent = `Search: "${searchQuery}"`;
      DOM.searchActivePill.style.display = "inline-flex";
    } else {
      DOM.searchActivePill.style.display = "none";
    }
  }
}

// ==========================================
// 7. Toast Notification System
// ==========================================

function showToast(message, type = "success") {
  if (!DOM.toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let icon = "✓";
  if (type === "danger") icon = "🗑";
  if (type === "info") icon = "ℹ";

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeHTML(message)}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  // Auto dismiss after 3 seconds with smooth slide fade
  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, 3000);
}

// ==========================================
// 8. Action Dropdown Menu Logic
// ==========================================

function closeAllDropdowns() {
  document.querySelectorAll(".action-dropdown.show").forEach(dropdown => {
    dropdown.classList.remove("show");
  });
  openDropdownTaskId = null;
}

function toggleDropdown(taskId) {
  const target = document.getElementById(`dropdown-${taskId}`);
  if (!target) return;

  if (openDropdownTaskId === taskId) {
    closeAllDropdowns();
  } else {
    closeAllDropdowns();
    target.classList.add("show");
    openDropdownTaskId = taskId;
  }
}

// ==========================================
// 9. Modal Management (Create, Edit, Delete, Settings)
// ==========================================

function openCreateTaskModal() {
  closeAllDropdowns();
  currentEditingTaskId = null;
  DOM.taskModalTitle.textContent = "Create New Task";
  DOM.taskSubmitBtn.querySelector("span").textContent = "Create Task";
  DOM.taskForm.reset();
  clearFormErrors();

  // Pre-fill defaults
  DOM.taskPrioritySelect.value = "Medium";
  DOM.taskCategorySelect.value = "Work";

  const todayStr = getOffsetDateString(0);
  DOM.taskDueDateInput.value = todayStr;

  DOM.taskModal.classList.add("active");
  setTimeout(() => {
    DOM.taskNameInput.focus();
  }, 100);
}

function openEditTaskModal(taskId) {
  closeAllDropdowns();
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  currentEditingTaskId = taskId;
  DOM.taskModalTitle.textContent = "Edit Task";
  DOM.taskSubmitBtn.querySelector("span").textContent = "Save Changes";
  clearFormErrors();

  DOM.taskNameInput.value = task.title;
  DOM.taskCategorySelect.value = task.category;
  DOM.taskPrioritySelect.value = task.priority;
  DOM.taskDueDateInput.value = task.dueDate || getOffsetDateString(0);

  DOM.taskModal.classList.add("active");
  setTimeout(() => {
    DOM.taskNameInput.focus();
  }, 100);
}

function closeTaskModal() {
  DOM.taskModal.classList.remove("active");
  clearFormErrors();
  currentEditingTaskId = null;
}

function openDeleteConfirmModal(taskId) {
  closeAllDropdowns();
  taskToDeleteId = taskId;
  DOM.deleteModal.classList.add("active");
}

function closeDeleteConfirmModal() {
  DOM.deleteModal.classList.remove("active");
  taskToDeleteId = null;
}

function openSettingsModal() {
  closeAllDropdowns();
  DOM.settingsModal.classList.add("active");
}

function closeSettingsModal() {
  DOM.settingsModal.classList.remove("active");
}

// ==========================================
// 10. Form Validation & Submission
// ==========================================

function clearFormErrors() {
  [DOM.taskNameInput, DOM.taskCategorySelect, DOM.taskPrioritySelect, DOM.taskDueDateInput].forEach(el => {
    if (el) el.classList.remove("input-error");
  });
  [DOM.taskNameError, DOM.taskCategoryError, DOM.taskPriorityError, DOM.taskDueDateError].forEach(el => {
    if (el) {
      el.textContent = "";
      el.classList.remove("visible");
    }
  });
}

function showFieldError(inputEl, errorEl, message) {
  if (inputEl) inputEl.classList.add("input-error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("visible");
  }
}

function validateTaskForm() {
  clearFormErrors();
  let isValid = true;

  const titleVal = DOM.taskNameInput.value.trim();
  const categoryVal = DOM.taskCategorySelect.value;
  const priorityVal = DOM.taskPrioritySelect.value;
  const dueDateVal = DOM.taskDueDateInput.value;

  if (!titleVal) {
    showFieldError(DOM.taskNameInput, DOM.taskNameError, "Task name is required");
    isValid = false;
  } else if (titleVal.length < 2) {
    showFieldError(DOM.taskNameInput, DOM.taskNameError, "Task name must be at least 2 characters");
    isValid = false;
  }

  if (!categoryVal) {
    showFieldError(DOM.taskCategorySelect, DOM.taskCategoryError, "Please select a category");
    isValid = false;
  }

  if (!priorityVal) {
    showFieldError(DOM.taskPrioritySelect, DOM.taskPriorityError, "Please select a priority");
    isValid = false;
  }

  if (!dueDateVal) {
    showFieldError(DOM.taskDueDateInput, DOM.taskDueDateError, "Please select a due date");
    isValid = false;
  }

  return isValid;
}

function handleTaskFormSubmit(e) {
  e.preventDefault();

  if (!validateTaskForm()) return;

  const title = DOM.taskNameInput.value.trim();
  const category = DOM.taskCategorySelect.value;
  const priority = DOM.taskPrioritySelect.value;
  const dueDate = DOM.taskDueDateInput.value;

  if (currentEditingTaskId !== null) {
    // Edit existing task
    const taskIndex = tasks.findIndex(t => t.id === currentEditingTaskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        category,
        priority,
        dueDate,
        updatedAt: new Date().toISOString()
      };
      saveTasksToStorage();
      closeTaskModal();
      renderTaskList();
      updateDashboardMetrics();
      showToast("Task updated successfully", "success");
    }
  } else {
    // Create new task
    const newTask = {
      id: Date.now(),
      title,
      category,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasksToStorage();
    closeTaskModal();
    renderTaskList();
    updateDashboardMetrics();

    // Slide-in animation for top task
    const firstTaskEl = DOM.taskList.querySelector(".task-item");
    if (firstTaskEl) {
      firstTaskEl.classList.add("task-slide-in");
    }

    showToast("Task created successfully", "success");
  }
}

// ==========================================
// 11. Task Actions (Toggle Complete, Delete)
// ==========================================

function handleToggleTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveTasksToStorage();
  renderTaskList();
  updateDashboardMetrics();

  if (task.completed) {
    showToast("Task marked as completed", "success");
  } else {
    showToast("Task marked as active", "info");
  }
}

function handleConfirmDelete() {
  if (!taskToDeleteId) return;

  const taskId = taskToDeleteId;
  const taskEl = document.querySelector(`.task-item[data-task-id="${taskId}"]`);

  closeDeleteConfirmModal();

  if (taskEl) {
    taskEl.classList.add("task-slide-out");
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasksToStorage();
      renderTaskList();
      updateDashboardMetrics();
      showToast("Task deleted", "danger");
    }, 220);
  } else {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasksToStorage();
    renderTaskList();
    updateDashboardMetrics();
    showToast("Task deleted", "danger");
  }
}

// ==========================================
// 12. Workspace Reset & Clear Completed
// ==========================================

function resetToSampleData() {
  tasks = [...INITIAL_SAMPLE_TASKS];
  saveTasksToStorage();
  closeSettingsModal();
  renderTaskList();
  updateDashboardMetrics();
  showToast("Workspace reset to 12 sample tasks", "info");
}

function clearAllCompletedTasks() {
  const completedCount = tasks.filter(t => t.completed).length;
  if (completedCount === 0) {
    showToast("No completed tasks to clear", "info");
    closeSettingsModal();
    return;
  }

  tasks = tasks.filter(t => !t.completed);
  saveTasksToStorage();
  closeSettingsModal();
  renderTaskList();
  updateDashboardMetrics();
  showToast(`Cleared ${completedCount} completed task${completedCount === 1 ? '' : 's'}`, "danger");
}

// ==========================================
// 13. Event Listeners Setup
// ==========================================

function setupEventListeners() {
  // Mobile Sidebar Toggle
  if (DOM.menuToggleBtn) {
    DOM.menuToggleBtn.addEventListener("click", () => {
      DOM.sidebar.classList.toggle("open");
      DOM.sidebarBackdrop.classList.toggle("active");
    });
  }

  if (DOM.sidebarBackdrop) {
    DOM.sidebarBackdrop.addEventListener("click", () => {
      DOM.sidebar.classList.remove("open");
      DOM.sidebarBackdrop.classList.remove("active");
    });
  }

  // Sidebar Navigation Links
  DOM.navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const navTarget = link.getAttribute("data-nav");
      if (!navTarget) return;

      DOM.navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      activeNavigation = navTarget;

      // Close mobile sidebar after click
      if (DOM.sidebar.classList.contains("open")) {
        DOM.sidebar.classList.remove("open");
        DOM.sidebarBackdrop.classList.remove("active");
      }

      renderTaskList();
    });
  });

  // Filter Pill Buttons (All, Active, Completed)
  DOM.filterPillBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      DOM.filterPillBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeStatusFilter = btn.getAttribute("data-filter") || "all";
      renderTaskList();
    });
  });

  // Priority Dropdown Filter
  if (DOM.priorityFilterSelect) {
    DOM.priorityFilterSelect.addEventListener("change", (e) => {
      activePriorityFilter = e.target.value;
      renderTaskList();
    });
  }

  // Search Input
  if (DOM.searchInput) {
    DOM.searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      if (DOM.searchClearBtn) {
        DOM.searchClearBtn.style.display = searchQuery ? "block" : "none";
      }
      renderTaskList();
    });
  }

  if (DOM.searchClearBtn) {
    DOM.searchClearBtn.addEventListener("click", () => {
      if (DOM.searchInput) DOM.searchInput.value = "";
      searchQuery = "";
      DOM.searchClearBtn.style.display = "none";
      renderTaskList();
      if (DOM.searchInput) DOM.searchInput.focus();
    });
  }

  // Task List Delegation (Checkbox, Menu, Edit, Delete)
  if (DOM.taskList) {
    DOM.taskList.addEventListener("click", (e) => {
      // 1. Checkbox toggle
      const checkbox = e.target.closest(".task-checkbox");
      if (checkbox) {
        const taskId = parseInt(checkbox.getAttribute("data-id"), 10);
        handleToggleTask(taskId);
        return;
      }

      // 2. Three-dot dropdown menu trigger
      const menuBtn = e.target.closest(".task-menu-btn");
      if (menuBtn) {
        e.stopPropagation();
        const taskId = parseInt(menuBtn.getAttribute("data-id"), 10);
        toggleDropdown(taskId);
        return;
      }

      // 3. Edit task button in dropdown
      const editBtn = e.target.closest(".edit-task-btn");
      if (editBtn) {
        e.stopPropagation();
        const taskId = parseInt(editBtn.getAttribute("data-id"), 10);
        openEditTaskModal(taskId);
        return;
      }

      // 4. Delete task button in dropdown
      const deleteBtn = e.target.closest(".delete-task-btn");
      if (deleteBtn) {
        e.stopPropagation();
        const taskId = parseInt(deleteBtn.getAttribute("data-id"), 10);
        openDeleteConfirmModal(taskId);
        return;
      }
    });
  }

  // Close dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".menu-action-wrapper")) {
      closeAllDropdowns();
    }
  });

  // Modal Trigger Buttons
  if (DOM.quickAddBtn) DOM.quickAddBtn.addEventListener("click", openCreateTaskModal);
  if (DOM.newBtnHeader) DOM.newBtnHeader.addEventListener("click", openCreateTaskModal);
  if (DOM.createFirstTaskBtn) DOM.createFirstTaskBtn.addEventListener("click", openCreateTaskModal);

  // Modal 1 (Create/Edit) Close
  if (DOM.taskModalCloseBtn) DOM.taskModalCloseBtn.addEventListener("click", closeTaskModal);
  if (DOM.taskModalCancelBtn) DOM.taskModalCancelBtn.addEventListener("click", closeTaskModal);
  if (DOM.taskForm) DOM.taskForm.addEventListener("submit", handleTaskFormSubmit);

  // Modal 2 (Delete) Close & Confirm
  if (DOM.deleteModalCloseBtn) DOM.deleteModalCloseBtn.addEventListener("click", closeDeleteConfirmModal);
  if (DOM.deleteModalCancelBtn) DOM.deleteModalCancelBtn.addEventListener("click", closeDeleteConfirmModal);
  if (DOM.deleteModalConfirmBtn) DOM.deleteModalConfirmBtn.addEventListener("click", handleConfirmDelete);

  // Modal 3 (Settings)
  if (DOM.settingsBtn) DOM.settingsBtn.addEventListener("click", openSettingsModal);
  if (DOM.settingsModalCloseBtn) DOM.settingsModalCloseBtn.addEventListener("click", closeSettingsModal);
  if (DOM.settingsModalDoneBtn) DOM.settingsModalDoneBtn.addEventListener("click", closeSettingsModal);
  if (DOM.resetSampleDataBtn) DOM.resetSampleDataBtn.addEventListener("click", resetToSampleData);
  if (DOM.clearCompletedBtn) DOM.clearCompletedBtn.addEventListener("click", clearAllCompletedTasks);

  // Close Modals on Overlay Click
  [DOM.taskModal, DOM.deleteModal, DOM.settingsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
          closeAllDropdowns();
        }
      });
    }
  });

  // Keyboard Shortcuts (Escape, Enter, 'N', '/')
  document.addEventListener("keydown", (e) => {
    // 1. Escape closes any modal or dropdown
    if (e.key === "Escape") {
      closeTaskModal();
      closeDeleteConfirmModal();
      closeSettingsModal();
      closeAllDropdowns();
      return;
    }

    const isTyping = ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName);

    // 2. '/' focuses Search (when not typing in an input)
    if (e.key === "/" && !isTyping) {
      e.preventDefault();
      if (DOM.searchInput) {
        DOM.searchInput.focus();
        DOM.searchInput.select();
      }
      return;
    }

    // 3. 'n' or 'N' opens New Task Modal (when not typing in an input)
    if ((e.key === "n" || e.key === "N") && !isTyping) {
      e.preventDefault();
      openCreateTaskModal();
      return;
    }
  });
}

// ==========================================
// 14. Initialization
// ==========================================

function initApp() {
  loadTasksFromStorage();
  updateGreetingAndDashboardHeader();
  renderTaskList();
  updateDashboardMetrics();
  setupEventListeners();

  // Subtle SaaS Loading Screen Dismissal
  setTimeout(() => {
    if (DOM.appLoader) {
      DOM.appLoader.classList.add("loaded");
    }
  }, 450);
}

// Start application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
