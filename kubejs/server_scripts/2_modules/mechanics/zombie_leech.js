function zombie_leech(attacker, final_dmg) {
    if (!(attacker instanceof Zombie)) return;
    attacker.heal(final_dmg)
}