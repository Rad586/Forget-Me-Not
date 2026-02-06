PlayerEvents.advancement("kubejs:respawn_dragon", e => {
	const {server} = e;
	server.persistentData.ender_dragon = false;
	server.runCommandSilent("kjs reload startup_script");
})