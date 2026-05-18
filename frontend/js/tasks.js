async function filterTasks(page = 1) {

    const search =
        document.getElementById("search-tasks").value;

    const status =
        document.getElementById("filter-status").value;

    const priority =
        document.getElementById("filter-priority").value;

    const assignedTo =
        document.getElementById("filter-member").value;

    const response = await api.get(
        `/projects/${currentProjectId}/tasks`,
        {
            params: {
                search,
                status,
                priority,
                assignedTo,
                page,
                limit: 5
            }
        }
    );

    renderTasks(response.data.data);

    renderPagination(response.data);
}
function renderPagination(data) {

    const container =
        document.getElementById("pagination-controls");

    container.innerHTML = "";

    for(let i = 1; i <= data.totalPages; i++) {

        container.innerHTML += `
            <button onclick="filterTasks(${i})">
                ${i}
            </button>
        `;
    }
}