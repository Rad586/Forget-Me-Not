const lang_map1 = {
	"": ["Acacia", "金合欢木"],
	"weathered_": ["Prismarine", "海晶石"],
	"exposed_": ["Jungle", "丛林木"], 
	"oxidized_": ["Warped", "诡异木"]
}
const lang_map2 = {
	"": ["Planks", "板"],
	"_stairs": ["Stairs", "楼梯"],
	"_slab": ["Slab", "台阶"]
}
const effects = {
	"invincible":"无敌",
	"blast_immunity":"爆炸免疫",
	"frost_walker":"冰霜行者",
	"thorns":"荆棘",
	"soft_landing":"软着陆",
	"channeling":"引雷",
	"oozing":"渗浆",
	"burning":"灼烧",
	"fire_aspect":"火焰附加",
	"soul_fire_aspect":"魂焰附加",
	"poison_aspect":"剧毒附加",
	"freeze_aspect":"寒冷附加",
	"knockback_aspect":"击退附加",
	"soul_burning":"灵魂灼烧",
	"smite":"亡灵杀手",
	"bane_of_arthropods":"节肢杀手",
	"sweeping_edge":"横扫之刃",
	"loyalty":"忠诚",
	"vanishing_curse":"消失诅咒",
	"ignition":"点燃",
	"soul_ignition":"灵魂点燃",
	"binding_curse":"绑定诅咒",
	"flame":"火矢",
	"soul_flame":"灵魂火矢",
	"repulsion":"斥力",
	"pull":"吸力",
	"purity":"净化",
	"caustic_ooze":"腐蚀污泥",
	"vulnerability":"易伤",
	"mind_vision":"灵视",
	"charging":"充能",
	"aquatic_healing":"水灵治疗",
	"thunderbrand":"雷电之力",
	"vertigo":"眩晕",
	"camouflage":"迷彩",
	"annoying_curse":"喧闹诅咒",
	"bounce":"弹力",
	"metabolism_curse":"代谢诅咒",
	"stench_curse":"恶臭诅咒",
	"anti_entropy_curse":"反熵诅咒",
	"beheading_curse":"枭首诅咒",
	"overflow_curse":"漫溢诅咒",
	"blessed":"神护",
	"outcast_curse":"被弃者诅咒",
	"affection":"魅惑",
	"mountain_king":"山丘之王",
	"dueling":"决斗",
	"giant_slayer":"巨人杀手",
	"kinetics":"动能",
	"transfer_curse":"转移诅咒",
	"beheading":"枭首",
	"lethal":"轻装上阵",
	"challenger":"挑战者",
	"strike":"对空杀手",
	"exorcism":"附魔杀手",
	"breach":"破甲",
	"luna":"月神",
	"shocking":"连锁闪电",
	"destruction_curse":"毁灭诅咒",
	"arcane_armor":"奥术护甲",
	"impaling":"穿刺",
	"rampaging":"冲锋",
	"destined_death_curse":"定命",
	"combo":"连击",
	"rewind":"归返",
	"timer":"计时器",
	"timer2":"计时器2",
	"parry":"弹反",
	"somersault":"筋斗",
	"zombify":"僵尸化",
	"hot":"高温",
	"cold":"低温",
	"normal_temp":"常温",
	"bad_omen_check":"不祥之兆检测",
	"fight_back":"反击",
	"dragon_powered":"龙之吐息",
	"midas_curse":"迈达斯诅咒",
}
ClientEvents.lang("en_us", e => {
	global.copper_variants1.forEach(wax => {
		global.copper_variants2.forEach(expose => {
			global.copper_variants3.forEach(type => {
				global.copper_variants4.forEach(key => {
					const id = `${wax}${expose}${type}copper${key}`;
					if(["copper", "waxed_copper"].includes(id) || (type == "" && key != "")) return;
					const replacing = (expose == "weathered_" && key == "") ?
						`${lang_map1[expose][0]}` : 
						`${lang_map1[expose][0]} ${lang_map2[key][0]}`;

					e.renameBlock(`minecraft:${id}`, replacing);
					e.renameItem(`minecraft:${id}`, replacing)
				})
			})
		})
	});

	e.renameBlock("minecraft:copper_block", "Stripped Acacia Wood");
	e.renameItem("minecraft:waxed_copper_block", "Stripped Acacia Wood");

	e.renameBlock("minecraft:copper_ore", "Coal Ore");
	e.renameItem("minecraft:copper_ore", "Coal Ore");

	e.renameBlock("minecraft:deepslate_copper_ore", "Deepslate Coal Ore");
	e.renameItem("minecraft:deepslate_copper_ore", "Deepslate Coal Ore");

	e.renameBlock("minecraft:raw_copper_block", "Coal Block");
	e.renameItem("minecraft:raw_copper_block", "Coal Block");

	Object.keys(effects).forEach(effect => {
		const data = Text.translate(`effect.kubejs.${effect}`).getString();
		e.add(`item.minecraft.potion.effect.${effect}`, `Potion of ${data}`);
		e.add(`item.minecraft.splash_potion.effect.${effect}`, `Splash Potion of ${data}`);
		e.add(`item.minecraft.lingering_potion.effect.${effect}`, `Lingering Potion of ${data}`);
		e.add(`item.minecraft.tipped_arrow.effect.${effect}`, `Arrow of ${data}`);
	})
})

