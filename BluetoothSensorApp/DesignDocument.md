# Requirements

## BLE
* app needs to pair to BLE peripheral
* app needs to read BLE data and respond accordingly
* app needs to store the BLE data properly

## Active Log

* app needs to create a new log
* app needs to display the log perfomatively
* data needs to be entered correctly (i.e. first available gap, make and start a new row when needed)
* data needs to be manually updateable
* being able to delete a row would be nice
* log should be persisted every view change, or every X entries or minutes

maybe have a list of empty locations, and deleting an entry pushes that location to the list?

## Completed Logs

* should be stored in external (phone) storage if possible
* should be shareable within the app
* google drive integration would be nice

# Approach

I think using mobx as a data store will be the easiest approach. The data should be frequently persisted, and should be saveable as a JSON. Keeping a couple of snapshots of the active log in cache would allow for an undo button.

Use React Native Navigation with a draw to access the different views.

The presentLog component should be a scrollable list. Each entry should be pressable and open a modal with options [delete, enter value]. Above the component should be a pressable box that opens the title and description, and a button to finish the log. Finishing a log should take the user to the view of the same log, but in "inactive" mode.

The presentLog component should be useable between active and past logs. Perhaps an "active?" param to switch behaviours?


It might be best to ditch the idea of handling active and inactive logs seperately, and just store all of them in device storage. Use the cache for persistant the active log (or a snapshot of the data store), and clear the cache when starting a new log.

## Log data format

{
  title: "",
  creationTime: "",
  finishTime: "",                 // maybe? probably not
  headers: ["Bend 1", "handle"],
  data: [                         // data array is strictly ordered
    [0, -0.5],
    [1.0, 0.5],
    ...
  ]
}