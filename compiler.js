(async function() {
  const bsScript = document.getElementById("bs");
  if (!bsScript) return console.warn("No ByteScript found with id='bs'");

  let code = bsScript.textContent;

  // ByteScript operators → JS
  code = code
    .replace(/\*add/g, "+")
    .replace(/\*sub/g, "-")
    .replace(/\*mul/g, "*")
    .replace(/\*div/g, "/")
    .replace(/\*mod/g, "%")
    .replace(/^print\s+(.*)$/gm, "console.log($1)")
    .replace(/^fn\s+(\w+)\s*\((.*?)\)/gm, "function $1($2)");

  // Run the converted JS
  const scriptTag = document.createElement("script");
  scriptTag.textContent = code;
  document.body.appendChild(scriptTag);
})(
