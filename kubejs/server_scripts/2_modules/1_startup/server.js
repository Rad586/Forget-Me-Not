const gameRules = {
	"announceAdvancements": false,
	"doFireTick": false,
	"doInsomnia": false,
	"showDeathMessages": false,
	"doTraderSpawning": false,
	"elytraMovementCheckEnabled": false,
	"randomTickSpeed": "2",
	"spawnRadius": "0"
}

function serverStartup(server) {
	const sData = server.persistentData;
	if(sData.server_startup) return;
	sData.server_startup = true;

	Object.entries(gameRules).forEach(([rule, value]) => server.gameRules.set(rule, value));

	const { scoreboard } = server;
	const team = scoreboard.addPlayerTeam("deathitem");
	team.setColor("aqua");

	if(server.isHardcore()) {
		sData.nether_stage = true;
		global.reloadStartupScript()
	}
}