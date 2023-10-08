import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';
import { OwnedVehicle } from '@AthenaShared/interfaces/vehicleOwned';

import './commands'
import './functions'

const PLUGIN_NAME = 'x-vehicles';
Athena.systems.plugins.registerPlugin(PLUGIN_NAME, async () => {
    alt.log('Hello from the Vehicle !');
    Athena.systems.defaults.vehiclesDespawnOnLeave.disable()
    Athena.systems.defaults.vehiclesSpawnOnJoin.disable()
    spawnVehicles()

});

async function spawnVehicles() {
    const allDatabaseVehicles = await Database.fetchAllData<OwnedVehicle>(Athena.database.collections.Vehicles);
    let count = 0
    allDatabaseVehicles.forEach((vehicle) => {
        if (vehicle.garageInfo == null) {
            let spawnedVehicle = Athena.vehicle.spawn.persistent(vehicle);
            if (!Athena.vehicle.controls.isLocked(spawnedVehicle)) {
                Athena.vehicle.controls.toggleLock(spawnedVehicle)
            }
            if (spawnedVehicle.engineOn) {
                Athena.vehicle.controls.toggleEngine(spawnedVehicle)
            }
            count++
        }
    })
    alt.log(`Just spawned ${count} vehicles`)
}
