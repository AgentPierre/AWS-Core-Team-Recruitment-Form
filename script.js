const totalPages = 4;
let currentPage = 1;

function getSelectedTrack() {
  const track = document.querySelector('input[name="track"]:checked');
  return track ? track.value : "";
}

function toggleOtherMajorField() {
  const major = document.getElementById("major");
  const otherMajor = document.getElementById("otherMajor");
  const otherMajorField = otherMajor.closest(".field");
  if (major.value === "Other") {
    otherMajorField.classList.remove("hidden");
  } else {
    otherMajorField.classList.add("hidden");
    otherMajor.value = "";
    otherMajor.classList.remove("error");
  }
}

function toggleOfficerFields() {
  const officerFields = document.getElementById("officerFields");
  const isOfficer = getSelectedTrack() === "Officer";
  if (isOfficer) {
    officerFields.classList.remove("hidden");
  } else {
    officerFields.classList.add("hidden");
    [
      "rolePreference",
      "leadershipExperience",
      "technicalExperience",
      "initiativeLead",
      "weeklyCommitment",
      "conductAgreement",
    ].forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      if (element.type === "checkbox") {
        element.checked = false;
      } else {
        element.value = "";
      }
      element.classList.remove("error");
    });
  }
}

function handleTrackChange() {
  toggleOfficerFields();
  if (currentPage !== 1) return;
  const pageOne = document.getElementById("page1");
  if (!pageOne) return;
  pageOne.querySelectorAll(".error-msg").forEach((errorNode) => {
    if (errorNode.textContent === "Please select a track") {
      errorNode.remove();
    }
  });
}

function setTrack(track) {
  const trackInput = document.querySelector(
    `input[name="track"][value="${track}"]`,
  );
  if (!trackInput) return;
  trackInput.checked = true;
  toggleOfficerFields();
}

