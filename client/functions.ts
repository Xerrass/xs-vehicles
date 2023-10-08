import * as alt from 'alt-client';
import * as native from 'natives'
import * as Athena from '@AthenaClient/api';
import { XVEHICLE_EVENTS } from '../shared/enum/events';
import { VEHICLE_TYPE, isVehicleType } from '@AthenaShared/enums/vehicleTypeFlags';
import { VehicleData } from '@AthenaShared/information/vehicles';

let engineInterval, milageinterval, useHoursInterval
let hideRadar = true;
let milage = 0, useHours = 0;

export class VehicleFunctions {
    static init() {
        alt.everyTick(() => {
            if (hideRadar) {
                native.hideHudAndRadarThisFrame()
            }
        })


    }

    static handleEnteredVehicle(vehicle: alt.Vehicle, seat: number) {
        let player: alt.Player = alt.Player.local
        // Do not shuffle to driver seat
        native.setPedConfigFlag(alt.Player.local, 184, true)
        //Do not put on 
        native.setPedConfigFlag(alt.Player.local, 35, false)
        // Removing the radio from the vehicle
        native.setVehicleRadioEnabled(vehicle, false)
        hideRadar = false
        if (seat == 1) {
            alt.emit(XVEHICLE_EVENTS.STARTENGINEINTERVAL, vehicle)
        }
        let data = null;
        if (typeof vehicle.model === 'string') {
            const modelAsString = vehicle.model as String;
            data = VehicleData.find((dat) => dat.name.toLowerCase() === modelAsString.toLowerCase());
        } else {
            const modelAsNumber = vehicle.model as Number;
            data = VehicleData.find((dat) => dat.hash === modelAsNumber);
        }
        if (seat == 1) {
            if (isVehicleType(data.type, VEHICLE_TYPE.CAR) || isVehicleType(data.type, VEHICLE_TYPE.AMPHIBIOUS_AUTOMOBILE) || isVehicleType(data.type, VEHICLE_TYPE.QUADBIKE) || isVehicleType(data.type, VEHICLE_TYPE.AMPHIBIOUS_QUADBIKE) || isVehicleType(data.type, VEHICLE_TYPE.BIKE)) {
                alt.emit(XVEHICLE_EVENTS.STARTMILAGEINTERVAL, vehicle)
            }
            if (isVehicleType(data.type, VEHICLE_TYPE.HELI) || isVehicleType(data.type, VEHICLE_TYPE.PLANE) || isVehicleType(data.type, VEHICLE_TYPE.BOAT) || isVehicleType(data.type, VEHICLE_TYPE.SUBMARINE)) {
                alt.emit(XVEHICLE_EVENTS.STARTUSAGEINTERVAL, vehicle)

            }
        }
    }


    static handleLeftVehicle(vehicle: alt.Vehicle, seat: number) {
        hideRadar = true
        if (seat == 1) {
            alt.emitServer(XVEHICLE_EVENTS.UPDATEFUELLEVEL, vehicle, vehicle.fuelLevel)
            if (milage != 0) {
                alt.emitServer(XVEHICLE_EVENTS.UPDATEMILAGE, vehicle, milage)
                milage = 0
            }
            if (useHours != 0) {
                alt.emitServer(XVEHICLE_EVENTS.UPDATEUSEHOURS, vehicle, useHours)
                useHours = 0
            }

            if (engineInterval) {
                alt.clearInterval(engineInterval)
            }
            if (milageinterval) {
                alt.clearInterval(milageinterval)
            }
            if (useHoursInterval) {
                alt.clearInterval(useHoursInterval)

            }
        }
    }


    static setFuelLevel(vehicle: alt.Vehicle, fuelLevel: number) {
        if (fuelLevel > vehicle.handling.petrolTankVolume) {
            vehicle.fuelLevel = vehicle.handling.petrolTankVolume
        } else {
            vehicle.fuelLevel = fuelLevel
        }
        alt.log(`recieved Fuel Level from server: ${vehicle.fuelLevel} / ${vehicle.handling.petrolTankVolume}`)
    }

    static setMilageOrUseHours(vehicle: alt.Vehicle, _milage: number, _useHours: number) {
        //sendNotification(0, 5, "Debug", `Milage from server is: ${_milage}`)
        if (_milage === undefined) {
        } else {
            milage = _milage
        }
        if (_useHours === undefined) {
        } else {
            useHours = _useHours
        }
        alt.log(`recieved data from server -> Milage: ${_milage} UseHours: ${_useHours}`)
    }

    static startEngineInterval(vehicle: alt.Vehicle) {
        engineInterval = alt.setInterval(() => {
            if (vehicle.engineOn) {
                if (vehicle.rpm > 0 && vehicle.rpm <= 0.2) {
                    vehicle.fuelLevel -= 0.0001;
                } else if (vehicle.rpm > 0.2 && vehicle.rpm <= 0.4) {
                    vehicle.fuelLevel -= 0.0002;
                } else if (vehicle.rpm > 0.4 && vehicle.rpm <= 0.6) {
                    vehicle.fuelLevel -= 0.0003;
                } else if (vehicle.rpm > 0.6 && vehicle.rpm <= 0.8) {
                    vehicle.fuelLevel -= 0.0005;
                } else if (vehicle.rpm > 0.8 && vehicle.rpm <= 1) {
                    vehicle.fuelLevel -= 0.0008;
                }
                alt.logDebug(`RPM: ${vehicle.rpm} Fuel: ${vehicle.fuelLevel}`)
            }

        }, 100)
    }

    static startMilageInterval(vehicle: alt.Vehicle) {
        let lastPosition = null

        milageinterval = alt.setInterval(() => {
            if (!vehicle.engineOn) {
                return
            }
            let distance
            if (lastPosition == null) {
                lastPosition = vehicle.pos
            } else {
                distance = Athena.utility.vector.distance(lastPosition, vehicle.pos)
                milage += distance
                lastPosition = vehicle.pos
                alt.log(milage)
            }

        }, 2000)
    }


    static startUseHoursInterval(vehicle: alt.Vehicle) {

        useHoursInterval = alt.setInterval(() => {
            if (vehicle.engineOn) {
                useHours += 10
            }
            alt.log(`Current use Seconds: ${useHours} and Vehicle Engine is ${vehicle.engineOn}`)
        }, 10000)
    }
}
alt.on('enteredVehicle', VehicleFunctions.handleEnteredVehicle)
alt.on("leftVehicle", VehicleFunctions.handleLeftVehicle)
alt.onServer(XVEHICLE_EVENTS.SETFUELLEVEL, VehicleFunctions.setFuelLevel)
alt.onServer(XVEHICLE_EVENTS.SETMILAGEORUSEHOURS, VehicleFunctions.setMilageOrUseHours)


alt.on(XVEHICLE_EVENTS.STARTENGINEINTERVAL, VehicleFunctions.startEngineInterval)
alt.on(XVEHICLE_EVENTS.STARTMILAGEINTERVAL, VehicleFunctions.startMilageInterval)
alt.on(XVEHICLE_EVENTS.STARTUSAGEINTERVAL, VehicleFunctions.startUseHoursInterval)