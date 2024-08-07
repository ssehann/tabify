document.getElementById('saveGroup').addEventListener('click', saveTabGroup);

function saveTabGroup() {
  const groupName = document.getElementById('groupName').value;
  if (!groupName) {
    alert('Please enter a group name');
    return;
  }

  chrome.tabs.query({currentWindow: true}, function(tabs) {
    const tabData = tabs.map(tab => ({
      title: tab.title,
      url: tab.url,
      favIconUrl: tab.favIconUrl || 'default-icon-url' // Fallback in case favicon is not available
    }));
    const tabGroup = {
      name: groupName,
      tabs: tabData
    };

    chrome.storage.local.get({tabGroups: []}, function(result) {
      const tabGroups = result.tabGroups;
      tabGroups.push(tabGroup);
      chrome.storage.local.set({tabGroups: tabGroups}, function() {
        document.getElementById('groupName').value = '';
        loadTabGroups();
      });
    });
  });
}
