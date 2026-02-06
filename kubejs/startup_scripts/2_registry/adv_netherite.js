/* priority: 5 */
const weaponTypes = ["scythe", "spear", "glaive", "cutlass", "claymore", "twinblade", "rapier", "sai", "katana", "warglaive", "greataxe", "longsword", "chakram", "greathammer"];
const speeds = [-2.7, -2.7, -2.6, -2, -2.8, -1.7, -1.6, -1.1, -2, -2.2, -3.4, -2.4, -3, -3.4];
const netheriteIronAttackDamages = [4, 3, 3, 3, 5, 3, 2, 0, 3, 3, 6, 3, 2, 9];
const netheriteGoldAttackDamages = [5.125, 4, 4, 4, 6.125, 4, 2.875, 0.625, 4, 4, 7.375, 4, 2.875, 10.75];
const netheriteEmeraldAttackDamages = [6.25, 5, 5, 5, 7.5, 5, 3.75, 1.25, 5, 5, 8.75, 5, 7.75, 12.5];
const netheriteDiamondAttackDamages = [7.375, 6, 6, 6, 8.75, 6, 4.625, 1.875, 6, 6, 10.125, 6, 4.625, 14.25];

function registerItems(e, tier, weaponTypes, attackDamages, speeds) {
	weaponTypes.forEach((weaponType, index) => {
		const name = `${tier}_${weaponType}`;
		const attackDamage = attackDamages[index];
		const speed = speeds[index];
		e.create(name, "sword").tier(tier).attackDamageBaseline(attackDamage).speedBaseline(speed).fireResistant(true);
	})
}

StartupEvents.registry("item", e => {
	registerItems(e, "netherite_iron", weaponTypes, netheriteIronAttackDamages, speeds);
	registerItems(e, "netherite_gold", weaponTypes, netheriteGoldAttackDamages, speeds);
	registerItems(e, "netherite_emerald", weaponTypes, netheriteEmeraldAttackDamages, speeds);
	registerItems(e, "netherite_diamond", weaponTypes, netheriteDiamondAttackDamages, speeds);
	registerItems(e, "dragon", weaponTypes, netheriteEmeraldAttackDamages, speeds);
})