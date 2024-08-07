function loadTabGroups() {
    chrome.storage.local.get({tabGroups: []}, function(result) {
      const tabGroups = result.tabGroups;
      const groupList = document.getElementById('groupList');
      groupList.innerHTML = '';
  
      tabGroups.forEach((group, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item group-list-item';
        li.textContent = group.name;
        li.addEventListener('click', () => editTabGroup(index));
        groupList.appendChild(li);
      });
    });
  }
  