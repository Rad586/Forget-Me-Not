function hotbar_totem(e, level, player) {
    const { inventory: inv } = player;
    const slot = inv.find("minecraft:totem_of_undying");
    if ([-1, 40, player.selectedSlot].includes(slot) || slot > 8) return;

    const { potionEffects } = player;
    player.setHealth(1.0);
    potionEffects.add("regeneration", 900, 1, false, true);
    potionEffects.add("fire_resistance", 800, 0, false, true);
    potionEffects.add("absorption", 100, 1, false, true);
    inv.getStackInSlot(slot).shrink(1);

    level.broadcastEntityEvent(player, 35);
    e.cancel()
}