(async function() {
  const bsScript = document.getElementById("bs");
  if (!bsScript) return console.warn("No ByteScript found with id='bs'");

  let code = "";

  if (bsScript.src) {
    const res = await fetch(bsScript.src);
    code = await res.text();
  } else {
    code = bsScript.textContent;
  }

  // Replace ByteScript operators → JS
  code = code
    .replace(/\*add/g, "+")
    .replace(/\*sub/g, "-")
    .replace(/\*mul/g, "*")
    .replace(/\*div/g, "/")
    .replace(/\*mod/g, "%")
    .replace(/^print\s+(.*)$/gm, "console.log($1)");

  // Convert functions with braces
  code = code.replace(
    /^fn\s+(\w+)\s*\((.*?)\)\s*([\s\S]*?)(?=^fn\s|\Z)/gm,
    (match, name, args, body) => {
      // Indent body lines
      const lines = body
        .split("\n")
        .map(l => "  " + l.trim())
        .join("\n");
      return `function ${name}(${args}) {\n${lines}\n}`;
    }
  );

  // Run the converted JS
  const scriptTag = document.createElement("script");
  scriptTag.textContent = code;
  document.body.appendChild(scriptTag);
})();
