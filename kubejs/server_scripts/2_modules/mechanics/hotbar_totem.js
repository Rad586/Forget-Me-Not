function hotbar_totem(e, level, player) {
    const { inventory: inv } = player;
    const slot = inv.find("totem_of_undying")
    if ([null, 40, player.selectedSlot].includes(slot) || slot > 8) return;

    const { potionEffects } = player;
    player.setHealth(1.0);
    potionEffects.add("regeneration", 900, 1);
    potionEffects.add("fire_resistance", 800, 0);
    potionEffects.add("absorption", 100, 1);
    inv.getStackInSlot(slot).shrink(1);

    level.broadcastEntityEvent(player, 35);
    e.cancel()
}