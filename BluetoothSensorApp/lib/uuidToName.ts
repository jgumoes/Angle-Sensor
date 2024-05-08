import BLEUUIDS from '../UUIDs.json';

export const uuidToName = (uuid: string) => {
  const uuidObj = BLEUUIDS.find(
    storedUuid => storedUuid.uuid.toLowerCase() === uuid,
  );
  console.log('UUID object: ', uuidObj);
  return uuidObj ? uuidObj.name : uuid;
};
