["minecraft:ender_pearl", "kubejs:recovery_pearl"].forEach(key => {
	ItemEvents.rightClicked(key, e => {
		const {player} = e;
		if(!player.isInWaterOrRain()) return;

		player.statusMessage = Text.translate("dialogue.fmn.ender_pearl");
		e.cancel();
	})
})