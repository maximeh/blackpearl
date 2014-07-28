blackpearl
==========

blackpearl is a Google Chrome Extension that kill tabs (the associated process)
but does not close them.
Tabs are killed after some time of inactivity (A time you can configure through
the options of the extension).

This extension is not and never will be on the Chrome Store because it uses the
[experimental api](http://developer.chrome.com/extensions/experimental.html).
You also need to have Chrome on the dev channel.

This preserves your windows and the tabs contained therein, but improves
overall system performance by reducing CPU and (especially) memory consumption.
When you select a killed tab, it will be refreshed to bring it back to life for
you.

Beware that other Chrome Extensions will probably be killed along with tab
rendering processes.

Note: After having the idea, and while looking if it already existed, I found
Peter's Jenkins [jollyroger](https://github.com/funroll/jollyroger). Hence,
blackpearl's name.
Also, this README is very *inspired* by jollyroger's README.

# Installation
Note: This section is a full copy paste from jollyroger's README.

## Enable Experimental Extension APIs
- In a new tab, enter `chrome://flags` in the address bar
- Scroll down to "Experimental Extension APIs"
- Click "Enable"
- Restart Chrome

## Install blackpearl
- Click [here](https://github.com/maximeh/blackpearl/blob/master/blackpearl.crx?raw=true) to download the .crx file
- Click the wrench icon --> Tools --> Extensions
- Drag the downloaded blackpearl.crx file into the body of the Extensions page

Now you're ready to reclaim memory and processing power from tabs you're not
actively using.

