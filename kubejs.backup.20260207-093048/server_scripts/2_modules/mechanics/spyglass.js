/* Idea from Useful Spyglass(https://www.curseforge.com/minecraft/mc-mods/useful-spyglass) */
ItemEvents.rightClicked("minecraft:spyglass", e => {
	const {player, server} = e;
	const rayTrace = global.advancedRayTraceEntity;

	server.scheduleInTicks(5, c => {
		if(!player.isScoping()) return;
		c.reschedule();

		const result = rayTrace(player, 80);
		if(!result || !result.isLiving()) return;

		const {health, maxHealth, armorValue} = result;
		const attackDamage = result.getAttribute("minecraft:generic.attack_damage");

		const healthInfo = `❤${health.toFixed(0)}/${maxHealth.toFixed(0)}`;
		const armorInfo = armorValue == 0 ? "" : ` 🛡${armorValue}`;
		const damageInfo = attackDamage == null ? "" : ` ⚔${attackDamage.getValue()}`;

		const neutral = result instanceof NeutralMob, monster = result.isMonster();
		const color = neutral ? "§e" : (monster ? "§c" : "§a");

		player.setStatusMessage(color + result.name.getString() + " (" + healthInfo + armorInfo + damageInfo + ")");
	})
})