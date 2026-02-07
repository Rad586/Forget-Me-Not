/* the function is in startup script for ore mob */
["wall_torch", "torch"].forEach(key => BlockEvents.placed(key, e => global.torch_alert(e.entity)))