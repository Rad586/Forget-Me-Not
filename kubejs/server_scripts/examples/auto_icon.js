// const no_icon = ["alessandrvenchantments"];
// ClientEvents.loggedIn(e => {
//     const path = `kubejs/assets/minecraft/lang/${Client.options.languageCode}.json`;
//     if (JsonIO.read(path)) return;

//     let counter = 0, providers = [], temp = {};
//     const effects = Utils.getRegistry("mob_effect");

//     effects.forEach(effect => {
//         const key = effect.descriptionId;
//         const t1 = String(key).split(".");
//         if (no_icon.includes(t1[1])) return;

//         const t = Text.translate(key).getString();
//         const char = String.fromCharCode(0xF000 + counter);

//         providers.push({"type": "bitmap", 
//             "file": `${t1[1]}:mob_effect/${t1[2]}.png`,
//             "ascent": 7, "height": 8, "chars": [char]})
//         temp[key] = `§f${char} §r${t}§r`;
//         counter++
//     });

//     JsonIO.write("kubejs/assets/minecraft/font/default.json", { "providers": providers });
//     JsonIO.write(path, temp);
//     Client.reloadResourcePacks()
// })