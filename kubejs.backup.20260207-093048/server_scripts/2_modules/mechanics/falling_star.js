PlayerEvents.advancement("kubejs:overworld", e => {
	const {player, level} = e;
	player.revokeAdvancement("kubejs:overworld");

	if(Math.random() > 0.1 || !level.isNight()) return;
	if(player.block.skyLight > 0 || isNearHome(player, 384)) return;

	const currentDay = Math.floor(level.getDayTime() / 24000);
	const {persistentData: pData} = e.server;
	const {starTime} = pData;

	if(starTime != null && starTime > currentDay - 6) return;
	pData.starTime = currentDay;


	let {x, y, z} = player;

	const playerAngle = Math.random() * 6.28;
	x += 48 * Math.cos(playerAngle);
	z += 48 * Math.sin(playerAngle);

	const starAngle = Math.random() * 6.28;
	const ex = Math.cos(starAngle);
	const ez = Math.sin(starAngle);

	const star = level.createEntity("kubejs:falling_star");
	star.setPosition(x, y+140, z);
	star.setMotion(ex, 0, ez);
	star.spawn();

	player.unlockAdvancement("kubejs:tip/falling_star")
})