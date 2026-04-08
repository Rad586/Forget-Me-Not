/* fixes modded stuff not being loaded early */
ClientEvents.loggedIn(e => global.reloadClientScript())