# Athena Plugin - X's Vehicles

A Vehicle plugin for the Athena Framework compatible with `5.0.0` of the [Athena Framework](https://athenaframework.com/).

Does the Following:

-   deactivates default Vehicle Spawn behavior from Athena
-   Spawns all Vehicles wich are not in a garage on server start
-   Implements Fuel Usage
-   Implements Milage for Cars, Quads, Bikes
-   Implements UseHours for Boats, Planes and Helis

### Modded Vehicles

To get Use Hours or Milage Tracking they need to be added here:
src/core/shared/information/vehicles.ts

## Installation

1. Open a command prompt in your main Athena Directory.
2. Navigate to the plugins folder.

```ts
cd src/core/plugins
```

3. Copy the command below.

**HTTPS**

```
git clone https://github.com/Xerrass/xs-vehicles.git
```

4. Start the Server and enjoy your syncced Weather
