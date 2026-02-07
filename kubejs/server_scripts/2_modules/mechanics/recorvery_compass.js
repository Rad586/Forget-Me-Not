const dist_msg = Text.translate("dialogue.fmn.dist1").getString();
ItemEvents.rightClicked("minecraft:recovery_compass", e => {
	const { player } = e, info = player.nbt.LastDeathLocation;
	if (!info || e.level.dimension != info.dimension) return;

	const { y } = player, { pos } = info, pos_y = pos[1];
	const dist = player.distanceToSqr(
		new Vec3(
			pos[0], pos_y, pos[2]
		)
	);
	const direction = pos_y > y + 0.99 ?
		"↑" : pos_y < y - 0.99 ?
			"↓" : "";

	player.statusMessage = [dist_msg, Math.pow(dist, 0.5).toFixed(1), direction];
})