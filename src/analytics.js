/**
 * analytics.js — Koenig Solutions Microsoft Training Landing Page
 * GA4 event tracking utility
 *
 * Naming convention: object_action (lowercase, underscores)
 * All events follow the GA4 custom event pattern:
 *   gtag('event', event_name, { ...parameters })
 *
 * Replace GA_MEASUREMENT_ID with your actual GA4 property ID
 * before deploying (e.g. "G-XXXXXXXXXX").
 */

// ─── Safe wrapper ────────────────────────────────────────────────────────────
// Guards against environments where gtag hasn't loaded yet (e.g. blocked by
// an ad-blocker, consent not yet granted, or running in a Jest test).
function track(eventName, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  } catch (e) {
    // Silently swallow errors — never break the user experience for analytics
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", eventName, params);
    }
  }
}

// ─── UTM helpers (read once at page load) ────────────────────────────────────
function getUtmParams() {
  const sp = new URLSearchParams(window.location.search);
  return {
    utm_source:   sp.get("utm_source")   || undefined,
    utm_medium:   sp.get("utm_medium")   || undefined,
    utm_campaign: sp.get("utm_campaign") || undefined,
    utm_content:  sp.get("utm_content")  || undefined,
    utm_term:     sp.get("utm_term")     || undefined,
  };
}

