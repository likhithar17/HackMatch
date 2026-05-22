/**
 * ==========================================================================
 * HackMatch — Live Interactive Client-Side Core State Management
 * ==========================================================================
 */

// Initial Seed Dataset representing high-fidelity student hackers

const DEFAULT_HACKERS = [
  {
    id: "seed-1",
    fullName: "Alex Rivera",
    college: "MIT",
    role: "AI/ML Engineer",
    email: "arivera@mit.edu",
    bio: "Building distributed deep learning pipelines for autonomous drone delivery. Ready with pre-trained models. Excited about Computer Vision apps.",
    lookingFor: "Looking for an expert Frontend developer who understands interactive WebGL maps.",
    skills: ["Python", "PyTorch", "TensorFlow", "Node.js"],
    github: "alexr-datasets",
    linkedin: "alex-rivera-deeplearning",
    likes: 18,
    isBookmarked: false,
    isInvited: false,
    avatar: null, // fallback monogram
    avatarColor: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
  },
  {
    id: "seed-2",
    fullName: "Sarah Jenkins",
    college: "Stanford University",
    role: "UI/UX Designer",
    email: "sjenkins@stanford.edu",
    bio: "Crafting beautiful, accessible designer-developer handoffs. Expert in Figma component structures, dark styles, and fluid layout frameworks.",
    lookingFor: "Seeking a Full-stack developer to assemble a beautiful carbon tracking platform.",
    skills: ["Figma", "Tailwind", "React", "Illustrator"],
    github: "sarahj-creatives",
    linkedin: "sarah-jenkins-design",
    likes: 24,
    isBookmarked: true,
    isInvited: false,
    avatar: null,
    avatarColor: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)"
  },
  {
    id: "seed-3",
    fullName: "Julie Shen",
    college: "Carnegie Mellon",
    role: "Product Manager",
    email: "jshen@andrew.cmu.edu",
    bio: "Ex-Meta Intern. Specialized in product spec definitions, interactive high-fidelity user workflows, and agile team sprint tracking methodologies.",
    lookingFor: "Looking to join a serious, hardware-focused hack team in the health tech sector.",
    skills: ["Figma", "Scrum", "Next.js", "Trello"],
    github: "julieshen-pms",
    linkedin: "julie-shen-pm",
    likes: 12,
    isBookmarked: false,
    isInvited: true,
    avatar: null,
    avatarColor: "linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)"
  },
  {
    id: "seed-4",
    fullName: "Liam Chen",
    college: "UC Berkeley",
    role: "Backend Developer",
    email: "lchen@berkeley.edu",
    bio: "Go developer and Kubernetes wrangler. Loving low-latency microservices, gRPC channels, and secure custom JWT authentication middleware engines.",
    lookingFor: "Looking to connect with Frontend developers building creative canvas interfaces.",
    skills: ["Go", "Kubernetes", "Docker", "Node.js"],
    github: "lchen-cores",
    linkedin: "liam-chen-infrastructure",
    likes: 15,
    isBookmarked: false,
    isInvited: false,
    avatar: null,
    avatarColor: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"
  },
  {
    id: "seed-5",
    fullName: "Emily Zhao",
    college: "UT Austin",
    role: "Frontend Developer",
    email: "ezhao@utexas.edu",
    bio: "Creative frontend specialist. Built 10+ open source React widgets. Obsessed with high-contrast UI, page transitions, and smooth CSS keyframes designs.",
    lookingFor: "Looking for an expert AI/ML engineer to make a cool natural language SQL generator.",
    skills: ["React", "Vue", "Tailwind", "TypeScript"],
    github: "emilyz-dev",
    linkedin: "emily-zhao-frontend",
    likes: 31,
    isBookmarked: false,
    isInvited: false,
    avatar: null,
    avatarColor: "linear-gradient(135deg, #a855f7 0%,#ec4899 100%)"
  },
  {
    id: "seed-6",
    fullName: "David Kim",
    college: "Georgia Tech",
    role: "Full Stack Developer",
    email: "dkim@gatech.edu",
    bio: "Full stack engineering generalist. Love shipping products end-to-end. Experienced with Express.js APIs, GraphQL, and Redis memory caches.",
    lookingFor: "Looking for a proactive PM to lead user interviews and layout presentation pitch decks.",
    skills: ["React", "Express", "Node.js", "MongoDB"],
    github: "davidk-stack",
    linkedin: "david-kim-fullstack",
    likes: 19,
    isBookmarked: false,
    isInvited: false,
    avatar: null,
    avatarColor: "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)"
  }
];

// List of popular quick skills and preset colors maps
const POPULAR_SKILLS_LIST = [
  "React", "Vue", "Next.js", "TypeScript", "Node.js", "Python", "PyTorch", "Go", 
  "Tailwind", "Figma", "Docker", "Kubernetes", "Express", "MongoDB", "SQL", "Firebase"
];

const METADATA_AVATAR_COLORS = [
  "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
  "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)",
  "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
  "linear-gradient(135deg, #a855f7 0%,#ec4899 100%)"
];

// Active State Storage Variables
let hackersList = [];
let activeView = "home";
let activeRoleFilter = "All";
let activeTechFilters = [];
let searchFilterQuery = "";

// Dynamic form states
let formSkillsList = ["React", "Tailwind"]; // preset default
let uploadedAvatarBase64 = null;

// Active Firebase Guide Tab states
let activeGuideTab = "schema";

