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
const teams = {
	"fireball": {
		"collisionRule": "never",
		"color": "gold",
		"friendlyFire": "false"
	},
	"deathitem": {
		"color": "aqua"
	},
	"eye": {
		"color": "dark_green"
	}
};
const preload = [
	"minecraft:the_nether", "minecraft:the_end"
]

function serverStartup(server) {
	const sData = server.persistentData;
	if(sData.server_startup) return;
	sData.server_startup = true;

	Object.entries(gameRules).forEach(([rule, value]) => server.gameRules.set(rule, value));

	Object.keys(teams).forEach(team => {
		server.runCommandSilent(`team add ${team}`);
		const info = teams[team];
		Object.keys(info).forEach(setting => server.runCommandSilent(`team modify ${team} ${setting} ${info[setting]}`));
	});

	/* Preload */
	preload.forEach(key => {
		server.runCommandSilent(`execute in ${key} run forceload add 0 0 0 0`);
		server.runCommandSilent(`execute in ${key} run forceload remove all`);
	});

	if(server.isHardcore()) {
		sData.nether_stage = true;
		global.reloadStartupScript()
	};
}