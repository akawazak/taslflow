async function fetchProjectMembersForAssign(projectId) {
  try {
    const response = await axios.get(`/projects/${projectId}`);
    return [response.data.owner, ...response.data.members];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function assignTaskToMember(taskId, memberId) {
  try {
    const payload = memberId ? { memberId } : { memberId: null };
    const response = await axios.patch(`/tasks/${taskId}/assign`, payload);
    return response.data;
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Erreur");
    throw error;
  }
}

function renderAssignDropdown(taskId, currentAssigneeId, projectMembers) {
  let optionsHtml = `<option value="">-- Non assigné --</option>`;
  
  projectMembers.forEach(member => {
    const isSelected = currentAssigneeId === member._id ? "selected" : "";
    optionsHtml += `<option value="${member._id}" ${isSelected}>${member.fullName}</option>`;
  });

  return `<select class="assign-dropdown" onchange="assignTaskToMember('${taskId}', this.value)">
      ${optionsHtml}
    </select>`;
}

async function fetchMyAssignedTasks() {
  try {
    const response = await axios.get("/tasks/mine");
    return response.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function filterTasksByCurrentUser(tasksArray, currentUserId) {
  return tasksArray.filter(task => 
    task.assignedTo && task.assignedTo._id.toString() === currentUserId.toString()
  );
}
