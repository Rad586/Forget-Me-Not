global.preys = { /* only slime mobs are naturally targeted for performance */
	"minecraft:slime": 1, "minecraft:magma_cube": 0.75,
	"minecraft:villager": 2, "minecraft:snow_golem": 2,
	"guardvillagers:guard": 5
};
global.evolutionMap = {
	/* Evolution 1 */
	"minecraft:zombie": [
		"rottencreatures:burned", "rottencreatures:frostbitten",
		"rottencreatures:swampy", "minecraft:skeleton",
		"rottencreatures:flying_scarab", "rottencreatures:zap",
		"minecraft:husk", "minecraft:pillager"
	],

	"minecraft:skeleton": [
		"skeletalremains:sharpshooterskeleton", "minecraft:zombie"
	],

	"minecraft:spider": ["minecraft:cave_spider", "scorpions:brown_scorpion"],

	"minecraft:hoglin": ["minecraft:piglin"],

	/* Evolution 2 */
	"minecraft:husk": ["rottencreatures:burned"],
	"rottencreatures:swampy": ["minecraft:witch"],
	"rottencreatures:burned": ["minecraft:blaze", "skeletalremains:charredskeleton"],
	"rottencreatures:flying_scarab": [
		"rottencreatures:mummy", "minecraft:phantom",
		"minecraft:vex"
	],
	"rottencreatures:frostbitten": ["rottencreatures:glacial_hunter"],

	"skeletalremains:sharpshooterskeleton": [
		"skeletalremains:charredskeleton", "skeletalremains:fallenskeleton",
		"skeletalremains:overgrownskeleton", "minecraft:stray"
	],
	"skeletalremains:swampedskeleton": [
		"skeletalremains:charredskeleton", "skeletalremains:fallenskeleton",
		"skeletalremains:overgrownskeleton"
	],

	"minecraft:cave_spider": ["betteranimalsplus:tarantula", "scorpions:emperor_scorpion"],
	"scorpions:brown_scorpion": ["scorpions:emperor_scorpion"],

	"minecraft:piglin": ["minecraft:piglin_brute"],

	"minecraft:pillager": [
		"minecraft:vindicator",
		"illagerexp:archivist", "illagerexp:firecaller",
		"illagerexp:basher", "illagerexp:marauder",
		"illagerexp:surrendered", "takesapillage:skirmisher"
	],

	/* Evolution 3 */
	"skeletalremains:charredskeleton": ["minecraft:wither_skeleton", "minecraft:blaze"],

	"scorpions:emperor_scorpion": ["scorpions:nether_scorpion"],

	"minecraft:witch": [
		"minecraft:illusioner", "illagerexp:sorcerer",
		"illagerexp:provoker"
	],
	"illagerexp:marauder": ["takesapillage:legioner", "illagerexp:inquisitor"],
	"takesapillage:skirmisher": ["takesapillage:legioner", "illagerexp:inquisitor"],
	"illagerexp:surrendered": ["minecraft:vex"],
	"illagerexp:basher": ["minecraft:vindicator", "takesapillage:legioner"],
	"illagerexp:archivist": [
		"illagerexp:firecaller", "minecraft:illusioner",
		"illagerexp:sorcerer", "minecraft:witch"
	],
	"illagerexp:firecaller": ["minecraft:evoker"],
	"minecraft:vindicator": ["illagerexp:inquisitor"],

	/* Evolution 4 */
	"minecraft:illusioner": ["minecraft:evoker"],
	"illagerexp:sorcerer": ["minecraft:evoker"],
	"illagerexp:provoker": ["minecraft:evoker"]
};
const keys_in_evolution = Object.keys(global.evolutionMap);
function evolution(nether_stage, actual, score) {
	if(!nether_stage || !actual || actual.level.isClientSide()) return;
	const {type} = actual, data = global.evolutionMap[type];
	if(!data || actual.age < 60) return;

	const {persistentData: pData} = actual, {evolution} = pData;
	score = score || 5;

	const result = evolution ? evolution+score : score;
	pData.evolution = result
	if(result < 5) return;

	const evoluted = actual.level.createEntity(global.randomSelect(data));
	evoluted.copyPosition(actual);
    if(evoluted instanceof CrossbowAttackMob) evoluted.setMainHandItem("minecraft:crossbow");
	else if(evoluted instanceof RangedAttackMob) evoluted.setMainHandItem("minecraft:bow");
	evoluted.spawn();

	server.scheduleInTicks(10, () => {
        evoluted.extinguish();
        evoluted.setHealth(100);
    });

	global.particleBurst(actual, "cloud", 10, 0.05);
	actual.playSound("lunaslimes:entity.slime.merge", 1.2, 1.1);
	actual.discard();
}