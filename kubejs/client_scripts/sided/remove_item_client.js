function removeItem(player) {
    if (GLFW.glfwGetKey(
        Client.window.window,
        global_keybinds["key_remove"].getKey().getValue()) != 1
    ) return;
    const hovered = getHovered(), { slot, stack } = hovered;
    if (!stack || stack.isEmpty()) return;

    player.sendData("remove_item", { slot: slot });
    Client.soundManager.play(
        SimpleSoundInstance.forUI("block.lava.extinguish", 2, 0.12)
    )
}