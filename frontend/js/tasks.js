// tasks.js
import { api } from "./api.js";

// Sauvegarde automatique des brouillons
function saveDraft(projectId) {
  const form = document.getElementById("taskForm");
  const draftKey = `draft_${projectId}`;

  form.addEventListener("input", () => {
    const draftData = {
      title: form.title.value,
      description: form.description.value,
      priority: form.priority.value,
      deadline: form.deadline.value
    };
    localStorage.setItem(draftKey, JSON.stringify(draftData));
  });
}

// Restauration du brouillon
function restoreDraft(projectId) {
  const form = document.getElementById("taskForm");
  const draftKey = `draft_${projectId}`;
  const draftData = localStorage.getItem(draftKey);

  if (draftData) {
    const draft = JSON.parse(draftData);
    if (confirm("Un brouillon existe. Voulez-vous le restaurer ?")) {
      form.title.value = draft.title || "";
      form.description.value = draft.description || "";
      form.priority.value = draft.priority || "basse";
      form.deadline.value = draft.deadline || "";
    }
  }
}

// Suppression du brouillon après soumission
function clearDraft(projectId) {
  const draftKey = `draft_${projectId}`;
  localStorage.removeItem(draftKey);
}

// Initialisation du formulaire
export function initTaskForm(projectId) {
  const form = document.getElementById("taskForm");

  restoreDraft(projectId);
  saveDraft(projectId);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const task = {
      title: form.title.value,
      description: form.description.value,
      priority: form.priority.value,
      deadline: form.deadline.value
    };

    try {
      await api.post(`/projects/${projectId}/tasks`, task);
      clearDraft(projectId);
      alert("Tâche créée avec succès !");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la tâche.");
    }
  });
}
