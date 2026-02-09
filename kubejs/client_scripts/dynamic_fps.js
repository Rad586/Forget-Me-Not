const int_of_10 = Java.loadClass("java.lang.Integer").valueOf("10")
let timeout = 0, identifier

function dynamicFps(player) {
    const framerateLimit = Client.options.framerateLimit();
    const new_limit = framerateLimit.get();
    const low = new_limit == 10;
    identifier = "old_limit" + player.getStringUuid().substring(0, 8);

    if (!Client.isWindowActive()) {
        timeout++
        if (!low && timeout > 8) {
            global[identifier] = new_limit;
            framerateLimit.set(int_of_10);
            timeout = 0
        }
    }
    else if (low && global[identifier] && global[identifier] != new_limit) {
        framerateLimit.set(global[identifier])
    }
}

/* prevent leaving game unfocused to make old_limit initially being 10 */
/* have to null check, client somehow logs out on joining world after launch */
ClientEvents.loggedOut(e => {
    const value = global[identifier];
    if (value) Client.options.framerateLimit().set(value)
})