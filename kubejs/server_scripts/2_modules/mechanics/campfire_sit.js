/* Idea from Prunoideae(https://discord.com/channels/303440391124942858/1296026113042026496) */
["minecraft:campfire", "minecraft:soul_campfire"].forEach(key =>
	BlockEvents.rightClicked(key, e => {
		if (e.hand == "off_hand") return;

		const { player, block } = e;
		if (!player.isOnGround() ||
			!CampfireBlock.isLitCampfire(block.getBlockState()) ||
			player.distanceToSqr(block.pos) < 1 ||
			player.vehicle ||
			player.isCrouching() ||
			!player.mainHandItem.isEmpty()
		) return;

		const dummy = e.level.createEntity("kubejs:dummy");
		dummy.copyPosition(player);
		dummy.spawn();
		player.startRiding(dummy);

		e.cancel();
	})
)