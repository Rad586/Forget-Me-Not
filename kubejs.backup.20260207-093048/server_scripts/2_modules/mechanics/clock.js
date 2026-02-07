/* Credit: bukkit.org/threads/how-can-i-convert-minecraft-long-time-to-real-hours-and-minutes.122912/\ */
ItemEvents.rightClicked("minecraft:clock", e => {
	const {player} = e;
	const time = player.level.getDayTime() % 24000;
	const hour = Math.floor((time / 1000 + 8) % 24);
	const minute = Math.floor((time % 1000) * 0.06);
	const formattedTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

	player.statusMessage = [Text.translate("dialogue.fmn.time"), formattedTime];
})