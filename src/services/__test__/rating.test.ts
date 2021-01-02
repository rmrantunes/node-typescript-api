import { Beach, BeachPosition } from "@src/models/beach";
import { Rating } from "../rating";

describe("Rating Service", () => {
  const defaultBeach: Beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: "Manly",
    position: BeachPosition.E,
    user: "some-user",
  };

  const defaultRating = new Rating(defaultBeach);

  describe("Calculate rating for a given point", () => {
    // TODO
  });

  describe("Get rating based on wind and wave position", () => {
    it("should get rating 1 for a beach with onshore winds", () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.E,
      );
      expect(rating).toBe(1);
    });
    it("should get rating 4 for a beach with cross winds", () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.S,
      );
      expect(rating).toBe(3);
    });
    it("should get rating 5 for a beach with offshore winds", () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.W,
      );
      expect(rating).toBe(5);
    });
  });

  describe("Get rating based on swell period", () => {
    it("should get a ratind of 1 for a period of 5 seconds", () => {
      const rating = defaultRating.getRatingForSwellPeriod(5);
      expect(rating).toBe(1);
    });

    it("should get a ratind of 2 for a period of 9 seconds", () => {
      const rating = defaultRating.getRatingForSwellPeriod(9);
      expect(rating).toBe(2);
    });

    it("should get a ratind of 4 for a period of 12 seconds", () => {
      const rating = defaultRating.getRatingForSwellPeriod(12);
      expect(rating).toBe(4);
    });

    it("should get a ratind of 5 for a period of 16 seconds", () => {
      const rating = defaultRating.getRatingForSwellPeriod(16);
      expect(rating).toBe(5);
    });
  });

  describe("Get ratind based on swell height", () => {
    it("should get rating 1 for less than ankle to knee high swell", () => {
      const rating = defaultRating.getRatingForSwellSize(0.2);
      expect(rating).toBe(1);
    });

    it("should get rating 2 for less an ankle to knee swell", () => {
      const rating = defaultRating.getRatingForSwellSize(0.6);
      expect(rating).toBe(2);
    });

    it("should get rating 3 for less waist height swell", () => {
      const rating = defaultRating.getRatingForSwellSize(1.5);
      expect(rating).toBe(3);
    });

    it("should get rating 5 for less overhead swell", () => {
      const rating = defaultRating.getRatingForSwellSize(2.5);
      expect(rating).toBe(5);
    });
  });

  /**
   * Location specific calculation
   */
  describe("Get position based on points location", () => {
    it("should get the point based on east location", () => {
      const response = defaultRating.getPositionFromLocation(92);
      expect(response).toBe(BeachPosition.E);
    });

    it("should get the point based on north location", () => {
      const response = defaultRating.getPositionFromLocation(360);
      expect(response).toBe(BeachPosition.N);
    });

    it("should get the point based on north location", () => {
      const response = defaultRating.getPositionFromLocation(40);
      expect(response).toBe(BeachPosition.N);
    });

    it("should get the point based on south location", () => {
      const response = defaultRating.getPositionFromLocation(200);
      expect(response).toBe(BeachPosition.S);
    });

    it("should get the point based on west location", () => {
      const response = defaultRating.getPositionFromLocation(300);
      expect(response).toBe(BeachPosition.W);
    });
  });
});
