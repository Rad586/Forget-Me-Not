LootJS.modifiers(e => {
	entity_drop_check(e);
	copper_nuker(e);
	global_modifiers(e);
	block_variant_unify(e);
	ore_bonus(e);
	flame_effect(e);
	released_fish(e);
	midas_curse(e);
	deepslate_bonus(e);
	// reveal_system(e);
	haunting(e);
	conditional_drops(e);
	iron_golem(e);
	item_toss(e)
	golden_tool(e)
})