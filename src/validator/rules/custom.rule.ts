import { register } from "simple-body-validator";

register("string_number", (value) => {
  if (typeof value === "string" || typeof value === "number") return true;
  else return false;
});
