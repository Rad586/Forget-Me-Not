const int_of_10 = Java.loadClass("java.lang.Integer").valueOf("10")
let timeout = 0

function dynamicFps() {
    const framerateLimit = Client.options.framerateLimit();
    const new_limit = framerateLimit.get();
    const low = new_limit == 10;

    if (!Client.isWindowActive()) {
        timeout++
        if (!low && timeout > 8) {
            global.old_limit = new_limit;
            framerateLimit.set(int_of_10);
            timeout = 0
        }
    }
    else if (low && global.old_limit && global.old_limit != new_limit) {
        framerateLimit.set(global.old_limit)
    }
}

/* prevent leaving game unfocused to make old_limit initially being 10 */
ClientEvents.loggedOut(e => framerateLimit.set(global.old_limit))