(async function () {
  const bsScript = document.getElementById("bs");
  if (!bsScript) {
    console.error("No ByteScript found with id='bs'");
    return;
  }

  let code = "";

  // Load code
  if (bsScript.src) {
    const res = await fetch(bsScript.src);
    code = await res.text();
  } else {
    code = bsScript.textContent;
  }

  // Operators
  code = code
    .replace(/\*add/g, "+")
    .replace(/\*sub/g, "-")
    .replace(/\*mul/g, "*")
    .replace(/\*div/g, "/")
    .replace(/\*mod/g, "%")
    .replace(/^print\s+(.*)$/gm, "console.log($1)");

  // Proper function conversion
  code = code.replace(
    /^fn\s+(\w+)\s*\((.*?)\)\s*\n([\s\S]*?)(?=^fn\s|\Z)/gm,
    (match, name, args, body) => {
      const cleanBody = body
        .split("\n")
        .map(line => "  " + line.trim())
        .join("\n");
      return `function ${name}(${args}) {\n${cleanBody}\n}\n`;
    }
  );

  // Execute the JS
  const scriptTag = document.createElement("script");
  scriptTag.textContent = code;
  document.body.appendChild(scriptTag);
})();
