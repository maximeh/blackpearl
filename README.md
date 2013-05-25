blackpearl
==========

blackpearl is a Google Chrome Extension that kill tabs (the associated process) but does not close them.
Tabs are killed after some time of inactivity (A time you can configure through the options of the extension).

This extension is not and never will be on the Chrome Store because it uses the [experimental api](http://developer.chrome.com/extensions/experimental.html).

The idea and name came from Peter's Jenkins [jollyroger](https://github.com/funroll/jollyroger).

This preserves your windows and the tabs contained therein, but improves overall system performance by reducing CPU and (especially) memory consumption.
When you select a killed tab, it will be refreshed to bring it back to life for you.

Beware that other Chrome Extensions will probably be killed along with tab rendering processes.

# Installation

## Enable Experimental Extension APIs
- In a new tab, enter `chrome://flags` in the address bar
- Scroll down to "Experimental Extension APIs"
- Click "Enable"
- Restart Chrome

## Install blackpearl
- Click [here](https://github.com/funroll/jollyroger/blob/master/jollyroger.crx?raw=true) to download the .crx file
- Click the wrench icon --> Tools --> Extensions
- Drag the downloaded jollyroger.crx file into the body of the Extensions page

Now you're ready to reclaim memory and processing power from tabs you're not actively using.
