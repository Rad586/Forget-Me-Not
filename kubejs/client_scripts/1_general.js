const GLFW = Java.loadClass('org.lwjgl.glfw.GLFW')
const SimpleSoundInstance = Java.loadClass("net.minecraft.client.resources.sounds.SimpleSoundInstance")

function getHovered() {
    const { screen } = Client;
    if(!screen) return;

    const { hoveredSlot } = screen;
    if (!hoveredSlot) return;

    const { item } = hoveredSlot;
    if(item.isEmpty()) return;

    return {
        stack: item,
        slot: hoveredSlot.index
    }
}

function uiSound(sound, volume, pitch) {
    Client.soundManager.play(
        SimpleSoundInstance.forUI(sound, pitch || 1, volume || 1)
    )
}

function hoveredRc(player, hovered, func) {
    const { carried } = player.containerMenu;
    if (carried.isEmpty() || !mousePressedOnce("GLFW_MOUSE_BUTTON_RIGHT")) return;

    func(player, carried, hovered)
}