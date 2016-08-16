'use strict';

const {app, BrowserWindow} = require('electron');
const {ipcMain} = require('electron');
const storage = require('electron-json-storage');

let mainWindow = null;
require('electron-debug')({showDevTools: false});

storage.has('clusters', function(error, hasKey) {
    if (error) {
        console.log(error);
    }

    if (!hasKey) {
        storage.set('clusters',
                    [{
                        'label': 'Crane',
                        'url': 'crane.unl.edu',
                        'type': 'slurm'
                    },
                    {
                        'label': 'Tusker',
                        'url': 'tusker.unl.edu',
                        'type': 'slurm'
                    },
                    {
                        'label': 'Sandhills',
                        'url': 'sandhills.unl.edu',
                        'type': 'slurm'
                    },
                    {
                        'label': 'Glidein',
                        'url': 'glidein.unl.edu',
                        'type': 'condor'
                    }],
                    function(error) {
                        if (error) {
                            console.log(error);
                        }
                    });
    }

});

storage.has('jobHistory', function(error, hasKey) {
    if (error) {
        console.log(error);
    }

    if(!hasKey) {
        storage.set('jobHistory', 
                    { "jobs" : [
                      {
                        "id": 0,
                        "runtime": "3:00:00",
                        "memory": "1024",
                        "jobname": "jobTemplate",
                        "location": "/work/group/user/template.slurm",
                        "error": "/work/group/user/template.err",
                        "output": "/work/group/user/template.out",
                        "modules": ["R/3.0"],
                        "commands": "echo hello",
                        "timestamp": 1454364814000
                      }
                    ] },
                    function(error) {
                        if (error) {
                            console.log(error);
                        }
                    });
    }
});

storage.has('settings', function(error, hasKey) {
    if (error) {
        console.log(error);
    }
    
    if(!hasKey) {
        storage.set('settings',
		            {
			          "debug": false
			        },
					function(error) {
					  if (error) {
					      console.log(error);
					  }
					});
    }
});

app.on('ready', function() {

    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800
    });
	
	ipcMain.on('focus-check-reply', (event, arg) => {
	    console.log("Checking if app has focus");
		event.sender.send('focus-check-message', mainWindow.isFocused());
	});

    mainWindow.on('closed', function() {
        mainWindow = null;
        app.quit();
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});
