(async function() {
  const bsScripts = document.querySelectorAll("script[src$='.bs']");
  
  for (const s of bsScripts) {
    const res = await fetch(s.src);
    let code = await res.text();

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
  }
})();
