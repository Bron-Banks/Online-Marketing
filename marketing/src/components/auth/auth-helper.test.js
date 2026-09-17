jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

import { jwtDecode } from "jwt-decode";
import {
  authenticate,
  isAuthenticated,
  getToken,
  getUsername,
  clearJWT,
} from "./auth-helper";

beforeEach(() => {
  sessionStorage.clear();
  jwtDecode.mockReset();
});

test("authenticate stores the token and decoded username, then calls back", () => {
  jwtDecode.mockReturnValue({ username: "bron" });
  const cb = jest.fn();

  authenticate("a.jwt.token", cb);

  expect(sessionStorage.getItem("token")).toBe("a.jwt.token");
  expect(sessionStorage.getItem("username")).toBe("bron");
  expect(cb).toHaveBeenCalledTimes(1);
});

test("isAuthenticated is false with no token and true once one is stored", () => {
  expect(isAuthenticated()).toBe(false);

  sessionStorage.setItem("token", "a.jwt.token");
  expect(isAuthenticated()).toBe(true);
});

test("getToken returns the stored token or null when absent", () => {
  expect(getToken()).toBeNull();

  sessionStorage.setItem("token", "a.jwt.token");
  expect(getToken()).toBe("a.jwt.token");
});

test("getUsername returns the stored username or null when absent", () => {
  expect(getUsername()).toBeNull();

  sessionStorage.setItem("username", "bron");
  expect(getUsername()).toBe("bron");
});

test("clearJWT removes the token and username", () => {
  jwtDecode.mockReturnValue({ username: "bron" });
  authenticate("a.jwt.token", () => {});

  clearJWT();

  expect(sessionStorage.getItem("token")).toBeNull();
  expect(sessionStorage.getItem("username")).toBeNull();
});