function goToForm(track) {
  if (track) {
    setTrack(track);
  }
  currentPage = 1;
  showPage(1);
  const formStart = document.getElementById("applicationForm");
  if (formStart) {
    formStart.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateSteps(page) {
  const fill = document.getElementById("stepFill");
  const percent = ((page - 1) / (totalPages - 1)) * 75 + 8;
  fill.style.width = `${percent}%`;
  document.querySelectorAll(".step-dot").forEach((dot) => {
    const step = parseInt(dot.dataset.step);
    dot.classList.remove("active", "done");
    if (step === page) dot.classList.add("active");
    else if (step < page) dot.classList.add("done");
  });
}

function showPage(page) {
  document
    .querySelectorAll(".form-page")
    .forEach((p) => p.classList.remove("active"));
  const target = document.getElementById(`page${page}`);
  if (target) {
    target.classList.add("active");
    const card = target.querySelector(".fade-up");
    if (card) {
      card.style.animation = "none";
      card.offsetHeight;
      card.style.animation = "";
    }
  }
  updateSteps(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clearErrors(page) {
  const el = document.getElementById(`page${page}`);
  if (!el) return;
  el.querySelectorAll(".error").forEach((e) => e.classList.remove("error"));
  el.querySelectorAll(".error-msg").forEach((e) => e.remove());
}

function showError(input, msg) {
  input.classList.add("error");
  const div = document.createElement("div");
  div.className = "error-msg";
  div.textContent = msg;
  input.parentNode.insertBefore(div, input.nextSibling);
}

function validatePage(page) {
  clearErrors(page);
  let valid = true;

  if (page === 1) {
    [
      { id: "trackGroup", msg: "Please select a track", type: "group" },
      { id: "firstName", msg: "First name is required" },
      { id: "lastName", msg: "Last name is required" },
      { id: "email", msg: "UH Email is required" },
      { id: "phone", msg: "Phone number is required" },
      { id: "major", msg: "Please select a major" },
      { id: "campus", msg: "Please select a campus" },
      { id: "year", msg: "Please select a year" },
    ].forEach((f) => {
      if (f.type === "group") {
        if (!document.querySelector('input[name="track"]:checked')) {
          const group = document.getElementById(f.id);
          const message = document.createElement("div");
          message.className = "error-msg";
          message.textContent = f.msg;
          group.parentNode.insertBefore(message, group.nextSibling);
          valid = false;
        }
        return;
      }
      const el = document.getElementById(f.id);
      if (!el.value.trim()) {
        showError(el, f.msg);
        valid = false;
      }
    });
    const email = document.getElementById("email");
    const emailValue = email.value.trim().toLowerCase();
    email.value = emailValue;
    const isUhEmail =
      emailValue.endsWith("@uh.edu") || emailValue.endsWith("@cougarnet.uh.edu");
    if (emailValue && !isUhEmail) {
      if (!email.classList.contains("error")) {
        showError(
          email,
          "Please use your official UH email address (@uh.edu or @cougarnet.uh.edu).",
        );
        valid = false;
      }
    }
    const phone = document.getElementById("phone");
    if (phone.value && !/^[\d\s\+\-()]{7,15}$/.test(phone.value.trim())) {
      if (!phone.classList.contains("error")) {
        showError(phone, "Please enter a valid phone number");
        valid = false;
      }
    }

    const major = document.getElementById("major");
    const otherMajor = document.getElementById("otherMajor");
    if (major.value === "Other" && !otherMajor.value.trim()) {
      showError(otherMajor, "Other major is required");
      valid = false;
    }
  }

  if (page === 2) {
    ["whyJoin", "improvements", "expectations"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        showError(el, "This field is required");
        valid = false;
      }
    });
  }

  if (page === 3) {
    if (
      document.querySelectorAll('input[name="skills"]:checked').length === 0
    ) {
      const g = document.getElementById("skillsGroup");
      const m = document.createElement("div");
      m.className = "error-msg";
      m.textContent = "Please select at least one skill";
      g.parentNode.insertBefore(m, g.nextSibling);
      valid = false;
    }

    if (getSelectedTrack() === "Officer") {
      [
        { id: "rolePreference", msg: "Role preference is required" },
        {
          id: "leadershipExperience",
          msg: "Leadership/organization experience is required",
        },
        { id: "technicalExperience", msg: "Technical experience is required" },
        {
          id: "initiativeLead",
          msg: "Initiative plan is required",
        },
      ].forEach((f) => {
        const el = document.getElementById(f.id);
        if (!el.value.trim()) {
          showError(el, f.msg);
          valid = false;
        }
      });

      const weeklyCommitment = document.getElementById("weeklyCommitment");
      if (!weeklyCommitment.checked) {
        const m = document.createElement("div");
        m.className = "error-msg";
        m.textContent = "Please confirm weekly time commitment";
        weeklyCommitment.closest(".ack-field").appendChild(m);
        valid = false;
      }

      const conductAgreement = document.getElementById("conductAgreement");
      if (!conductAgreement.checked) {
        const m = document.createElement("div");
        m.className = "error-msg";
        m.textContent = "You must agree to follow the Code of Conduct";
        conductAgreement.closest(".ack-field").appendChild(m);
        valid = false;
      }
    }
  }

  if (page === 4) {
    if (!document.querySelector('input[name="workshop"]:checked')) {
      const g = document.getElementById("workshopGroup");
      const m = document.createElement("div");
      m.className = "error-msg";
      m.textContent = "Please select an option";
      g.parentNode.insertBefore(m, g.nextSibling);
      valid = false;
    }
    const ack = document.getElementById("acknowledge");
    if (!ack.checked) {
      const m = document.createElement("div");
      m.className = "error-msg";
      m.textContent = "You must acknowledge this to submit";
      ack.closest(".ack-field").appendChild(m);
      valid = false;
    }
  }
  return valid;
}

function nextPage(c) {
  if (!validatePage(c)) return;
  currentPage = c + 1;
  showPage(currentPage);
}
function prevPage(c) {
  currentPage = c - 1;
  showPage(currentPage);
}

/* ===== CONFETTI ENGINE ===== */
function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const colors = [
    "#5b3ea5",
    "#9b7dd4",
    "#ff9900",
    "#fde68a",
    "#b8a0e3",
    "#7c5cbf",
    "#d6cce8",
    "#ff6b6b",
    "#48dbfb",
    "#fff",
  ];
  const particles = [];
  const count = 150;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      decay: Math.random() * 0.003 + 0.002,
    });
  }

  let frame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach((p) => {
      if (p.opacity <= 0) return;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.rot += p.rotSpeed;
      p.opacity -= p.decay;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive) {
      frame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(frame);
      canvas.remove();
    }
  }
  animate();

  // Second burst after 400ms
  setTimeout(() => {
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.3,
        w: Math.random() * 8 + 4,
        h: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 8,
        vy: -(Math.random() * 6 + 2),
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        decay: Math.random() * 0.004 + 0.003,
      });
    }
  }, 400);
}

/* ===== SUBMIT ===== */
// Replace this URL with your Google Apps Script Web App URL
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzBPbcQ6sIbuJV_MIvzBn8GVSDZS96dqASsB8dKPmaqPffEyvh4B4GnsOB50aVQMw-btw/exec";
const DISCORD_INVITE_URL = "#";
const FORM_MIN_FILL_MS = 4000;
const formStartedAt = Date.now();

function sanitizeText(value, maxLength = 500) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function sanitizePhone(value) {
  return sanitizeText(value, 25).replace(/[^\d\s+\-()]/g, "");
}

function sanitizeUrl(value) {
  const candidate = sanitizeText(value, 500);
  if (!candidate) return "";
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch (err) {
    return "";
  }
  return "";
}

function isDevSubmissionMode() {
  const url = (GOOGLE_SHEET_URL || "").trim();
  if (!url) return true;
  const normalized = url.toUpperCase();
  return normalized.includes("YOUR_") || normalized.includes("PLACEHOLDER");
}

