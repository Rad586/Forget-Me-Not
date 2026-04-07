function fish_bone(e) {
	const { block, player } = e;

	global.sound(e.level, player, "block.bone_block.break", 0.5, 1.2);
	block.popItemFromFace("minecraft:bone", e.facing);
	block.set("air");
}

ItemEvents.rightClicked("fishofthieves:fish_bone", e => fish_bone(e))