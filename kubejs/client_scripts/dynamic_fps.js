function revertFps(framerateLimit) {
    if (!global[limit_old]) return;
    
    framerateLimit.set(global[limit_old]);
    [dynfpsing, limit_old].forEach(i => global[i] = false)
}
function decreaseFps(framerateLimit) {
    if (!global[dynfpsing]) global[limit_old] = limit_now;
    global[dynfpsing] = true;

    framerateLimit.set(global.toInt(
        Math.max(10, limit_now - 10)))
}

function dynamicFps() {
    const framerateLimit = Client.options.framerateLimit();
    if (!Client.isWindowActive()) {
        if (framerateLimit.get() != 10) {
            decreaseFps(framerateLimit)
        }
    }
    else if (framerateLimit.get() != global[limit_old]) {
        revertFps(framerateLimit)
    }
}

/* prevent leaving game unfocused to make limit_old initially being 10 */
ClientEvents.loggedOut(e => revertFps(Client.options.framerateLimit()))