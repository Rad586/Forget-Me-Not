const SwordItem = Java.loadClass("net.minecraft.world.item.SwordItem")
function amethystEnchant(player, carried, hovered) {
    Utils.server.tell(carried.is("amethyst_shard"))
    if (!carried.is("amethyst_shard") ||
        !(hovered.stack.item instanceof SwordItem)) return;

    player.sendData("amethyst", { 
        slot: hovered.slot,
        shift: GLFW.glfwGetKey(
            Client.window.window,
            GLFW.GLFW_KEY_LEFT_SHIFT
        ) == 1
    });
    uiSound("block.amethyst_block.break", 0.3)
}