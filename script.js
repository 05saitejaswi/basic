
document.addEventListener("DOMContentLoaded", () => {

  const sidebarToggleBtn = document.querySelector('[aria-label="Collapse sidebar"]');
  const sideMenu = document.querySelector(".side-menu");

  sidebarToggleBtn.addEventListener("click", () => {
    const collapsed = sideMenu.classList.toggle("collapsed");
    sidebarToggleBtn.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
    sidebarToggleBtn.setAttribute("aria-pressed", String(collapsed));
  });

  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    document.querySelectorAll("[data-editable]").forEach(el => {
      el.classList.remove("search-highlight");
      if (!query) return;
      if (el.textContent.toLowerCase().includes(query)) {
        el.classList.add("search-highlight");
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  function showToast(id, message, duration = 3000) {
    const toast = document.getElementById(id);
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => { toast.hidden = true; }, 300);
    }, duration);
  }

  const backdrop = document.getElementById("createModalBackdrop");
  const openBtn = document.getElementById("openCreateModalBtn");
  const closeBtn = document.getElementById("closeCreateModalBtn");
  const cancelBtn = document.getElementById("cancelCreateBtn");

  const openModal = () => {
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    backdrop.hidden = true;
    document.body.style.overflow = "";
  };

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  const form = document.getElementById("createIssueForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    let valid = true;

    form.querySelectorAll("input[required], select[required], textarea[required]").forEach(field => {
      if (field.disabled) return;
    
      const error = document.getElementById(`${field.id}Error`);
      if (field.value.trim() === "") {
        field.classList.add("input-error");
        error?.removeAttribute("hidden"); 
        valid = false;
      } else {
        field.classList.remove("input-error");
        error?.setAttribute("hidden", "");
      }
    });

    const reporterInput = document.getElementById("issueReporter");
    const reporterError = document.getElementById("issueReporterError");
    if (reporterInput.value.trim() === "") {
      reporterInput.classList.add("input-error");
      reporterError?.removeAttribute("hidden");
      valid = false;
    } else {
      reporterInput.classList.remove("input-error");
      reporterError?.setAttribute("hidden", "");
    }

    if (!valid) return;
    showToast("createToast", "Issue created successfully!");
    form.reset();
    closeModal();
  });

  const helpBtn = document.getElementById("helpBtn");
  const helpMenu = document.getElementById("helpMenu");

  const openHelp = () => {
    helpMenu.hidden = false;
    helpMenu.style.display = "";
    helpBtn.setAttribute("aria-expanded", "true");
  };
  const closeHelp = () => {
    helpMenu.hidden = true;
    helpMenu.style.display = "none";
    helpBtn.setAttribute("aria-expanded", "false");
  };
  const toggleHelp = () => helpMenu.hidden ? openHelp() : closeHelp();

  helpBtn.addEventListener("click", (e) => {
    
    e.stopPropagation();
    toggleHelp();
  });


  document.addEventListener("click", (e) => {
    if (!helpMenu.hidden && !helpMenu.contains(e.target) && e.target !== helpBtn) {
      closeHelp();
    }
  });

  const themeBtn = document.getElementById("themeToggleBtn");
  const themeIcon = themeBtn.querySelector("i");

  themeBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      themeBtn.setAttribute("aria-label", "Switch to dark mode");
      themeBtn.setAttribute("aria-pressed", "false");
      themeIcon?.classList.remove("bi-moon-stars-fill");
      themeIcon?.classList.add("bi-lightbulb");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      themeBtn.setAttribute("aria-label", "Switch to light mode");
      themeBtn.setAttribute("aria-pressed", "true");
      themeIcon?.classList.remove("bi-lightbulb");
      themeIcon?.classList.add("bi-moon-stars-fill");
    }
  });

  const statusPill = document.getElementById("statusPill");
  const statusMenu = document.getElementById("statusMenu");

  statusPill.addEventListener("click", (e) => {
    e.stopPropagation();
    statusMenu.hidden = !statusMenu.hidden;
  });

  statusMenu.querySelectorAll("li").forEach(item => {
    item.addEventListener("click", () => {
      
      const { color, text, status } = item.dataset;
      statusPill.style.background = color;
      statusPill.style.color = text;
      statusPill.innerHTML = `${status} <span class="arrow-icon">⌄</span>`;
      statusMenu.hidden = true;
    });
  });

  document.addEventListener("click", (e) => {
    if (!statusMenu.hidden && !statusMenu.contains(e.target) && e.target !== statusPill) {
      statusMenu.hidden = true;
    }
  });

  class Comments {
    constructor() {
      this.input = document.getElementById("commentInput");
      this.postBtn = document.getElementById("save");
      this.cancelBtn = document.getElementById("cancel");
      this.list = document.getElementById("commentList");

      this.postBtn.addEventListener("click", () => this.post());
      this.cancelBtn.addEventListener("click", () => { this.input.value = ""; });
      this.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.ctrlKey) this.post();
      });
    }

    post() {
      const text = this.input.value.trim();
      if (!text) return;

      const time = new Date().toLocaleString("en-US", {
        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
      });

      const item = document.createElement("div");
      item.className = "comment-item";
      item.innerHTML = `
        <span class="person-avatar">ST</span>
        <div class="comment-body">
          <div class="comment-meta">
            <span class="comment-author">Sai Tejaswi</span>
            <span class="comment-time">${time}</span>
          </div>
          <p class="comment-text">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>
          <button class="comment-delete">Delete</button>
        </div>`;

      item.querySelector(".comment-delete").addEventListener("click", () => item.remove());
      this.list.appendChild(item);
      this.input.value = "";
    }
  }

  new Comments();

  class Labels {
    constructor() {
      this.input = document.getElementById("labelInput");
      this.list = document.getElementById("labelList");

      [...this.list.querySelectorAll(".label-chip")].forEach(chip => this.wireChip(chip));

      this.input.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const val = this.input.value.trim();
        if (!val) return;
        this.createChip(val);
        this.input.value = "";
      });
    }

    isDuplicate(value, exclude = null) {
      return [...this.list.querySelectorAll(".label-chip")]
        .filter(c => c !== exclude)
        .some(c => c.dataset.label.toLowerCase() === value.toLowerCase());
    }

    restoreChip(chip, label) {
      chip.dataset.label = label;
      chip.innerHTML = `${label} <button class="label-remove" aria-label="Remove label">×</button>`;
      this.wireChip(chip);
    }

    startEdit(chip) {
     
      const original = chip.dataset.label;
      const input = document.createElement("input");
      input.type = "text";
      input.className = "label-edit-input";
      input.value = original;

      chip.innerHTML = "";
      chip.appendChild(input);
      input.focus();
      input.select();

      const save = () => {
        const newVal = input.value.trim();
        if (!newVal) { chip.remove(); return; }
        if (this.isDuplicate(newVal, chip)) {
          input.classList.add("label-error");
          setTimeout(() => this.restoreChip(chip, original), 700);
          return;
        }
        this.restoreChip(chip, newVal);
      };

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); save(); }
        if (e.key === "Escape") { this.restoreChip(chip, original); }
      });
   
      input.addEventListener("blur", () => {
        if (chip.contains(input)) save();
      });
    }

    wireChip(chip) {
      chip.title = "Double-click to edit";
      chip.querySelector(".label-remove").addEventListener("click", (e) => {
        e.stopPropagation();
        chip.remove();
      });
      chip.addEventListener("dblclick", (e) => {
        if (e.target.classList.contains("label-remove")) return;
        this.startEdit(chip);
      });
    }

    createChip(value) {
      if (this.isDuplicate(value)) {
        this.input.classList.add("label-error");
        setTimeout(() => this.input.classList.remove("label-error"), 900);
        return;
      }
      const chip = document.createElement("span");
      chip.className = "label-chip";
      chip.dataset.label = value;
      chip.innerHTML = `${value} <button class="label-remove" aria-label="Remove label">×</button>`;
      this.wireChip(chip);
      this.list.appendChild(chip);
    }
  }

  new Labels();

  document.querySelectorAll(".toggle-row").forEach(btn => {
    btn.addEventListener("click", () => {
      const content = document.getElementById(btn.dataset.target);
      if (!content) return;
      const opening = content.hidden;
      content.hidden = !opening;
      const icon = btn.querySelector("i");
      icon?.classList.toggle("bi-chevron-right", !opening);
      icon?.classList.toggle("bi-chevron-down", opening);
    });
  });

  const recentBtn = document.getElementById("recentBtn");
  const recentPopup = document.getElementById("recentPopup");
  const closeRecentBtn = document.getElementById("closeRecentBtn");

  recentBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    recentPopup.hidden = !recentPopup.hidden;
  });
  closeRecentBtn.addEventListener("click", () => { recentPopup.hidden = true; });
  document.addEventListener("click", (e) => {
    if (!recentPopup.contains(e.target) && !recentBtn.contains(e.target)) {
      recentPopup.hidden = true;
    }
  });

  const reporterInput = document.getElementById("issueReporter");
  const reporterOptions = document.getElementById("reporterOptions");

  reporterInput.addEventListener("focus", () => { reporterOptions.hidden = false; });
  reporterInput.addEventListener("input", () => {
    const query = reporterInput.value.toLowerCase();
    reporterOptions.hidden = false;
    reporterOptions.querySelectorAll("li").forEach(li => {
      li.hidden = !li.textContent.toLowerCase().includes(query);
    });
  });
  reporterOptions.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => {
      reporterInput.value = li.dataset.value;
      reporterOptions.hidden = true;
    });
  });
  document.addEventListener("click", (e) => {
    if (!reporterOptions.contains(e.target) && e.target !== reporterInput) {
      reporterOptions.hidden = true;
    }
  });

});
