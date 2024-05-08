import json

buildFlags = "-D UUID_DEFINES=1"

with open("./BluetoothSensorApp/UUIDs.json") as f:
  uuids = json.load(f)
  for uuid in uuids:
    name = uuid["name"]
    define = f"{name.upper().replace(' ', '')}_UUID"
    # uuid = uuids['uuid']
    buildFlags += f" -D {define}='\"{uuid['uuid']}\"'"

print(buildFlags)