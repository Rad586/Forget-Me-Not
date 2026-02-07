ItemEvents.rightClicked("minecraft:gunpowder", e => {
	const { target: { entity }, player } = e;
	if (!(entity instanceof PrimedTnt)) return;

	const { Fuse } = entity.nbt;
	const final = Fuse + 30;
	entity.mergeNbt({ Fuse: final });

	player.swing();
	global.sound(player, "minecraft:block.wooden_button.click_on", 0.3, 1.2)

	const tip = Text.translate("dialogue.fmn.gunpowder").getString();
	player.statusMessage = tip + (final / 20).toFixed(1) + "s";
	e.cancel()
})