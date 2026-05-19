import { attachAutoSave } from "./brouillons.js";
import api from "./api.js"; // supposé déjà existant

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  if (!form) return;

  const projectId = form.dataset.projectId;

  // Attacher auto-save
  attachAutoSave(projectId, form);

  // Restaurer brouillon si présent
  if (form.__draft.restore()) {
    const notice = document.createElement("div");
    notice.className = "draft-notice";
    notice.textContent = "Un brouillon a été restauré.";
    form.prepend(notice);
    setTimeout(() => notice.remove(), 5000);
  }

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      await api.createTask(projectId, formData);
      form.__draft.clear();
      window.dispatchEvent(new CustomEvent("task:created", { detail: { projectId } }));
    } catch (err) {
      console.error("Erreur création tâche", err);
    }
  });
});
