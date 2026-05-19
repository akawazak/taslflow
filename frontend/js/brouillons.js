const DRAFT_PREFIX = "draft";

function buildKey(projectId, formId = "taskForm") {
  return `${DRAFT_PREFIX}:${projectId}:${formId}`;
}

function formToObject(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

function populateForm(form, data = {}) {
  Object.keys(data).forEach((key) => {
    const el = form.querySelector(`[name="${key}"]`);
    if (el) el.value = data[key];
  });
}

export function saveDraft(projectId, form) {
  const key = buildKey(projectId, form.id || "taskForm");
  const payload = {
    savedAt: new Date().toISOString(),
    data: formToObject(form),
  };
  localStorage.setItem(key, JSON.stringify(payload));
}

export function restoreDraft(projectId, form) {
  const key = buildKey(projectId, form.id || "taskForm");
  const raw = localStorage.getItem(key);
  if (!raw) return false;
  const payload = JSON.parse(raw);
  populateForm(form, payload.data);
  return true;
}

export function clearDraft(projectId, form) {
  const key = buildKey(projectId, form.id || "taskForm");
  localStorage.removeItem(key);
}

export function attachAutoSave(projectId, form) {
  form.addEventListener("input", () => saveDraft(projectId, form));
  form.__draft = {
    restore: () => restoreDraft(projectId, form),
    clear: () => clearDraft(projectId, form),
  };
}
