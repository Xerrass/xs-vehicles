import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { player } from '@AthenaClient/menus';
import { XVEHICLE_EVENTS } from '../shared/enum/events';

Athena.commands.register("setColors", "pri, sec, pearl, customPri, customSec", ["admin"], async (player: alt.Player, pri, sec, pearl) => {
    let vehicle = Athena.utility.closest.getClosestVehicle(player.pos);

    vehicle.primaryColor = parseInt(pri);
    vehicle.secondaryColor = parseInt(sec);
    vehicle.pearlColor = parseInt(pearl);
    Athena.document.vehicle.set(vehicle, "state.primaryColor", parseInt(pri))
    Athena.document.vehicle.set(vehicle, "state.secondaryColor", parseInt(sec))
    Athena.document.vehicle.set(vehicle, "state.pearlColor", parseInt(pearl))


})

Athena.commands.register(
    "gasup",
    "/gasup - Fill the vehicle Tank to the max",
    ['admin'],
    (player: alt.Player) => {
        let vehicle = Athena.utility.closest.getClosestVehicle(player.pos)
        alt.emitClient(player, XVEHICLE_EVENTS.SETFUELLEVEL, vehicle, 1000)
    }
)
