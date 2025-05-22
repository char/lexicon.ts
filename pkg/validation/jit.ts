const getBody = (f: Function): string | undefined =>
  /(?<params>\(.*\))=>\{(?<body>.*)\}/gs.exec(f.toString())?.groups?.body;

type Validator = (
  $v: unknown,
  $path: string,
  $error: (path: string, message: string) => void,
  $next: () => void
) => void;

const _isString: Validator = ($v, $path, $error, $next) => {
  if (typeof $v !== "string") $error($path, "expected string");
  $next();
};
const isString = getBody(_isString)!;

const _isInteger: Validator = ($v, $path, $error, $next) => {
  if (typeof $v !== "number") $error($path, "expected number");
  else if (!Number.isInteger($v)) $error($path, "number was not an integer");
  $next();
}
const isInteger = getBody(_isInteger)!;

const $literal = undefined;
const _isLiteral: Validator = ($v, $path, $error, $next) => {
  if ($v !== $literal) $error($path, "expected literal: " + JSON.stringify($literal));
  $next();
}
const isLiteralBody = getBody(_isLiteral)!;
const isLiteral = (literal: unknown) => isLiteralBody.replaceAll("$literal", JSON.stringify(literal));

const _isObject: Validator = ($v, $path, $error, $next) => {
  if (typeof $v !== "object" || $v === null) $error($path, "expected object");
  $next();
}
const isObject = getBody(_isObject)!;

const _isOptional: Validator = ($v, $path, $error, $next) => {
  if ($v !== undefined) {
    $next();
  }
}
const isOptional = getBody(_isOptional)!;

type ObjectShape = Record<string, PropType>;
type PropType = { type: "string"; } | { type: "integer" } | { type: "literal", value: unknown } | { type: "object", shape: ObjectShape, required: string[] };

const NEXT_REGEX = /\s*\$next\(\);\n?/g

const hasObjectShape = (path: string, shape: ObjectShape, required: string[]) => {
  let body = "$next();";

  const validators = [];
  for (const [key, value] of Object.entries(shape)) {
    let validator =
        value.type === "string" ? isString
      : value.type === "integer" ? isInteger
      : value.type === "literal" ? isLiteral(value.value)
      : value.type === "object" ? hasObjectShape(path + "." + key, value.shape, value.required)
      : undefined;
    if (!validator) continue;

    if (!required.includes(key)) {
      validators.push(isOptional
        .replaceAll("$v", `$v[${JSON.stringify(key)}]`)
        .replaceAll("$path", JSON.stringify(path + "." + key)));
    }

    validator = validator.replaceAll("$v", `$v[${JSON.stringify(key)}]`);
    validator = validator.replaceAll("$path", JSON.stringify(path + "." + key));

    validators.push(validator);
  }

  for (const validator of validators)
    body = body.replace(NEXT_REGEX, validator);

  return body;
}

const validateObject = (opts: { required: string[], shape: ObjectShape }) => {
  let body = isObject;
  body = body.replace(NEXT_REGEX, hasObjectShape("", opts.shape, opts.required));

  body = body.replaceAll("$v", "o");
  body = body.replaceAll("$path", JSON.stringify("."));

  body = body.replace(NEXT_REGEX, "");
  body  = "  const errors = [];\n  " + body;
  body += "\n\n  if (errors.length) throw errors;\n";
  body += "  return o;";
  body = body.replaceAll("$error", "errors.push");

  return Function("o", body);
}

const validator = validateObject({
  required: ["$type", "text"],
  shape: {
    $type: { type: "literal", value: "guy" },
    text: { type: "string" },
    myOptionalField: {
      type: "object",
      required: ["value"],
      shape: {
        value: { type: "string" },
        nestedOptional: { type: "integer" },
      }
    },
  },
});

console.log(validator.toString());
console.log(validator({ "$type": "guy", "text": "hiii" }));
