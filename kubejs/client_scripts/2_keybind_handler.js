const { keybinds: global_keybinds } = global
const global_keybinds_keys = Object.keys(global_keybinds)
global_keybinds_keys.forEach(n => this[n + "once"] = false)

function pressedOnce(name, always) {
    const pressing = !always ? 
        global_keybinds[name].isDown() : 
        GLFW.glfwGetKey(
            Client.window.window,
            global_keybinds[name].getKey().getValue()
        ) == 1;
    const needs_change = pressing && !this[name + "once"];
    this[name + "once"] = pressing;

    return needs_change
}


global_keybinds_keys.forEach(n => {
    this[n + "twice_time"] = 0;
    this[n + "twice_hold"] = false;
})

function pressedTwice(name) {
    let result = false;
    const pressing = global_keybinds[name].isDown();

    if (pressing && !this[name + "twice_hold"]) {
        if (Date.now() - this[name + "twice_time"] <= 300) {
            result = true;
            this[name + "twice_time"] = 0
        }
        else this[name + "twice_time"] = Date.now()
    };

    this[name + "twice_hold"] = pressing;
    return result
}