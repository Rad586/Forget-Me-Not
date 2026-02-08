PlayerEvents.advancement("kubejs:player_attack", e => {
	const { player } = e;
	player.revokeAdvancement("kubejs:player_attack");

    if (!global.Weapons.find(i => i.id == player.mainHandItem.id)) return;
    const delay = player.getCurrentItemAttackStrengthDelay(), mul = delay / 12.5;

	e.server.scheduleInTicks(1, () => {
		const { lastHurtMob } = player;
		if (!lastHurtMob) return;
		const { fallDistance } = player;

		if (fallDistance > 4.76) {
            player.resetFallDistance();
            lastHurtMob.attack(Math.min(fallDistance / 1.2, 10));
			player.setMotionY(0.4);
            player.hurtMarked = true;

			global.particleRing("spread", 6, 0.3, 0, player, "cloud", 3, -0.5);
			global.sound(player, "minecraft:block.wool.break");
		};

        lastHurtMob.invulnerableTime = JavaMath.clamp(
            (delay * 2) - 1, 
            player.hasEffect("strength") ? 10 : 5,
            20
        );

        const { motionX, motionY, motionZ } = lastHurtMob;
        lastHurtMob.setMotion(motionX * mul, motionY, motionZ * mul);
        lastHurtMob.hurtMarked = true
	})
})