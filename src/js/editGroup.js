let currentEditIndex = -1;

function editTabGroup(index) {
    currentEditIndex = index;
    chrome.storage.local.get({tabGroups: []}, function(result) {
        const tabGroup = result.tabGroups[index];
        document.getElementById('editGroupName').value = tabGroup.name;
        const tabList = document.getElementById('tabList');
        tabList.innerHTML = '';

        tabGroup.tabs.forEach((tab, tabIndex) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';

            const a = document.createElement('a');
            a.href = tab.url;
            a.textContent = tab.title;
            a.target = '_blank';

            const img = document.createElement('img');
            img.src = tab.favIconUrl || 'default-icon-url'; // Fallback in case favicon is not available

            const tabItem = document.createElement('div');
            tabItem.classList.add('tab-item');
            tabItem.appendChild(img);
            tabItem.appendChild(a);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger btn-sm ml-2'; // Added margin to separate button
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTabFromGroup(index, tabIndex));

            tabItem.appendChild(deleteBtn);
            li.appendChild(tabItem);
            tabList.appendChild(li);
        });

        document.getElementById('restoreAll').onclick = () => restoreAllTabs(tabGroup.tabs); // Bind the restore function
        document.getElementById('editGroup').style.display = 'block';
    });
}
function restoreAllTabs(tabs) {
   const urls = tabs.map(tab => tab.url);
   chrome.windows.create({url: urls}); // Opens all tabs in a new window
}
document.getElementById('updateGroup').addEventListener('click', updateTabGroup);
document.getElementById('deleteGroup').addEventListener('click', deleteTabGroup);

function updateTabGroup() {
    const newGroupName = document.getElementById('editGroupName').value;
    if (!newGroupName) {
        alert('Please enter a group name');
        return;
    }

    chrome.storage.local.get({tabGroups: []}, function(result) {
        const tabGroups = result.tabGroups;
        tabGroups[currentEditIndex].name = newGroupName;
        chrome.storage.local.set({tabGroups: tabGroups}, function() {
            loadTabGroups();
        });
    });
}

function deleteTabFromGroup(groupIndex, tabIndex) {
    chrome.storage.local.get({tabGroups: []}, function(result) {
        const tabGroups = result.tabGroups;
        tabGroups[groupIndex].tabs.splice(tabIndex, 1);

        chrome.storage.local.set({tabGroups: tabGroups}, function() {
            editTabGroup(groupIndex); // Refresh the edit view
        });
    });
}

function deleteTabGroup() {
    chrome.storage.local.get({tabGroups: []}, function(result) {
        const tabGroups = result.tabGroups;
        tabGroups.splice(currentEditIndex, 1); // Remove the group

        chrome.storage.local.set({tabGroups: tabGroups}, function() {
            loadTabGroups(); // Refresh the group list
            document.getElementById('editGroup').style.display = 'none'; // Hide edit mode
        });
    });
}

function addTabToGroup() {
    const newTabTitle = document.getElementById('newTabTitle').value;
    const newTabUrl = document.getElementById('newTabUrl').value;

    if (!newTabTitle || !newTabUrl) {
        alert('Please enter both tab title and URL');
        return;
    }

    chrome.storage.local.get({tabGroups: []}, function(result) {
        const tabGroups = result.tabGroups;
        tabGroups[currentEditIndex].tabs.push({
            title: newTabTitle,
            url: newTabUrl,
            favIconUrl: 'default-icon-url' // Default icon for manually added tabs
        });

        chrome.storage.local.set({tabGroups: tabGroups}, function() {
            editTabGroup(currentEditIndex); // Refresh the edit view
        });
    });
}
