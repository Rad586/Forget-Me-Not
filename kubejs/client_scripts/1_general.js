const GLFW = Java.loadClass('org.lwjgl.glfw.GLFW')
const SimpleSoundInstance = Java.loadClass("net.minecraft.client.resources.sounds.SimpleSoundInstance")

function getHovered() {
    const { screen } = Client;
    if (!screen) return Item.empty;
    const { menu } = screen;
    if (!menu) return Item.empty;

    const { window: w, mouseHandler: m } = Client;
    const mouseX = m.xpos() * w.guiScaledWidth / w.screenWidth
    const mouseY = m.ypos() * w.guiScaledHeight / w.screenHeight

    for (let slot of menu.slots) {
        let x = screen.leftPos + slot.x
        let y = screen.topPos + slot.y

        if (mouseX >= x && mouseX < x + 16 &&
            mouseY >= y && mouseY < y + 16
        ) {
            return {
                slot: slot.index,
                stack: slot.getItem()
            }
        }
    }
    return Item.empty
}