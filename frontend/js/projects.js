let currentProjectId = null;
let editingProjectId = null;

async function loadProjects() {
  try {
    const res = await axios.get("/projects");
    const projects = res.data.data;
    const grid = document.getElementById("projects-grid");

    if (!projects.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">📁</div><p>Aucun projet. Créez-en un !</p></div>`;
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    grid.innerHTML = projects.map((p) => {
      const isOwner = p.owner._id === user.id;
      return `
        <div class="project-card" onclick="openProject('${p._id}')">
          <div class="project-card-title">${p.title}</div>
          <div class="project-card-desc">${p.description || "Aucune description"}</div>
          <div class="project-card-footer">
            <span class="badge badge-${p.status === 'actif' ? 'actif' : p.status === 'en pause' ? 'pause' : 'archive'}">${p.status}</span>
            <span style="color:var(--text-muted);font-size:12px">${p.members.length + 1} membre${p.members.length ? 's' : ''}</span>
          </div>
          ${isOwner ? `
          <div class="project-card-actions" onclick="event.stopPropagation()">
            <button class="btn-sm" onclick="editProject('${p._id}', '${escHtml(p.title)}', '${escHtml(p.description || "")}', '${p.deadline ? p.deadline.slice(0,10) : ""}', '${p.status}')">✏️ Modifier</button>
            <button class="btn-danger" onclick="deleteProject('${p._id}')">🗑️ Supprimer</button>
          </div>` : ""}
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error("Projects error:", err);
  }
}

function escHtml(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function editProject(id, title, desc, deadline, status) {
  editingProjectId = id;
  document.getElementById("project-modal-title").textContent = "Modifier le projet";
  document.getElementById("proj-title").value = title;
  document.getElementById("proj-desc").value = desc;
  document.getElementById("proj-deadline").value = deadline;
  document.getElementById("proj-status").value = status;
  showModal("project-modal");
}

async function saveProject() {
  const title = document.getElementById("proj-title").value.trim();
  const description = document.getElementById("proj-desc").value.trim();
  const deadline = document.getElementById("proj-deadline").value;
  const status = document.getElementById("proj-status").value;

  if (!title) return alert("Le titre est requis");

  try {
    if (editingProjectId) {
      await axios.put(`/projects/${editingProjectId}`, { title, description, deadline, status });
    } else {
      await axios.post("/projects", { title, description, deadline });
    }
    hideModal("project-modal");
    editingProjectId = null;
    document.getElementById("proj-title").value = "";
    document.getElementById("proj-desc").value = "";
    document.getElementById("proj-deadline").value = "";
    document.getElementById("proj-status").value = "actif";
    document.getElementById("project-modal-title").textContent = "Nouveau projet";
    loadProjects();
  } catch (err) {
    alert(err.response?.data?.message || "Erreur lors de la sauvegarde");
  }
}

async function deleteProject(id) {
  if (!confirm("Supprimer ce projet et toutes ses tâches ?")) return;
  try {
    await axios.delete(`/projects/${id}`);
    loadProjects();
  } catch (err) {
    alert(err.response?.data?.message || "Erreur");
  }
}

async function openProject(id) {
  currentProjectId = id;
  showPage("project-detail");
  await loadProjectDetail(id);
}

async function loadProjectDetail(id) {
  try {
    const [projRes, activitiesRes] = await Promise.all([
      axios.get(`/projects/${id}`),
      axios.get(`/projects/${id}/activities`),
    ]);
    const project = projRes.data;
    const user = JSON.parse(localStorage.getItem("user"));
    const isOwner = project.owner._id === user.id;

    document.getElementById("project-detail-header").innerHTML = `
      <h1 class="page-title" style="margin-bottom:4px">${project.title}</h1>
      <span class="badge badge-${project.status === 'actif' ? 'actif' : project.status === 'en pause' ? 'pause' : 'archive'}">${project.status}</span>
    `; 
} catch (error) {
    console.error(error);
}
  }
   
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  return `il y a ${Math.floor(hrs / 24)} jour(s)`;
}
