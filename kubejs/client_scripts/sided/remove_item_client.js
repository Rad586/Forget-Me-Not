function removeItem(player, hovered) {
    if (GLFW.glfwGetKey(
        Client.window.window,
        global_keybinds["key_remove"].getKey().getValue()) != 1
    ) return;

    const { slot } = hovered;
    player.sendData("remove_item", { slot: slot });

    uiSound("block.lava.extinguish", 0.12, 2)
}