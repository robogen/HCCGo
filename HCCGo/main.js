'use strict';

const {app, BrowserWindow} = require('electron');
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
                    { "jobs" : [] },
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

    mainWindow.on('closed', function() {
        mainWindow = null;
        app.quit();
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});
