const geotunesHelper = require('../geotunes-helper');

test('Expect one to equal one.', () => {
  expect(1 === 1).toBe(true);
});

test('Expect the string "Kitchen" to be an invalid Lat Long string.', () => {
  function validateKitchen() {
    geotunesHelper.getValidateLocation("Kitchen");
  }

  expect(validateKitchen).toThrowError("Invalid Location");
});

test('Expect the string "25.0002, 99.23223" to be an valid Lat Long string.', () => {
  const validLatLong = "25.0002, 99.23223";

  expect(geotunesHelper.getValidateLocation(validLatLong)).toEqual(validLatLong);
});
