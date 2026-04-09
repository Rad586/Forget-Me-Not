const { keybinds: global_keybinds } = global
Object.keys(global_keybinds).forEach(n => this[n] = false)

function pressedOnce(name) {
    const now_press = global_keybinds[name].isDown();
    const needs_change = now_press && !this[name];
    this[name] = now_press;

    return needs_change
}