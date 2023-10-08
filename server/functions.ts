import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { XVEHICLE_EVENTS } from '../shared/enum/events';
import { play } from '@AthenaClient/camera/cinematic';
import { NotifyController } from '@AthenaPlugins/fnky-notifcations/server';

class VehicleFunctions {
    static async handlePlayerEnteringVehicle(player: alt.Player, vehicle: alt.Vehicle, seat: number) {
        if (seat != 1) {
            return
        }
        let fuelLevel = Athena.document.vehicle.getField(vehicle, "fuel")
        alt.emitClient(player, XVEHICLE_EVENTS.SETFUELLEVEL, vehicle, fuelLevel)
        let milage = Athena.document.vehicle.getField(vehicle, "milage")
        let useHours = Athena.document.vehicle.getField(vehicle, "useHours")
        alt.emitClient(player, XVEHICLE_EVENTS.SETMILAGEORUSEHOURS, vehicle, milage, useHours)
    }
    static handlePlayerRequestingFuelLevel(player: alt.Player, vehicle: alt.Vehicle) {
        let fuelLevel = Athena.document.vehicle.getField(vehicle, "fuel")
        alt.emitClient(player, XVEHICLE_EVENTS.SETFUELLEVEL, vehicle, fuelLevel)
    }

    static handleVehicleFuelUpdate(player: alt.Player, vehicle: alt.Vehicle, fuelLevel: number) {
        Athena.document.vehicle.set(vehicle, "fuel", fuelLevel)
    }

    static handleVehicleMilageUpdate(player: alt.Player, vehicle: alt.Vehicle, milage: number) {
        Athena.document.vehicle.set(vehicle, "milage", milage)
    }
    static handleVehicleUseHoursUpdate(player: alt.Player, vehicle: alt.Vehicle, useHours: number) {
        Athena.document.vehicle.set(vehicle, "useHours", useHours)
    }


}

alt.on("playerEnteringVehicle", VehicleFunctions.handlePlayerEnteringVehicle)
alt.onClient(XVEHICLE_EVENTS.UPDATEFUELLEVEL, VehicleFunctions.handleVehicleFuelUpdate)
alt.onClient(XVEHICLE_EVENTS.UPDATEMILAGE, VehicleFunctions.handleVehicleMilageUpdate)
alt.onClient(XVEHICLE_EVENTS.UPDATEUSEHOURS, VehicleFunctions.handleVehicleUseHoursUpdate)
alt.onClient(XVEHICLE_EVENTS.GETFUELLEVEL, VehicleFunctions.handlePlayerRequestingFuelLevel)