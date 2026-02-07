/* Inspired by This boat is MINE! by rimo2022 */
function dismount_manually(target) {
	if(target.vehicle && !target.isMonster()) target.unRide();
}