// Strip undefined keys so GA4 doesn't receive null values for empty params.
function clean(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

// ─────────────────────────────────────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * page_viewed
 * Fired once on component mount (in addition to GA4's automatic page_view).
 * Enriches with UTM context and page metadata useful for paid traffic analysis.
 */
export function trackPageView() {
  track("page_viewed", clean({
    page_title:    document.title,
    page_location: window.location.href,
    page_type:     "landing_page",
    page_name:     "microsoft_training",
    ...getUtmParams(),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
//  HERO & NAVIGATION CTAs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * cta_clicked
 * Covers every button/link that opens the lead-gen modal or the brochure modal.
 *
 * @param {string} buttonText   — visible label on the button
 * @param {string} location     — section / component name (snake_case)
 * @param {string} [ctaType]    — "lead_form" | "brochure" | "scroll"
 */
export function trackCtaClick(buttonText, location, ctaType = "lead_form") {
  track("cta_clicked", clean({
    button_text: buttonText,
    location,
    cta_type:    ctaType,
    ...getUtmParams(),
  }));
}

/**
 * hero_read_more_clicked
 * Micro-conversion: user expands the hero description copy.
 * High signal — engaged prospects expand; bounce traffic does not.
 */
export function trackHeroReadMore(expanded) {
  track("hero_read_more_clicked", {
    action: expanded ? "expand" : "collapse",
    location: "hero",
  });
}

/**
 * video_muted_toggled
 * Indicates engagement with the hero video.
 */
export function trackVideoMuteToggle(isMuted) {
  track("video_muted_toggled", {
    action: isMuted ? "muted" : "unmuted",
    location: "hero_video",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  LEAD FORM — 3-step modal
// ─────────────────────────────────────────────────────────────────────────────

/**
 * lead_form_opened
 * Fired when the modal becomes visible. Distinguishes enquiry vs brochure.
 *
 * @param {"lead"|"brochure"} formMode
 * @param {string} triggerLocation  — which CTA opened the form
 */
export function trackLeadFormOpened(formMode, triggerLocation) {
  track("lead_form_opened", clean({
    form_mode:        formMode,
    trigger_location: triggerLocation,
    ...getUtmParams(),
  }));
}

/**
 * lead_form_step_completed
 * Fires when the user successfully passes validation and advances to next step.
 * This is your funnel measurement — track drop-off between steps.
 *
 * @param {number} stepNumber   — 1 | 2 | 3
 * @param {string} stepName     — "contact" | "interests" | "goals"
 * @param {"lead"|"brochure"} formMode
 */
export function trackLeadFormStepCompleted(stepNumber, stepName, formMode) {
  track("lead_form_step_completed", {
    step_number: stepNumber,
    step_name:   stepName,
    form_mode:   formMode,
  });
}

/**
 * lead_form_step_back
 * User pressed "← Back". Measures hesitation and which step causes rethink.
 */
export function trackLeadFormStepBack(fromStep, formMode) {
  track("lead_form_step_back", {
    from_step: fromStep,
    form_mode: formMode,
  });
}

/**
 * lead_form_course_selected
 * Fires each time a user toggles a course chip in Step 2.
 * Critical for understanding demand by certification track.
 *
 * @param {string} courseName   — e.g. "Azure", "AI & Copilot", "Security"
 * @param {"add"|"remove"} action
 */
export function trackCourseChipToggled(courseName, action) {
  track("lead_form_course_selected", {
    course_name: courseName,
    action,
    step_name:   "interests",
  });
}

/**
 * lead_form_submitted
 * PRIMARY CONVERSION — fires on successful form submission.
 * Mark this as a GA4 Conversion in Admin > Conversions.
 *
 * @param {"lead"|"brochure"} formMode
 * @param {string[]} courses    — selected course tracks (no PII)
 * @param {string} role         — selected role option
 * @param {string} teamSize     — selected team size bucket
 */
export function trackLeadFormSubmitted(formMode, courses, role, teamSize) {
  track("lead_form_submitted", clean({
    form_mode:       formMode,
    courses_selected: courses.join(", "),
    role_type:        role   || "not_specified",
    team_size:        teamSize || "individual",
    courses_count:    courses.length,
    ...getUtmParams(),
  }));
}

/**
 * lead_form_closed
 * Fires when the user closes the modal without submitting.
 * Tells you at which step you're losing users.
 */
export function trackLeadFormClosed(atStep, formMode) {
  track("lead_form_closed", {
    at_step:   atStep,
    form_mode: formMode,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  QUICK HERO FORM (hq-form — inline below hero video)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * quick_form_type_toggled
 * User switches between "Individual" and "Enterprise" toggle.
 * Segments B2C vs B2B intent before form submission.
 */
export function trackQuickFormTypeToggle(type) {
  track("quick_form_type_toggled", {
    selected_type: type,   // "individual" | "enterprise"
    location:      "hero_quick_form",
  });
}

/**
 * quick_form_submitted
 * SECONDARY CONVERSION — the inline hero quick-contact form.
 * Lower-friction than the 3-step modal; mark as conversion.
 */
export function trackQuickFormSubmitted(type) {
  track("quick_form_submitted", clean({
    form_type:   "hero_quick_form",
    user_type:   type,   // "individual" | "enterprise"
    ...getUtmParams(),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
//  CERT EXPLORER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * cert_tab_changed
 * User switches technology tab in the Cert Explorer.
 * Maps to interest in Azure vs AI vs Security vs M365 etc.
 */
export function trackCertTabChanged(tabName, section = "cert_explorer") {
  track("cert_tab_changed", {
    tab_name: tabName,
    section,
  });
}

/**
 * cert_level_filtered
 * User filters by Fundamentals / Associate / Expert.
 */
export function trackCertLevelFiltered(level, section = "cert_explorer") {
  track("cert_level_filtered", {
    level,
    section,
  });
}

/**
 * cert_searched
 * User types in the cert search box.
 * Captures intent signals — record the query (no PII).
 */
export function trackCertSearched(query) {
  track("cert_searched", {
    search_term: query.trim().toLowerCase(),
    location:    "cert_explorer",
  });
}

/**
 * cert_card_expanded
 * User clicks a cert card to expand details.
 * High-intent signal: they want to know more about a specific cert.
 */
export function trackCertCardExpanded(certCode, certName, level) {
  track("cert_card_expanded", clean({
    cert_code: certCode,
    cert_name: certName,
    cert_level: level,
    location:   "cert_explorer",
  }));
}

/**
 * cert_view_mode_changed
 * User switches between "Courses" and "Exams" view tabs.
 */
export function trackCertViewModeChanged(mode) {
  track("cert_view_mode_changed", {
    mode,   // "courses" | "exams"
    section: "cert_explorer",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  CERT SHOWCASE (sample cert unlock)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * cert_unlock_clicked
 * User clicks the "Unlock" button on the sample certificate card.
 * Strong engagement / intent signal — triggers the lead form modal.
 */
export function trackCertUnlockClicked(location = "cert_showcase") {
  track("cert_unlock_clicked", {
    location,
  });
}

/**
 * sample_cert_downloaded
 * User downloads their personalised sample certificate after form submission.
 * Post-conversion engagement metric.
 */
export function trackSampleCertDownloaded() {
  track("sample_cert_downloaded", {
    format:   "png",
    location: "lead_form_success",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  BROCHURE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * brochure_downloaded
 * SECONDARY CONVERSION — PDF brochure download initiated.
 * Mark as a GA4 conversion in Admin.
 */
export function trackBrochureDownloaded(location) {
  track("brochure_downloaded", clean({
    location,
    ...getUtmParams(),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION VIEWS (Intersection Observer — fires once per session per section)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * section_viewed
 * Fires once (per session) when a named section enters the viewport.
 * Powers scroll-depth analysis and funnel visualisation.
 *
 * @param {string} sectionName  — snake_case identifier
 * @param {number} depthPercent — approximate scroll depth when it fired
 */
export function trackSectionView(sectionName, depthPercent) {
  track("section_viewed", {
    section_name:  sectionName,
    scroll_depth:  depthPercent,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  MICRO-CONVERSIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * faq_item_expanded
 * User opens an FAQ accordion item.
 * Reveals objection-handling interest — useful to prioritise FAQ content.
 */
export function trackFaqExpanded(question) {
  track("faq_item_expanded", {
    question_text: question.slice(0, 100),   // cap length; no PII risk here
    location:      "faq_section",
  });
}

/**
 * faq_chat_message_sent
 * User sends a message in the FAQ AI chatbot.
 * Captures question themes without logging PII.
 */
export function trackFaqChatMessageSent(messageLength) {
  track("faq_chat_message_sent", {
    message_length: messageLength,
    location:       "faq_chatbot",
  });
}

/**
 * faq_chat_quick_prompt_clicked
 * User clicks a suggested quick-reply in the chatbot.
 */
export function trackFaqChatQuickPrompt(promptText) {
  track("faq_chat_quick_prompt_clicked", {
    prompt_text: promptText,
    location:    "faq_chatbot",
  });
}

/**
 * awards_slide_changed
 * User navigates the Microsoft Awards slider (prev/next arrows or dots).
 * Low-priority trust-signal engagement metric.
 */
export function trackAwardsSlideChanged(direction) {
  track("awards_slide_changed", {
    direction,   // "prev" | "next" | "dot"
    location:    "awards_slider",
  });
}

/**
 * cert_path_step_clicked
 * User clicks a step in the cert-path sidebar/scrollable section.
 * Maps learning journey intent.
 */
export function trackCertPathStepClicked(stepIndex, stepLabel) {
  track("cert_path_step_clicked", clean({
    step_index: stepIndex,
    step_label: stepLabel,
    location:   "cert_path_section",
  }));
}