ClientEvents.lang("zh_cn", e => {
	global.copper_variants1.forEach(wax => {
		global.copper_variants2.forEach(expose => {
			global.copper_variants3.forEach(type => {
				global.copper_variants4.forEach(key => {
					const id = `${wax}${expose}${type}copper${key}`;
					if(["copper", "waxed_copper"].includes(id) || (type == "" && key != "")) return;
					const replacing = (expose == "weathered_" && key == "") ?
						`${lang_map1[expose][1]}` : 
						`${lang_map1[expose][1]}${lang_map2[key][1]}`;

					e.renameBlock(`minecraft:${id}`, replacing);
					e.renameItem(`minecraft:${id}`, replacing)
				})
			})
		})
	});

	e.renameBlock("minecraft:copper_block", "去皮金合欢原木");
	e.renameItem("minecraft:waxed_copper_block", "去皮金合欢原木");

	e.renameBlock("minecraft:copper_ore", "煤矿石");
	e.renameItem("minecraft:copper_ore", "煤矿石");

	e.renameBlock("minecraft:deepslate_copper_ore", "深板岩煤矿石");
	e.renameItem("minecraft:deepslate_copper_ore", "深层煤矿石");

	e.renameBlock("minecraft:raw_copper_block", "煤炭块");
	e.renameItem("minecraft:raw_copper_block", "煤炭块");

	Object.keys(effects).forEach(effect => {
		const data = effects[effect];
		e.add(`effect.kubejs.${effect}`, data);
		e.add(`item.minecraft.potion.effect.${effect}`, `${data}药水`);
		e.add(`item.minecraft.splash_potion.effect.${effect}`, `喷溅型${data}药水`);
		e.add(`item.minecraft.lingering_potion.effect.${effect}`, `滞留型${data}药水`);
		e.add(`item.minecraft.tipped_arrow.effect.${effect}`, `${data}之箭`);
	})

	const leaf_colors = {
		"pink": "粉", "blue": "蓝", "purple": "紫", "white": "白",
		"yellow": "黄", "orange": "橙", "red": "红", "gray": "灰",
		"light_blue": "淡蓝", "light_gray": "淡灰", "black": "黑",
		"cyan": "青", "magenta": "品红", "lime": "黄绿", "brown": "棕",
		"green": "绿"
	};
	const leaf_types = {
		"oak": "橡木", "birch": "白桦", "dark_oak": "深色橡木", "acacia": "金合欢",
		"jungle": "丛林", "mangrove": "红树", "spruce": "云杉"
	};
	Object.keys(leaf_types).forEach(leaf => {
		Object.keys(leaf_colors).forEach(color => {
			const color_t = leaf_colors[color];
			const leaf_t = leaf_types[leaf];
			e.add(`block.kubejs.${color}_${leaf}_leaves`, `${color_t}色${leaf_t}树叶`);
			e.add(`block.kubejs.${color}_${leaf}_leaf_pile`, `${color_t}色${leaf_t}落叶堆`);
			e.add(`block.kubejs.${leaf}_leaf_pile`, `${leaf_t}落叶堆`);
		})
	})
})

ClientEvents.lang("en_us", e => {
	/* Code from: https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript */
	function intToRoman(num) {
		let roman = ["C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
		let arabic = [100, 90, 50, 40, 10, 9, 5, 4, 1];
		let index = 0;
		let result = "";
		while (num > 0) {
			if (num >= arabic[index]) {
				result += roman[index];
				num -= arabic[index];
			} else index++;
		}
		return result;
	}

	for(let i = 11; i <= 255; i++) {
		e.add("minecraft", "enchantment.level." + i, intToRoman(i))
	}
})