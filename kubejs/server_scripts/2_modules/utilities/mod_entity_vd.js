// ItemEvents.rightClicked(e => {
//     const content = {
//         "CONFIG_VERSION_DONT_TOUCH_THIS": 1,
//         "mode": "both",
//         "entityViewDistance": {}
//     }

//     const result = {}, v512 = {}, v80 = {}, v64 = {},
//         v48 = {}, v32 = {}, v16 = {};

//     const overworld = e.server.overworld();
//     Utils.getRegistry("minecraft:entity_type").forEach(type => {
//         const entity = type.create(overworld);
//         if (!entity) return;
//         const { size } = entity.boundingBox;
//         const id = type.toString().split("entity.")[1].replace(".", ":");

//         if (entity.isLiving()) {
//             let animals = !(entity instanceof NeutralMob) && !entity.isMonster() && !(entity instanceof OwnableEntity);
//             let Ownable = entity instanceof OwnableEntity;
//             let monsters = entity.isMonster()
//             let huge = size > 1.25; //80
//             let large = size <= 1.25 && size > 0.95; //64
//             let medium = size <= 0.95 && size > 0.75; //48
//             let small = size <= 0.75 && size > 0.45; //32
//             let tiny = size <= 0.45; //16
//             let important = entity.isMonster() &&
//                 entity.getAttribute("minecraft:generic.max_health") &&
//                 entity.getAttribute("minecraft:generic.max_health").getValue() > 50;
//             let traders = entity instanceof Npc;
//             let wateranimals = entity instanceof WaterAnimal;

//             if (id == "minecraft:player") v512[id] = 512
//             if (!animals && important) v512[id] = 512

//             if (id.includes("dummmmmmy")) v80[id] = 80
//             if (Ownable && large) v80[id] = 80
//             if (!animals && huge) v80[id] = 80

//             if (traders) v64[id] = 64
//             if (Ownable && (medium || small)) v64[id] = 64
//             if (animals && huge) v64[id] = 64
//             if (monsters && medium) v64[id] = 64
//             if (!animals && large) v64[id] = 64

//             if (animals && large) v48[id] = 48
//             if (monsters && small) v48[id] = 48
//             if (!monsters && medium) v48[id] = 48

//             if (Ownable && tiny) v32[id] = 32
//             if (wateranimals && large) v32[id] = 32
//             if (animals && medium) v32[id] = 32
//             if (monsters && tiny) v32[id] = 32
//             if (!monsters && small) v32[id] = 32

//             if (wateranimals && (medium || small || tiny)) v16[id] = 16
//             if (animals && (small || tiny)) v16[id] = 16
//             if (!monsters && tiny) v16[id] = 16
//         }
//         else if (entity instanceof Projectile) {
//             v80[id] = 80
//         }
//     })

//     Object.assign(result, v16, v32, v48, v64, v80, v512);
//     content.entityViewDistance = result;

//     JsonIO.write("config/entity-view-distance.json", content)
// })