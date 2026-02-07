ServerEvents.commandRegistry(e => {
	const { commands: Commands, arguments: Arguments } = e;
	e.register(Commands.literal("toggleLimitedLives")
		.requires(src => src.hasPermission(2))
		.executes(c => {
			const { player } = c.source;
			const { stages, server, username } = player;
			if (stages.has("no_limited_lives")) { /* on */
				stages.remove("no_limited_lives");
				server.tell(username + Text.translate("dialogue.fmn.limited_lives").getString());
			}
			else { /* off */
				stages.add("no_limited_lives");
				server.tell(username + Text.translate("dialogue.fmn.no_limited_lives").getString());
			};
			global.updateMaxHealth(player);

			return 1
		}))

	e.register(Commands.literal("toggleEntityDrop")
		.requires(src => src.hasPermission(2))
		.executes(c => {
			const { player } = c.source;
			const { server, username } = player;
			const { persistentData: pData } = server;
			if (!pData.entity_drop) { /* off, doesn't require player kill */
				pData.entity_drop = true;
				entity_drop = true;
				server.tell(username + Text.translate("dialogue.fmn.entity_drop").getString());
			}
			else { /* on */
				pData.entity_drop = false;
				entity_drop = false;
				server.tell(username + Text.translate("dialogue.fmn.no_entity_drop").getString());
			};

			return 1
		}))

	e.register(Commands.literal("toggleTrade")
		.requires(src => src.hasPermission(2))
		.executes(c => {
			const { player } = c.source;
			const { server, username } = player;
			const { persistentData: pData } = server;
			if (!pData.trade) { /* off, remove trade lock */
				pData.trade = true;
				trade = true;
				server.tell(username + Text.translate("dialogue.fmn.trade").getString());
			}
			else { /* on */
				pData.trade = false;
				trade = false;
				server.tell(username + Text.translate("dialogue.fmn.no_trade").getString());
			};

			return 1
		}))

	e.register(Commands.literal("toggleHaunting")
		.requires(src => src.hasPermission(2))
		.executes(c => {
			const { player } = c.source;
			const { server, username } = player;
			const { persistentData: pData } = server;
			if (!pData.haunting) { /* off, no haunting */
				pData.haunting = true;
				global.haunting = true;
				server.tell(username + Text.translate("dialogue.fmn.haunting").getString());
			}
			else { /* on */
				pData.haunting = false;
				global.haunting = false;
				server.tell(username + Text.translate("dialogue.fmn.no_haunting").getString());
			};

			return 1
		}))

	e.register(Commands.literal("togglePickup")
		.requires(src => src.hasPermission(1))
		.executes(c => {
			const { player } = c.source, {persistentData: pData} = player;
			const {auto_pickup} = pData, status = !(auto_pickup == null ? true : auto_pickup);
			pData.auto_pickup = status;
			player.sendData("auto_pickup", {status: status});
			return 1
		}))

	e.register(Commands.literal("rollArmorSet")
		.requires(src => src.hasPermission(1))
		.executes(c => {
			const { player } = c.source, { persistentData: pData } = player;
			const { armor_sets, sets_i } = pData;

			const new_set = [];
			player.armorSlots.forEach(a => new_set.push(a));
			pData.armor_sets[sets_i] = new_set.reverse();

			const i = sets_i == 2 ? 0 : sets_i + 1;
			const next_set = armor_sets[i];
			pData.sets_i = i

			const s0 = next_set[0], s1 = next_set[1],
				s2 = next_set[2], s3 = next_set[3];
			player.setHeadArmorItem(Item.of(s0.id, s0.tag));
			player.setChestArmorItem(Item.of(s1.id, s1.tag));
			player.setLegsArmorItem(Item.of(s2.id, s2.tag));
			player.setFeetArmorItem(Item.of(s3.id, s3.tag));

			player.sendData("armor_set", { num: i })

			return 1
		}))
})