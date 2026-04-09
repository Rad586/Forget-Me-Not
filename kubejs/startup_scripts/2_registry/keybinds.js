/* credit: EnigmaQuip(https://discord.com/channels/303440391124942858/1048591172165189632/threads/1127437140582735904) */
ClientEvents.init(e => {
    const KeyMappingRegistry = Java.loadClass('dev.architectury.registry.client.keymappings.KeyMappingRegistry');
    const KeyMapping = Java.loadClass('net.minecraft.client.KeyMapping');
    const GLFW = Java.loadClass('org.lwjgl.glfw.GLFW');

    const custom_keys = {
        "key_glide": GLFW.GLFW_KEY_SPACE
    };
    global.keybinds = {};

    Object.keys(custom_keys).forEach(name => {
        const keybind = new KeyMapping(
            "key.kubejs." + name,
            custom_keys[name],
            "key.categories.kubejs"
        );
        global.keybinds[name] = keybind;
        KeyMappingRegistry.register(keybind)
    })
})