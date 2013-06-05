/*
 Author:     Maxime Hadjinlian
             maxime.hadjinlian@gmail.com
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
    derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var tab_array = [];
var forbidden_url = ["chrome://", "chrome-extension://", "chrome-devtools://"];
var TIMEOUT_TIMER = localStorage["timer"];
if (typeof TIMEOUT_TIMER === "undefined") TIMEOUT_TIMER = 15;

window.addEventListener("storage", update_storage, false);
chrome.alarms.create({periodInMinutes: 1.0});

// When users changes the options, update the timer value
function update_storage(event_storage) {
    if (event_storage.key !== "timer") return;
    TIMEOUT_TIMER = event_storage.new_value;
}

// Returns true if a url is forbidden, false otherwise
function is_forbidden(url) {
    var found = false;
    forbidden_url.forEach(function(f_url) {
        if (url.indexOf(f_url) == 0)
            found = true;
    });
    return found;
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
            if (is_forbidden(tab.url) == true) return;
            tab_array.push({id: tab.id, timer: 0, killed: false });
        });
    });
});

// When a tab gets a suitable URL and is not already in our array, add it.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (is_forbidden(tab.url) == true) return;
    // If the tab is not already in our array, add it.
    var new_tab = findById(tab_array, tabId);
    if ( typeof new_tab !== "undefined") return;
    tab_array.push({id: tabId, timer: 0, killed: false });
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

