var tab_array = [];
var TIMEOUT_TIMER = localStorage["timer"];
if (typeof TIMEOUT_TIMER === "undefined") TIMEOUT_TIMER = 15;

window.addEventListener("storage", update_storage, false);
chrome.alarms.create({periodInMinutes: 1.0});

// When users changes the options, update the timer value
function update_storage(event_storage) {
    if (event_storage.key !== "timer") return;
    TIMEOUT_TIMER = event_storage.new_value;
}

function findById(source, id) {
    return source.filter(function( obj ) {
        // coerce both obj.id and id to numbers
        // for val & type comparison
        return +obj.id === +id;
    })[ 0 ];
}

// On startup, get all tabs already created
chrome.windows.getAll({populate: true}, function (windows){
    windows.forEach(function(cwindow) {
        cwindow.tabs.forEach(function(tab) {
            if (tab.url.indexOf('chrome://') == 0 || tab.url.indexOf('chrome-extension://') == 0)
                            return;
            tab_array.push({id: tab.id, timer: 0, killed: false });
        });
    });
});

// Every time a tab is activated, its timer must be reset.
chrome.tabs.onActivated.addListener(function(activeInfo) {
    var activated_tab = findById(tab_array, activeInfo.tabId);
    if ( typeof activated_tab === "undefined") return;
    activated_tab.timer = 0;
    if (activated_tab.killed){
        // Reload the killed tab, since its activated
        chrome.tabs.reload(activated_tab.id);
        activated_tab.killed = false;
    }
});

// Add a new object to tab_array
chrome.tabs.onCreated.addListener(function(tab) {
    if (tab.url.indexOf('chrome://') == 0 || tab.url.indexOf('chrome-extension://') == 0) return;
    tab_array.push({id: tab.id, timer: 0, killed: false });
});

// Remove the tab from tab_array
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    var removed = findById(tab_array, tabId);
    var idx_removed = tab_array.indexOf(removed);
    if(idx_removed != -1) {
        tab_array.splice(idx_removed, 1);
    }
});

chrome.alarms.onAlarm.addListener(function() {
    // Loop through each tab, to increment its timer
    tab_array.forEach( function(tab) {
        chrome.tabs.get(tab.id, function(ctab) {
            // Do not update the timer of the active tab
            // or if the tab is already marked as killed.
            if (ctab.active || tab.killed) return;
            tab.timer += 1;
            // If the tab's timer has gone out, kill it.
            if (tab.timer >= TIMEOUT_TIMER) {
                chrome.experimental.processes.getProcessIdForTab(tab.id, function(processId) {
                    chrome.experimental.processes.terminate(processId);
                });
                tab.killed = true;
            }
        });
    });
});

