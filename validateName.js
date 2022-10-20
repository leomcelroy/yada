export function validateName(name) {
  name = name.replaceAll(" ", "-");
  if (name === "") name = "defaultName";
  return name;
}