async function loadHackersFromServer() {
  try {
    const res = await fetch("/api/hackers");
    if (!res.ok) throw new Error("HTTP Status " + res.status);
    const data = await res.json();
    hackersList = data;
    localStorage.setItem("hackmatch_student_pool", JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to fetch hacker profiles from express backend, falling back to localStorage cache:", error);
    const savedHackers = localStorage.getItem("hackmatch_student_pool");
    if (savedHackers) {
      try {
        hackersList = JSON.parse(savedHackers);
      } catch (e) {
        hackersList = [...DEFAULT_HACKERS];
      }
    } else {
      hackersList = [...DEFAULT_HACKERS];
    }
  }
}

// INITIALIZATION ENTRYPOINT
window.addEventListener("DOMContentLoaded", async () => {
  // Pull real-time persisted state from Express server backend API
  await loadHackersFromServer();

  // Draw core visual elements
  renderQuickSkillsSuggestions();
  renderFormSkillsPills();
  renderRolePillsFilterBar();
  renderTechCheckboxFilterShelf();
  applyFiltersAndRenderMesh();
  updateHackerPoolMetrics();

  // Run initial Lucide redraw for SVG tags icon replacements
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});

/**
 * ==========================================================================
 * View State Navigation Routing Control
 * ==========================================================================
 */
function showView(viewName) {
  activeView = viewName;

  // Toggle active views styling class
  document.querySelectorAll(".page-view").forEach(page => {
    page.classList.remove("active");
  });
  const currentTargetView = document.getElementById(`view-${viewName}`);
  if (currentTargetView) {
    currentTargetView.classList.add("active");
  }

  // Toggle Header Nav buttons style
  const navKeys = ['home', 'explorer', 'create'];
  navKeys.forEach(key => {
    const dButton = document.getElementById(`nav-btn-${key}`);
    const mButton = document.getElementById(`mob-btn-${key}`);
    if (dButton) {
      if (key === viewName) {
        dButton.classList.add("active");
      } else {
        dButton.classList.remove("active");
      }
    }
    if (mButton) {
      if (key === viewName) {
        mButton.classList.add("active");
      } else {
        mButton.classList.remove("active");
      }
    }
  });

  // Smooth scroll container wrapper to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Draw lists dynamically on navigate
  if (viewName === "explorer") {
    applyFiltersAndRenderMesh();
  }

  // Redraw Lucide icon elements
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Mobile Slide Hamburger Menu drawer toggle
function toggleMobileNav() {
  const panel = document.getElementById("mobile-nav-panel");
  const menuIcon = document.getElementById("menu-icon-state");
  if (panel) {
    const isOpen = panel.classList.toggle("open");
    if (isOpen) {
      panel.style.display = "flex";
      if (menuIcon && typeof lucide !== "undefined") {
        menuIcon.setAttribute("data-lucide", "x");
        lucide.createIcons();
      }
    } else {
      panel.style.display = "none";
      if (menuIcon && typeof lucide !== "undefined") {
        menuIcon.setAttribute("data-lucide", "menu");
        lucide.createIcons();
      }
    }
  }
}

/**
 * ==========================================================================
 * Interactive Skills Tag Form Setup
 * ==========================================================================
 */

// Rendering under Custom Created Form Block suggestions list
function renderQuickSkillsSuggestions() {
  const container = document.getElementById("quick-suggests-shelf");
  if (!container) return;

  container.innerHTML = "";
  POPULAR_SKILLS_LIST.forEach(skill => {
    const isSelected = formSkillsList.includes(skill);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `quick-suggest-btn ${isSelected ? "selected" : ""}`;
    button.textContent = skill;
    button.onclick = () => toggleSkillFromSuggestion(skill);
    container.appendChild(button);
  });
}

function toggleSkillFromSuggestion(skill) {
  const errorMsg = document.getElementById("err-skills-list");
  if (errorMsg) errorMsg.textContent = "";

  if (formSkillsList.includes(skill)) {
    formSkillsList = formSkillsList.filter(s => s !== skill);
  } else {
    if (formSkillsList.length >= 10) {
      if (errorMsg) errorMsg.textContent = "Maximum of 10 technologies allowed.";
      return;
    }
    formSkillsList.push(skill);
  }

  renderQuickSkillsSuggestions();
  renderFormSkillsPills();
}

// Redraw form selected skills tags
function renderFormSkillsPills() {
  const container = document.getElementById("skills-board-pane");
  const badgeCounts = document.getElementById("skills-count-badge");
  if (!container) return;

  container.innerHTML = "";
  if (badgeCounts) {
    badgeCounts.textContent = `${formSkillsList.length} Selected`;
  }

  if (formSkillsList.length === 0) {
    container.innerHTML = `<span style="font-size: 13px; color: #9ca3af; font-style: italic;">No skills selected yet. Click from suggestions below or write your own.</span>`;
    return;
  }

  formSkillsList.forEach(skill => {
    const pill = document.createElement("div");
    pill.className = "pill-tag-interactive";
    pill.innerHTML = `
      <span>${skill}</span>
      <button type="button" class="tag-remove-btn" onclick="removeSkillFormPill('${skill}')">
        <i data-lucide="x"></i>
      </button>
    `;
    container.appendChild(pill);
  });

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function removeSkillFormPill(skill) {
  formSkillsList = formSkillsList.filter(s => s !== skill);
  renderQuickSkillsSuggestions();
  renderFormSkillsPills();
}

// Inline custom typed tag input addition
function addCustomSkillFromInput() {
  const input = document.getElementById("form-skill-input");
  const errorMsg = document.getElementById("err-skills-list");
  if (!input) return;

  if (errorMsg) errorMsg.textContent = "";
  const rawValue = input.value.trim();

  if (!rawValue) return;

  if (rawValue.length > 20) {
    if (errorMsg) errorMsg.textContent = "Skill tag name must be under 20 characters.";
    return;
  }

  // Capitalize neatly
  const formattedVal = rawValue.charAt(0).toUpperCase() + rawValue.slice(1);

  if (formSkillsList.includes(formattedVal)) {
    input.value = "";
    return;
  }

  if (formSkillsList.length >= 10) {
    if (errorMsg) errorMsg.textContent = "Maximum of 10 technologies allowed.";
    return;
  }

  formSkillsList.push(formattedVal);
  input.value = "";

  renderQuickSkillsSuggestions();
  renderFormSkillsPills();
}

/**
 * ==========================================================================
 * Creator Form Image Upload Processing / base64 Serialization
 * ==========================================================================
 */
function triggerAvatarUpload() {
  const fileInput = document.getElementById("avatar-file-input");
  if (fileInput) fileInput.click();
}

function previewAvatarImage(event) {
  const file = event.target.files[0];
  const fileInputError = document.getElementById("err-full-name"); // anchor err
  
  if (!file) return;

  // File limit check (2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert("Profile photo exceeds the 2MB size limit. Please choose a smaller file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedAvatarBase64 = e.target.result;

    const previewImg = document.getElementById("avatar-file-preview");
    const placeholderBox = document.getElementById("avatar-placeholder-inner");
    if (previewImg && placeholderBox) {
      previewImg.src = uploadedAvatarBase64;
      previewImg.classList.remove("hidden");
      placeholderBox.classList.add("hidden");
    }
  };
  reader.readAsDataURL(file);
}

/**
 * ==========================================================================
 * Creator Form Real-time Validation and Submission Processing
 * ==========================================================================
 */
async function handleProfileSubmit(event) {
  event.preventDefault();

  // Reset error displays
  document.querySelectorAll(".input-error-msg").forEach(box => box.textContent = "");

  let isFormValid = true;

  // 1. Full name check
  const nameVal = document.getElementById("form-full-name").value.trim();
  if (nameVal.length < 2) {
    document.getElementById("err-full-name").textContent = "Please enter your full name.";
    isFormValid = false;
  }

  // 2. College check
  const collegeVal = document.getElementById("form-college").value.trim();
  if (collegeVal.length < 2) {
    document.getElementById("err-college").textContent = "Please enter your university name.";
    isFormValid = false;
  }

  // 3. Email Check with regex matching college or typical structure
  const emailVal = document.getElementById("form-email").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    document.getElementById("err-email").textContent = "Please enter a valid academic/personal email address.";
    isFormValid = false;
  }

  // 4. Bio check
  const bioVal = document.getElementById("form-bio").value.trim();
  if (bioVal.length < 10) {
    document.getElementById("err-bio").textContent = "Please expand your hacker bio (at least 10 characters).";
    isFormValid = false;
  }

  // 5. Looking for check
  const lookVal = document.getElementById("form-lookingfor").value.trim();
  if (lookVal.length < 5) {
    document.getElementById("err-lookingfor").textContent = "Describe who you are recruiting or seeking.";
    isFormValid = false;
  }

  // 6. Check if any skill is selected
  if (formSkillsList.length === 0) {
    document.getElementById("err-skills-list").textContent = "Please select or type at least one technology skill.";
    isFormValid = false;
  }

  // 7. Portfolio URLs formats checked as optional
  const githubVal = document.getElementById("form-github").value.trim();
  const linkedinVal = document.getElementById("form-linkedin").value.trim();

  if (!isFormValid) {
    const errorSects = document.querySelector(".input-error-msg:not(:empty)");
    if (errorSects) {
      errorSects.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Generate random avatar background color if no image uploaded
  const randomColorIdx = Math.floor(Math.random() * METADATA_AVATAR_COLORS.length);
  const matchedRoleVal = document.getElementById("form-role").value;

  // Shape profile record object
  const newProfilePayload = {
    fullName: nameVal,
    college: collegeVal,
    role: matchedRoleVal,
    email: emailVal,
    bio: bioVal,
    lookingFor: lookVal,
    skills: [...formSkillsList],
    github: githubVal ? githubVal.replace(/https?:\/\/(www\.)?github\.com\//, "") : "",
    linkedin: linkedinVal ? linkedinVal.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, "") : "",
    avatar: uploadedAvatarBase64,
    avatarColor: METADATA_AVATAR_COLORS[randomColorIdx]
  };

  try {
    const res = await fetch("/api/hackers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newProfilePayload)
    });
    if (!res.ok) throw new Error("HTTP STATUS " + res.status);
    const createdProfile = await res.json();
    
    // Save created card's ID so we can recognize ourselves inside AI queries
    localStorage.setItem("hackmatch_my_profile_id", createdProfile.id);

    // Dynamic state prepend
    hackersList.unshift(createdProfile);
    localStorage.setItem("hackmatch_student_pool", JSON.stringify(hackersList));
  } catch (error) {
    console.error("Express backend save failed, appending locally as fallback:", error);
    const mockCreatedProfile = {
      id: "user-" + Date.now(),
      ...newProfilePayload,
      likes: 0,
      isBookmarked: false,
      isInvited: false
    };
    hackersList.unshift(mockCreatedProfile);
    localStorage.setItem("hackmatch_student_pool", JSON.stringify(hackersList));
  }

  // Reset form inputs completely
  document.getElementById("profile-creator-form").reset();
  formSkillsList = ["React", "Tailwind"];
  uploadedAvatarBase64 = null;
  
  // Reset file preview indicators
  document.getElementById("avatar-file-preview").src = "";
  document.getElementById("avatar-file-preview").classList.add("hidden");
  document.getElementById("avatar-placeholder-inner").classList.remove("hidden");

  // Redraw dropdown counters
  renderQuickSkillsSuggestions();
  renderFormSkillsPills();
  updateHackerPoolMetrics();

  // Show customized Success Popover modal
  const successModal = document.getElementById("modal-success-popover");
  if (successModal) {
    successModal.classList.remove("hidden");
  }
}

function dismissSuccessPopoverAndExplore() {
  const successModal = document.getElementById("modal-success-popover");
  if (successModal) {
    successModal.classList.add("hidden");
  }
  // Redirect to browse view immediately
  showView("explorer");
}

/**
 * ==========================================================================
 * Filter Board Setup & Calculations
 * ==========================================================================
 */

// Draw Specialties pills tabs row
function renderRolePillsFilterBar() {
  const container = document.getElementById("role-pills-row");
  if (!container) return;

  const roles = ["All", "Frontend Developer", "Backend Developer", "Full Stack Developer", "UI/UX Designer", "AI/ML Engineer", "Product Manager"];
  container.innerHTML = "";

  roles.forEach(roleName => {
    const isSelected = activeRoleFilter === roleName;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `role-pill-btn ${isSelected ? "active" : ""}`;
    button.textContent = roleName === "All" ? "All Specializations" : roleName;
    button.onclick = () => {
      activeRoleFilter = roleName;
      renderRolePillsFilterBar();
      applyFiltersAndRenderMesh();
    };
    container.appendChild(button);
  });
}

// Draw requirement tag intersections checklist
function renderTechCheckboxFilterShelf() {
  const container = document.getElementById("tech-checkbox-shelf");
  if (!container) return;

  container.innerHTML = "";

  POPULAR_SKILLS_LIST.forEach(tech => {
    const isChecked = activeTechFilters.includes(tech);
    const badgeDiv = document.createElement("div");
    badgeDiv.className = `tech-filter-checkbox-tag ${isChecked ? "selected" : ""}`;
    badgeDiv.textContent = tech;
    badgeDiv.onclick = () => {
      if (activeTechFilters.includes(tech)) {
        activeTechFilters = activeTechFilters.filter(item => item !== tech);
      } else {
        activeTechFilters.push(tech);
      }
      renderTechCheckboxFilterShelf();
      applyFiltersAndRenderMesh();
    };
    container.appendChild(badgeDiv);
  });
}

// Reset filter configurations quickly
function clearAllFilteringCriteria() {
  activeRoleFilter = "All";
  activeTechFilters = [];
  searchFilterQuery = "";

  const searchInput = document.getElementById("explorer-search-input");
  if (searchInput) searchInput.value = "";

  renderRolePillsFilterBar();
  renderTechCheckboxFilterShelf();
  applyFiltersAndRenderMesh();
}

function handleSearchFilterInput(event) {
  searchFilterQuery = event.target.value.trim().toLowerCase();
  
  const clearBtn = document.getElementById("clear-search-query-btn");
  if (clearBtn) {
    if (searchFilterQuery) {
      clearBtn.classList.remove("hidden");
    } else {
      clearBtn.classList.add("hidden");
    }
  }

  applyFiltersAndRenderMesh();
}

function clearSearchQueryInput() {
  searchFilterQuery = "";
  const searchInput = document.getElementById("explorer-search-input");
  if (searchInput) searchInput.value = "";

  const clearBtn = document.getElementById("clear-search-query-btn");
  if (clearBtn) clearBtn.classList.add("hidden");

  applyFiltersAndRenderMesh();
}

/**
 * ==========================================================================
 * Dynamic Profiles Mesh Generation & Interaction handlers
 * ==========================================================================
 */
function applyFiltersAndRenderMesh() {
  const container = document.getElementById("profiles-card-mesh-grid");
  const emptyOverlay = document.getElementById("empty-results-overlay-card");
  const statusStrip = document.getElementById("filtering-status-strip");
  const activePillsBox = document.getElementById("active-indicators-pills");

  if (!container) return;

  // Filter profiles based on state criteria
  let processedPool = hackersList.filter(hacker => {
    
    // 1. Role match
    let matchesRole = true;
    if (activeRoleFilter !== "All") {
      matchesRole = hacker.role === activeRoleFilter;
    }

    // 2. Search search text matches Full Name, College, Bio or exact Skill representation
    let matchesSearch = true;
    if (searchFilterQuery) {
      const bioText = (hacker.bio || "").toLowerCase();
      const nameText = (hacker.fullName || "").toLowerCase();
      const collegeText = (hacker.college || "").toLowerCase();
      const skillsSearchText = hacker.skills.join(" ").toLowerCase();
      matchesSearch = (
        nameText.includes(searchFilterQuery) || 
        collegeText.includes(searchFilterQuery) || 
        bioText.includes(searchFilterQuery) || 
        skillsSearchText.includes(searchFilterQuery)
      );
    }

    // 3. AND Combination Skills Checklist Matching
    let matchesTech = true;
    if (activeTechFilters.length > 0) {
      matchesTech = activeTechFilters.every(requiredSkill => 
        hacker.skills.includes(requiredSkill)
      );
    }

    return matchesRole && matchesSearch && matchesTech;
  });

  // Toggle empty lists states overlay
  if (processedPool.length === 0) {
    container.innerHTML = "";
    if (emptyOverlay) emptyOverlay.classList.remove("hidden");
  } else {
    if (emptyOverlay) emptyOverlay.classList.add("hidden");
    renderCardsToContainer(processedPool, container);
  }

  // Draw indicators status strip
  const hasActiveFilters = activeRoleFilter !== "All" || activeTechFilters.length > 0 || searchFilterQuery.length > 0;
  if (hasActiveFilters) {
    if (statusStrip) statusStrip.classList.remove("hidden");
    if (activePillsBox) {
      activePillsBox.innerHTML = "";
      if (activeRoleFilter !== "All") {
        const p = document.createElement("span");
        p.className = "indicator-pill";
        p.textContent = activeRoleFilter;
        activePillsBox.appendChild(p);
      }
      activeTechFilters.forEach(t => {
        const p = document.createElement("span");
        p.className = "indicator-pill";
        p.textContent = `+ ${t}`;
        activePillsBox.appendChild(p);
      });
      if (searchFilterQuery) {
        const p = document.createElement("span");
        p.className = "indicator-pill";
        p.textContent = `"${searchFilterQuery}"`;
        activePillsBox.appendChild(p);
      }
    }
  } else {
    if (statusStrip) statusStrip.classList.add("hidden");
  }

  updateHackerPoolMetrics(processedPool.length);

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Render filtered card list UI
function renderCardsToContainer(profiles, targetContainer) {
  targetContainer.innerHTML = "";

  profiles.forEach(hacker => {
    const userMonogram = hacker.fullName ? hacker.fullName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() : "U";
    
    // Check if custom avatar exists, else draw monogram with color gradients
    const hasAvatar = !!hacker.avatar;
    const avatarStyle = hasAvatar ? `style="background: none;"` : `style="background: ${hacker.avatarColor};"`;
    const avatarContent = hasAvatar 
      ? `<img src="${hacker.avatar}" class="card-avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" alt="${hacker.fullName}">` 
      : `<span>${userMonogram}</span>`;

    const card = document.createElement("div");
    card.className = "geometric-card profile-card";
    card.id = `hacker-card-${hacker.id}`;

    // Render developer social portfolio handles or placeholders if missing
    const githubLinkEl = hacker.github 
      ? `<button class="external-icon-btn" onclick="openExternalHackerProfile('https://github.com/${hacker.github}')" title="GitHub Profile">
           <i data-lucide="github"></i>
         </button>`
      : `<button class="external-icon-btn" style="opacity: 0.3; cursor: not-allowed;" title="No GitHub portfolio provided">
           <i data-lucide="github"></i>
         </button>`;

    const linkedinLinkEl = hacker.linkedin 
      ? `<button class="external-icon-btn" onclick="openExternalHackerProfile('https://linkedin.com/in/${hacker.linkedin}')" title="LinkedIn Profile">
           <i data-lucide="linkedin"></i>
         </button>`
      : `<button class="external-icon-btn" style="opacity: 0.3; cursor: not-allowed;" title="No LinkedIn portfolio provided">
           <i data-lucide="linkedin"></i>
         </button>`;

    // Match invitation active status class logic
    const inviteButtonLabel = hacker.isInvited ? "Invited" : "Invite to Team";
    const inviteButtonClass = hacker.isInvited ? "btn-card-action-trigger invited" : "btn-card-action-trigger";
    const inviteIcon = hacker.isInvited ? '<i data-lucide="check-circle-2"></i>' : '<i data-lucide="zap"></i>';

    card.innerHTML = `
      <div class="card-upper-block">
        <div class="card-top-row">
          <div class="card-hacker-profile">
            <div class="card-avatar" ${avatarStyle}>
              ${avatarContent}
            </div>
            <div class="card-title-details">
              <h3 class="card-name-h">${hacker.fullName}</h3>
              <p class="card-school-p">${hacker.college}</p>
            </div>
          </div>
          
          <button class="btn-card-bookmark ${hacker.isBookmarked ? 'active' : ''}" onclick="toggleBookmarkState('${hacker.id}')" title="Bookmark hacker">
            <i data-lucide="bookmark"></i>
          </button>
        </div>

        <div class="card-specialty-badge-row">
          <span class="role-badge-classic">${hacker.role}</span>
          <div class="liked-metric-counter" onclick="incrementHackerLikes('${hacker.id}')" title="Upvote Profile" style="cursor: pointer;">
            <i data-lucide="heart"></i>
            <span id="likes-count-${hacker.id}">${hacker.likes}</span>
          </div>
        </div>

        <p class="card-bio-paragraph">"${hacker.bio}"</p>

        <div class="seeking-callout-panel">
          <span class="seeking-head">Seeking Collaboration</span>
          <p class="seeking-body">${hacker.lookingFor}</p>
        </div>

        <div>
          <span class="card-stack-title">Technologies</span>
          <div class="card-skills-shelf">
            ${hacker.skills.map(s => `<span class="card-skill-label">${s}</span>`).join("")}
          </div>
        </div>
      </div>

      <div class="card-bottom-footer">
        <div class="contact-external-icons">
          <button class="external-icon-btn" onclick="copyContactEmailToClipboard('${hacker.id}', '${hacker.email}')" title="Copy developer email: ${hacker.email}">
            <i data-lucide="mail"></i>
            <span class="copied-badge-tooltip" id="tooltip-${hacker.id}">Copied!</span>
          </button>
          ${githubLinkEl}
          ${linkedinLinkEl}
        </div>

        <button class="${inviteButtonClass}" onclick="toggleInvitationState('${hacker.id}')" id="invite-btn-${hacker.id}">
          ${inviteIcon}
          <span id="invite-label-${hacker.id}">${inviteButtonLabel}</span>
        </button>
      </div>
    `;

    targetContainer.appendChild(card);
  });
}

// Bumps and increments like counters
async function incrementHackerLikes(hackerId) {
  const index = hackersList.findIndex(h => h.id === hackerId);
  if (index !== -1) {
    hackersList[index].likes += 1;
    
    // Update specific DOM component immediately and optimistically
    const likesEl = document.getElementById(`likes-count-${hackerId}`);
    if (likesEl) {
      likesEl.textContent = hackersList[index].likes;
    }
    
    try {
      const res = await fetch(`/api/hackers/${hackerId}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      hackersList[index].likes = data.likes;
      if (likesEl) {
        likesEl.textContent = data.likes;
      }
    } catch {
      console.warn("Optimistic upvote failed to sync with Express standard API.");
    }
    localStorage.setItem("hackmatch_student_pool", JSON.stringify(hackersList));
  }
}

// Toggle Bookmarking state on specific profiles
async function toggleBookmarkState(hackerId) {
  const index = hackersList.findIndex(h => h.id === hackerId);
  if (index !== -1) {
    hackersList[index].isBookmarked = !hackersList[index].isBookmarked;
    
    // Quick optimistic styling shift
    const cardEl = document.getElementById(`hacker-card-${hackerId}`);
    if (cardEl) {
      const bookmarkBtn = cardEl.querySelector(".btn-card-bookmark");
      if (bookmarkBtn) {
        if (hackersList[index].isBookmarked) {
          bookmarkBtn.classList.add("active");
        } else {
          bookmarkBtn.classList.remove("active");
        }
      }
    }

    try {
      const res = await fetch(`/api/hackers/${hackerId}/bookmark`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      hackersList[index].isBookmarked = data.isBookmarked;
    } catch {
      console.warn("Optimistic bookmark failed to sync with Express backend API.");
    }
    localStorage.setItem("hackmatch_student_pool", JSON.stringify(hackersList));
  }
}

// Toggle Match invitation states and labels
async function toggleInvitationState(hackerId) {
  const index = hackersList.findIndex(h => h.id === hackerId);
  if (index !== -1) {
    hackersList[index].isInvited = !hackersList[index].isInvited;

    const inviteBtn = document.getElementById(`invite-btn-${hackerId}`);
    const labelSpan = document.getElementById(`invite-label-${hackerId}`);
    
    if (inviteBtn && labelSpan) {
      if (hackersList[index].isInvited) {
        inviteBtn.className = "btn-card-action-trigger invited";
        labelSpan.textContent = "Invited";
        inviteBtn.innerHTML = `
          <i data-lucide="check-circle-2"></i>
          <span id="invite-label-${hackerId}">Invited</span>
        `;
      } else {
        inviteBtn.className = "btn-card-action-trigger";
        labelSpan.textContent = "Invite to Team";
        inviteBtn.innerHTML = `
          <i data-lucide="zap"></i>
          <span id="invite-label-${hackerId}">Invite to Team</span>
        `;
      }
    }

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
    
    // Update header stats counter
    updateHackerPoolMetrics();

    try {
      const res = await fetch(`/api/hackers/${hackerId}/invite`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      hackersList[index].isInvited = data.isInvited;
    } catch {
      console.warn("Optimistic invitation failed to sync with Express backend API.");
    }
    localStorage.setItem("hackmatch_student_pool", JSON.stringify(hackersList));
  }
}

// Visual tooltip clipboard copy actions
function copyContactEmailToClipboard(hackerId, emailAddress) {
  navigator.clipboard.writeText(emailAddress).then(() => {
    const tooltip = document.getElementById(`tooltip-${hackerId}`);
    if (tooltip) {
      tooltip.classList.add("active");
      setTimeout(() => {
        tooltip.classList.remove("active");
      }, 1500);
    }
  }).catch(() => {
    alert(`Email address: ${emailAddress}`);
  });
}

function openExternalHackerProfile(url) {
  console.log("Opening hacker handle url in separate thread:", url);
  window.open(url, "_blank");
}

function updateHackerPoolMetrics(customMatchCount) {
  const banner = document.getElementById("active-pools-indicator");
  if (!banner) return;

  const totalHackers = hackersList.length;
  const matchInvitations = hackersList.filter(h => h.isInvited).length;
  const currentViewMatches = customMatchCount !== undefined ? customMatchCount : totalHackers;

  banner.textContent = `Active Pool size: ${totalHackers} (Active Invitations: ${matchInvitations})`;
}

/**
 * ==========================================================================
 * Sidebar Firebase Integrator Drawer Templates Generator
 * ==========================================================================
 */

// Schema and Boilerplates codes template mapping
const BLUEPRINTS = {
  schema: {
    fileName: "firebase-blueprint.json",
    bannerTitle: "Firestore Architecture Guidelines",
    bannerDesc: "Define a secure, normalized schema suitable for real-time collaborative matching apps on Google Cloud Firestore.",
    code: `{
  "databaseSchema": {
    "collection": "profiles",
    "document": "PROFILE_ID_STRING",
    "fields": {
      "fullName": { "type": "STRING", "description": " Alex Rivera" },
      "college": { "type": "STRING", "description": "e.g. Stanford University" },
      "role": { "type": "ENUM", "values": ["Frontend", "Backend", "Full Stack", "UI/UX", "AI/ML"] },
      "email": { "type": "STRING", "format": "email" },
      "bio": { "type": "STRING", "maxLength": 500 },
      "lookingFor": { "type": "STRING", "maxLength": 300 },
      "skills": { "type": "ARRAY", "items": { "type": "STRING" } },
      "github": { "type": "STRING", "optional": true },
      "linkedin": { "type": "STRING", "optional": true },
      "likes": { "type": "NUMBER", "default": 0 },
      "avatar": { "type": "STRING", "encoding": "base64", "optional": true },
      "createdAt": { "type": "TIMESTAMP", "serverTimestamp": true }
    }
  },
  "securityRules": {
    "match": "/databases/{database}/documents/profiles/{profileId}",
    "allow": {
      "read": "true (authenticated or public for index listing)",
      "create": "request.auth != null && request.resource.data.email == request.auth.token.email",
      "update": "request.auth != null && (resource.data.email == request.auth.token.email || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likes']))",
      "delete": "request.auth != null && resource.data.email == request.auth.token.email"
    }
  }
}`
  },

  vanilla: {
    fileName: "firebase-vanilla.js",
    bannerTitle: "Vanilla JS Integration script",
    bannerDesc: "Below is a beginner-friendly template to initialize the Firebase Client SDK directly in standard Vanilla JS to load profiles in real-time.",
    code: `// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  doc, 
  increment,
  query,
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Replace with your own project config values from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyYourApiKeyHere",
  authDomain: "hackmatch-mvp.firebaseapp.com",
  projectId: "hackmatch-mvp",
  storageBucket: "hackmatch-mvp.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:12345:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to collection
const profilesRef = collection(db, "profiles");

/**
 * 1. Listen to hackers list in Real-time from database
 */
export function listenToHackerProfiles(callback) {
  const q = query(profilesRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const list = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    // Fire callback to update your script.js rendering function dynamically
    callback(list);
  }, error => {
    console.error("Permission issues reading profiles list:", error);
  });
}

/**
 * 2. Save a newly created profile card
 */
export async function saveProfileCard(profileData) {
  try {
    const docRef = await addDoc(profilesRef, {
      ...profileData,
      createdAt: new Date()
    });
    console.log("Successfully hosted profile with document ID:", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("Error creating student record in Cloud database:", err);
    throw err;
  }
}

/**
 * 3. Upvote/Like Profile Record database trigger
 */
export async function likeHackerProfile(hackerDocId) {
  const hackerRef = doc(db, "profiles", hackerDocId);
  try {
    await updateDoc(hackerRef, {
      likes: increment(1)
    });
  } catch (err) {
    console.error("Failed to submit upvote in Cloud Firestore:", err);
  }
}`
  },

  react: {
    fileName: "FirebaseReactSetup.tsx",
    bannerTitle: "React Custom Hook Integration",
    bannerDesc: "If you decide to migrate this simple structure into standard React Vite later, wrap database triggers inside a clean custom React hook.",
    code: `import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query, orderBy, addDoc, updateDoc, doc, increment } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyMyKeySecure",
  authDomain: "hackmatch.firebaseapp.com",
  projectId: "hackmatch"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface HackerProfile {
  id: string;
  fullName: string;
  college: string;
  role: string;
  email: string;
  bio: string;
  skills: string[];
  likes: number;
}

export function useHackerPool() {
  const [hackers, setHackers] = useState<HackerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'profiles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: HackerProfile[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as HackerProfile);
      });
      setHackers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProfile = async (profile: Omit<HackerProfile, 'id' | 'likes'>) => {
    await addDoc(collection(db, 'profiles'), {
      ...profile,
      likes: 0,
      createdAt: new Date()
    });
  };

  const addLike = async (profileId: string) => {
    const docRef = doc(db, 'profiles', profileId);
    await updateDoc(docRef, { likes: increment(1) });
  };

  return { hackers, loading, addProfile, addLike };
}`
  }
};

function openFirebaseGuide() {
  const drawer = document.getElementById("sidebar-guide-overlay");
  if (drawer) {
    drawer.classList.remove("hidden");
    switchGuideTab(activeGuideTab); // redraw tab info
  }
}

function closeFirebaseGuide() {
  const drawer = document.getElementById("sidebar-guide-overlay");
  if (drawer) {
    drawer.classList.add("hidden");
  }
}

// Modulate active tabs in the developer console
function switchGuideTab(tabKey) {
  activeGuideTab = tabKey;

  // Toggle active CSS classes in drawer navigation anchors
  const tabs = ['schema', 'vanilla', 'react'];
  tabs.forEach(t => {
    const btn = document.getElementById(`drawer-tab-btn-${t}`);
    if (btn) {
      if (t === tabKey) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }
  });

  const selectedData = BLUEPRINTS[tabKey];
  if (!selectedData) return;

  // Render contextual content
  const filenameSpan = document.getElementById("file-name-indicator");
  const helperTipContainer = document.getElementById("tip-message-body");
  const codeConsole = document.getElementById("console-output-code");

  if (filenameSpan) filenameSpan.textContent = selectedData.fileName;
  if (helperTipContainer) {
    helperTipContainer.innerHTML = `
      <h4 class="tip-heading">${selectedData.bannerTitle}</h4>
      <p>${selectedData.bannerDesc}</p>
    `;
  }
  if (codeConsole) {
    // Escape standard code displays
    codeConsole.textContent = selectedData.code;
  }

  // Reset copy button indicators
  const copyBtnText = document.getElementById("copy-btn-text");
  const copyIcon = document.getElementById("copy-icon-state");
  if (copyBtnText) copyBtnText.textContent = "Copy Code";
  if (copyIcon && typeof lucide !== "undefined") {
    copyIcon.setAttribute("data-lucide", "copy");
    lucide.createIcons();
  }
}

function copyConsoleCodeText() {
  const codeBox = document.getElementById("console-output-code");
  const copyBtnText = document.getElementById("copy-btn-text");
  const copyIcon = document.getElementById("copy-icon-state");

  if (!codeBox) return;

  const codeText = codeBox.textContent;
  navigator.clipboard.writeText(codeText).then(() => {
    if (copyBtnText) copyBtnText.textContent = "Copied!";
    if (copyIcon && typeof lucide !== "undefined") {
      copyIcon.setAttribute("data-lucide", "check");
      lucide.createIcons();
    }
  }).catch(() => {
    alert("Could not copy script boilerplates automatically.");
  });
}

/**
 * ==========================================================================
 * Custom AI Matchmaker suggestion routines
 * ==========================================================================
 */
async function triggerAiRecommendations() {
  const promptInput = document.getElementById("ai-custom-prompt-input");
  const recsPanel = document.getElementById("ai-recs-panel");
  const loadingIndicator = document.getElementById("ai-recs-loading");
  const errorBox = document.getElementById("ai-recs-error-box");
  const recsGrid = document.getElementById("ai-recs-grid");

  if (!promptInput || !recsPanel || !loadingIndicator || !errorBox || !recsGrid) return;

  const userQuery = promptInput.value.trim();

  // Clear previous state and show panels
  recsPanel.classList.remove("hidden");
  loadingIndicator.classList.remove("hidden");
  errorBox.classList.add("hidden");
  recsGrid.innerHTML = "";

  // Get current user profile from localStorage if exists to help with matching context
  const myProfileId = localStorage.getItem("hackmatch_my_profile_id") || "";
  const myProfileData = hackersList.find(h => h.id === myProfileId) || null;

  try {
    const payload = {
      currentHackerId: myProfileId,
      lookingForQuery: userQuery,
      userBio: myProfileData ? myProfileData.bio : "",
      userSkills: myProfileData ? myProfileData.skills : [],
      userRole: myProfileData ? myProfileData.role : ""
    };

    const response = await fetch("/api/hackers/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const result = await response.json();
    const suggestions = result.recommendations || [];

    loadingIndicator.classList.add("hidden");

    if (suggestions.length === 0) {
      recsGrid.innerHTML = `
        <div style="grid-column: span 3; padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">
          No direct recommendations generated. Try creating more student profiles to enrich the matching candidates pool or adjusting your description.
        </div>
      `;
      return;
    }

    renderAiRecsCards(suggestions, recsGrid);

  } catch (error) {
    console.error("AI Matchmaker failed:", error);
    loadingIndicator.classList.add("hidden");
    errorBox.classList.remove("hidden");
    const errText = document.getElementById("ai-error-text");
    if (errText) {
      errText.textContent = `Integration Error: ${error.message || "Failed to contact Gemini recommender services."}`;
    }
  }
}

function renderAiRecsCards(recommendations, container) {
  container.innerHTML = "";

  recommendations.forEach(rec => {
    // Find matching profile from local pool
    const profile = hackersList.find(h => h.id === rec.hackerId);
    if (!profile) return;

    const monogram = profile.fullName ? profile.fullName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() : "U";
    const hasAvatar = !!profile.avatar;
    const avatarStyle = hasAvatar ? `style="background: none;"` : `style="background: ${profile.avatarColor};"`;
    const avatarContent = hasAvatar 
      ? `<img src="${profile.avatar}" class="card-avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" alt="${profile.fullName}">` 
      : `<span>${monogram}</span>`;

    const card = document.createElement("div");
    card.className = "ai-rec-card animate-scaleIn";
    card.innerHTML = `
      <div class="rec-card-top">
        <div class="rec-user-info">
          <div class="rec-avatar" ${avatarStyle}>
            ${avatarContent}
          </div>
          <div class="rec-meta">
            <span class="rec-name">${profile.fullName}</span>
            <span class="rec-school">${profile.college}</span>
          </div>
        </div>
        <div class="rec-score-badge">
          <span>${rec.matchPercentage}% Fit</span>
        </div>
      </div>
      <p class="rec-reason">"${rec.matchReason}"</p>
      <div class="ai-rec-card-footer">
        <span class="rec-role">${profile.role}</span>
        <button class="btn-rec-match" onclick="scrollToCard('${profile.id}')">
          <span>Inspect Card</span>
          <i data-lucide="arrow-right" style="width:12px; height: 12px;"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function closeAiRecommendations() {
  const recsPanel = document.getElementById("ai-recs-panel");
  if (recsPanel) {
    recsPanel.classList.add("hidden");
  }
}

function scrollToCard(cardId) {
  setTimeout(() => {
    const card = document.getElementById(`hacker-card-${cardId}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.ring = "2px solid var(--primary)";
      card.classList.add("highlighted-glowing-ring");
      setTimeout(() => {
        card.classList.remove("highlighted-glowing-ring");
      }, 3000);
    }
  }, 200);
}