function submitForm() {
  if (!validatePage(4)) return;

  const honeypot = document.getElementById("website");
  if (honeypot && honeypot.value.trim()) {
    alert("Submission blocked. Please refresh and try again.");
    return;
  }

  if (Date.now() - formStartedAt < FORM_MIN_FILL_MS) {
    alert("Please review your answers before submitting.");
    return;
  }

  const emailInput = document.getElementById("email");
  const normalizedEmail = sanitizeText(emailInput.value, 254).toLowerCase();
  emailInput.value = normalizedEmail;
  const uhEmailRegex = /@(uh\.edu|cougarnet\.uh\.edu)$/i;
  if (!uhEmailRegex.test(normalizedEmail)) {
    alert(
      "Please use your official UH email address (@uh.edu or @cougarnet.uh.edu).",
    );
    return;
  }

  const track = getSelectedTrack();
  const clientElapsedMs = Date.now() - formStartedAt;
  const majorValue = document.getElementById("major").value;
  const otherMajorValue =
    majorValue === "Other"
      ? sanitizeText(document.getElementById("otherMajor").value, 120)
      : "";
  const isOfficer = track === "Officer";

  const data = {
    website: honeypot ? sanitizeText(honeypot.value, 200) : "",
    clientElapsedMs,
    track,
    firstName: sanitizeText(document.getElementById("firstName").value, 80),
    lastName: sanitizeText(document.getElementById("lastName").value, 80),
    email: sanitizeText(document.getElementById("email").value, 254).toLowerCase(),
    phone: sanitizePhone(document.getElementById("phone").value),
    major: majorValue,
    otherMajor: otherMajorValue,
    campus: document.getElementById("campus").value,
    classification: document.getElementById("year").value,
    whyJoin: sanitizeText(document.getElementById("whyJoin").value, 2000),
    improvements: sanitizeText(document.getElementById("improvements").value, 2000),
    expectations: sanitizeText(document.getElementById("expectations").value, 2000),
    skills: [...document.querySelectorAll('input[name="skills"]:checked')].map(
      (c) => c.value,
    ),
    otherSkill: sanitizeText(document.getElementById("otherSkill").value, 120),
    proofLink: sanitizeUrl(document.getElementById("proofLink").value),
    workshop: document.querySelector('input[name="workshop"]:checked').value,
    rolePreference: isOfficer
      ? sanitizeText(document.getElementById("rolePreference").value, 80)
      : "",
    leadershipExperience: isOfficer
      ? sanitizeText(document.getElementById("leadershipExperience").value, 2000)
      : "",
    technicalExperience: isOfficer
      ? sanitizeText(document.getElementById("technicalExperience").value, 2000)
      : "",
    initiativeThisSemester: isOfficer
      ? sanitizeText(document.getElementById("initiativeLead").value, 2000)
      : "",
    weeklyCommitment: isOfficer
      ? document.getElementById("weeklyCommitment").checked
      : false,
    conductAgreement: isOfficer
      ? document.getElementById("conductAgreement").checked
      : false,
  };

  // Disable submit button while sending
  const submitBtn = document.querySelector(".btn-submit");
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const resetSubmitButton = () => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Application";
  };

  if (isDevSubmissionMode()) {
    console.log("[DEV MODE] Submission skipped: placeholder endpoint configured.");
    showSuccessPage();
    return;
  }

  // Send to Google Sheets
  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const text = await res.text();

      let payload = null;
      try {
        payload = JSON.parse(text);
      } catch (err) {
        console.warn("Failed to parse submission response as JSON:", err, "Raw response text:", text);
      }

      if (payload && payload.ok === true) {
        showSuccessPage();
        return;
      }
      throw new Error(
        (payload && payload.error) ||
        `Submission failed. Expected { ok: true }. HTTP ${res.status}. Response: ${text}`,
      );
    })
    .catch((err) => {
      console.error("Submission error:", err);
      resetSubmitButton();
      alert(err.message || "Submission failed. Please try again.");
    });
}

function showSuccessPage() {
  document
    .querySelectorAll(".form-page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("successPage").classList.add("active");
  document.getElementById("stepFill").style.width = "100%";
  document.querySelectorAll(".step-dot").forEach((d) => {
    d.classList.remove("active");
    d.classList.add("done");
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  launchConfetti();
}

function bindNavigationButtons() {
  const navigationBindings = [
    { id: "btnNext1", handler: () => nextPage(1) },
    { id: "btnBack2", handler: () => prevPage(2) },
    { id: "btnNext2", handler: () => nextPage(2) },
    { id: "btnBack3", handler: () => prevPage(3) },
    { id: "btnNext3", handler: () => nextPage(3) },
    { id: "btnBack4", handler: () => prevPage(4) },
    { id: "btnSubmit", handler: () => submitForm() },
  ];

  navigationBindings.forEach(({ id, handler }) => {
    const button = document.getElementById(id);
    if (!button || button.dataset.boundClick === "true") return;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      handler();
    });
    button.dataset.boundClick = "true";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindNavigationButtons();
  showPage(1);

  const successDiscordLink = document.getElementById("successDiscordLink");
  if (successDiscordLink) {
    successDiscordLink.href = DISCORD_INVITE_URL;
  }

  document
    .querySelectorAll('input[name="track"]')
    .forEach((radio) => radio.addEventListener("change", handleTrackChange));
  document
    .getElementById("major")
    .addEventListener("change", toggleOtherMajorField);
  handleTrackChange();
  toggleOtherMajorField();
});
