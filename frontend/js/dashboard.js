async function loadDashboard() {
  try {
    const res = await axios.get("/dashboard");
    const d = res.data;

    document.getElementById("stats-grid").innerHTML = `
      <div class="stat-card accent">
        <div class="stat-value">${d.activeProjects}</div>
        <div class="stat-label">Projets actifs</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${d.assignedTasks}</div>
        <div class="stat-label">Tâches assignées</div>
      </div>
      <div class="stat-card success">
        <div class="stat-value">${d.completedTasks}</div>
        <div class="stat-label">Tâches terminées</div>
      </div>
      <div class="stat-card danger">
        <div class="stat-value">${d.lateTasks}</div>
        <div class="stat-label">Tâches en retard</div>
      </div>
    `;

    const container = document.getElementById("inprogress-tasks");
    if (!d.inProgressTasks.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">✅</div><p>Aucune tâche en cours</p></div>`;
      return;
    }

    container.innerHTML = d.inProgressTasks.map((t) => `
      <div class="task-card">
        <div class="task-card-left">
          <div class="task-card-title">${t.title}</div>
          <div class="task-card-meta">
            <span class="badge badge-${t.priority === 'haute' ? 'haute' : t.priority === 'moyenne' ? 'moyenne' : 'basse'}">${t.priority}</span>
            ${t.project ? `<span style="color:var(--text-muted);font-size:12px">📁 ${t.project.title}</span>` : ""}
            ${t.deadline ? `<span style="color:var(--text-muted);font-size:12px">📅 ${new Date(t.deadline).toLocaleDateString()}</span>` : ""}
          </div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    console.error("Dashboard error:", err);
  }
}
