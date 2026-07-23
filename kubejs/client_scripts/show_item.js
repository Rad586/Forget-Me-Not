const Style = Java.loadClass("net.minecraft.network.chat.Style")
const HoverEvent = Java.loadClass("net.minecraft.network.chat.HoverEvent")
const HoverAction = Java.loadClass("net.minecraft.network.chat.HoverEvent$Action").SHOW_ITEM
const ItemStackInfo = Java.loadClass("net.minecraft.network.chat.HoverEvent$ItemStackInfo")

function stackMessage(stack, player) {
    const hover = new HoverEvent(
        HoverAction,
        new ItemStackInfo(stack)
    )
    return Component
        .literal(!player ? "" : player.name.getString())
        .append(Text.translate("dialogue.fmn.showitem"))
        .append(stack.displayName)
        .setStyle(Style.EMPTY.withHoverEvent(hover))
}
function showItem(player, hovered) {
    if (!pressedOnce("key_show", true)) return;
    const { stack } = hovered;

    Utils.server.tell(stackMessage(stack, player));
    uiSound("ui.button.click", 0.2, 1.1)
}