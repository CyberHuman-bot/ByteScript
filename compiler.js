(async function() {
  'use strict';
  
  console.log('%c🚀 ByteScript Compiler v3.1 - CSP Fixed', 'color: #667eea; font-size: 16px; font-weight: bold');
  
  // ═══════════════════════════════════════════════════════════════════════════
  // Configuration & Constants
  // ═══════════════════════════════════════════════════════════════════════════
  
  const CONFIG = {
    scriptId: 'bs',
    debug: true,
    strictMode: true,
    optimizations: true,
    executionMode: 'blob' // 'eval', 'function', 'blob'
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // Lexer - Tokenizes ByteScript source code
  // ═══════════════════════════════════════════════════════════════════════════
  
  class Lexer {
    constructor(source) {
      this.source = source;
      this.tokens = [];
    }

    tokenize() {
      // Remove comments first
      let code = this.source;
      code = code.replace(/\/\/.*$/gm, ''); // Single-line comments
      code = code.replace(/\/\*[\s\S]*?\*\//g, ''); // Multi-line comments
      code = code.replace(/#.*$/gm, ''); // Shell-style comments
      
      return code;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Parser - Transforms ByteScript syntax to JavaScript
  // ═══════════════════════════════════════════════════════════════════════════
  
  class Parser {
    constructor(code) {
      this.code = code;
      this.output = '';
    }

    parse() {
      let code = this.code;

      // ─────────────────────────────────────────────────────────────────────
      // Phase 1: Variable Declarations
      // ─────────────────────────────────────────────────────────────────────
      
      code = code.replace(/^var\s+(\w+)\s*=\s*(.+?)$/gm, 'let $1 = $2;');
      code = code.replace(/^let\s+(\w+)\s*=\s*(.+?)$/gm, 'let $1 = $2;');
      code = code.replace(/^const\s+(\w+)\s*=\s*(.+?)$/gm, 'const $1 = $2;');

      // ─────────────────────────────────────────────────────────────────────
      // Phase 2: String Operations
      // ─────────────────────────────────────────────────────────────────────
      
      for (let i = 0; i < 5; i++) {
        code = code.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\w+|\d+)\s*&\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\w+|\d+)/g, '$1 + $2');
      }

      // ─────────────────────────────────────────────────────────────────────
      // Phase 3: Math Operators
      // ─────────────────────────────────────────────────────────────────────
      
      for (let i = 0; i < 3; i++) {
        code = code.replace(/([\w\d._]+|\([^)]+\))\s*\+\+\s*([\w\d._]+|\([^)]+\))/g, '($1 + $2)');
        code = code.replace(/([\w\d._]+|\([^)]+\))\s*--\s*([\w\d._]+|\([^)]+\))/g, '($1 - $2)');
        code = code.replace(/([\w\d._]+|\([^)]+\))\s*\*\*\s*([\w\d._]+|\([^)]+\))/g, '($1 * $2)');
        code = code.replace(/([\w\d._]+|\([^)]+\))\s*\/\/\s*([\w\d._]+|\([^)]+\))/g, '($1 / $2)');
        code = code.replace(/([\w\d._]+|\([^)]+\))\s*%%\s*([\w\d._]+|\([^)]+\))/g, '($1 % $2)');
      }

      code = code.replace(/([\w\d._]+)\s*\^\^\s*([\w\d._]+)/g, 'Math.pow($1, $2)');

      // ─────────────────────────────────────────────────────────────────────
      // Phase 4: Output/Print Statements
      // ─────────────────────────────────────────────────────────────────────
      
      code = code.replace(/^say\s+(.+)$/gm, 'console.log($1);');
      code = code.replace(/^print\s+(.+)$/gm, 'console.log($1);');
      code = code.replace(/^log\s+(.+)$/gm, 'console.log($1);');
      code = code.replace(/^out\s+(.+)$/gm, 'console.log($1);');
      code = code.replace(/^echo\s+(.+)$/gm, 'console.log($1);');

      // ─────────────────────────────────────────────────────────────────────
      // Phase 5: Function Declarations
      // ─────────────────────────────────────────────────────────────────────
      
      code = code.replace(/^(def|fn)\s+(\w+)\s*\(([^)]*)\)\s*\{/gm, 'function $2($3) {');
      code = code.replace(/^(def|fn)\s+(\w+)\s*\(([^)]*)\)\s*$/gm, 'function $2($3) {');
      code = code.replace(/^(\w+)\s*=>\s*(.+)$/gm, 'const $1 = () => $2;');

      // ─────────────────────────────────────────────────────────────────────
      // Phase 6: Control Flow - Conditionals
      // ─────────────────────────────────────────────────────────────────────
      
      code = code.replace(/^if\s+(.+?)\s*\{/gm, 'if ($1) {');
      code = code.replace(/^if\s+(.+?)$/gm, 'if ($1) {');
      code = code.replace(/^elif\s+(.+?)\s*\{/gm, '} else if ($1) {');
      code = code.replace(/^elif\s+(.+?)$/gm, '} else if ($1) {');
      code = code.replace(/^else\s*\{/gm, '} else {');
      code = code.replace(/^else\s*$/gm, '} else {');
      code = code.replace(/^endif$/gm, '}');

      // ─────────────────────────────────────────────────────────────────────
      // Phase 7: Control Flow - Loops
      // ─────────────────────────────────────────────────────────────────────
      
      code = code.replace(/^for\s+(.+?)\s*\{/gm, 'for ($1) {');
      code = code.replace(/^for\s+(.+?)$/gm, 'for ($1) {');
      code = code.replace(/^while\s+(.+?)\s*\{/gm, 'while ($1) {');
      code = code.replace(/^while\s+(.+?)$/gm, 'while ($1) {');
      
      code = code.replace(/^loop\s+(\d+)\s*\{/gm, 'for (let _i = 0; _i < $1; _i++) {');
      code = code.replace(/^loop\s+(\d+)$/gm, 'for (let _i = 0; _i < $1; _i++) {');
      code = code.replace(/^loop\s+(\w+)\s+in\s+(\d+)\.\.(\d+)\s*\{/gm, 'for (let $1 = $2; $1 < $3; $1++) {');
      code = code.replace(/^each\s+(\w+)\s+in\s+(\w+)\s*\{/gm, 'for (const $1 of $2) {');
      code = code.replace(/^each\s+(\w+)\s+in\s+(\w+)$/gm, 'for (const $1 of $2) {');
      
      code = code.replace(/^(endloop|endfor|endwhile)$/gm, '}');

      // ─────────────────────────────────────────────────────────────────────
      // Phase 8: Return Statements
      // ─────────────────────────────────────────────────────────────────────
      
      code = code.replace(/^ret\s+(.+)$/gm, 'return $1;');
      code = code.replace(/^return\s+(.+?)$/gm, 'return $1;');

      // ─────────────────────────────────────────────────────────────────────
      // Phase 9: Data Structure Operations
      // ─────────────────────────────────────────────────────────────────────
      
      code = code.replace(/(\w+)\s*@\s*(\d+|\w+)/g, '$1[$2]');
      code = code.replace(/(\w+)\.len\b/g, '$1.length');

      // ─────────────────────────────────────────────────────────────────────
      // Phase 10: Type Operations
      // ─────────────────────────────────────────────────────────────────────
      
      code = code.replace(/toInt\(/g, 'parseInt(');
      code = code.replace(/toFloat\(/g, 'parseFloat(');
      code = code.replace(/toStr\(/g, 'String(');
      code = code.replace(/isNum\((\w+)\)/g, "(typeof $1 === 'number')");
      code = code.replace(/isStr\((\w+)\)/g, "(typeof $1 === 'string')");

      // ─────────────────────────────────────────────────────────────────────
      // Phase 11: Block End Keywords
      // ─────────────────────────────────────────────────────────────────────
      
      code = code.replace(/^(end|enddef|endfn)$/gm, '}');

      // ─────────────────────────────────────────────────────────────────────
      // Phase 12: Semicolon Insertion (Smart)
      // ─────────────────────────────────────────────────────────────────────
      
      const lines = code.split('\n');
      code = lines.map(line => {
        const trimmed = line.trim();
        
      if (!trimmed || trimmed.startsWith('//')) return line;

      // never touch block boundaries
      if (
        trimmed.endsWith('{') ||
        trimmed.endsWith('}') ||
        trimmed.endsWith(';') ||
        trimmed.endsWith(',') ||
        trimmed.endsWith(')')
      ) return line;

      // control keywords
      if (/^(if|else|for|while|function|class)\b/.test(trimmed)) return line;

      // IMPORTANT: don't auto-semicolon after string concat/log lines
      if (/console\.log\(.+\)$/.test(trimmed)) return line;

      return line + ';';

      }).join('\n');

      // ─────────────────────────────────────────────────────────────────────
      // Phase 13: Optimizations
      // ─────────────────────────────────────────────────────────────────────
      
      if (CONFIG.optimizations) {
        code = code.replace(/\(\((\w+)\) \+ \((\w+)\)\)/g, '($1 + $2)');
        code = code.replace(/--(\w+)/g, '$1');
      }

      this.output = code;
      return this.output;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Code Generator - CSP-Safe Execution (Fixed!)
  // ═══════════════════════════════════════════════════════════════════════════
  
  class CodeGenerator {
    constructor(code) {
      this.code = code;
    }

    execute() {
      try {
        let execCode = this.code;
        if (CONFIG.strictMode) {
          execCode = '"use strict";\n' + execCode;
        }

        switch (CONFIG.executionMode) {
          case 'eval':
            eval(execCode);
            break;
            
          case 'function':
            const func = new Function(execCode);
            func();
            break;
            
          case 'blob':
          default:
            const blob = new Blob([execCode], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const script = document.createElement('script');
            script.src = url;
            document.head.appendChild(script);
            
            // Cleanup after execution
            script.onload = () => {
              document.head.removeChild(script);
              URL.revokeObjectURL(url);
            };
            break;
        }
        
        return { success: true, error: null };
      } catch (err) {
        console.error('Execution error:', err);
        return { success: false, error: err.message };
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Compiler Pipeline - Orchestrates the compilation process
  // ═══════════════════════════════════════════════════════════════════════════
  
  class CompilerPipeline {
    constructor() {
      this.source = '';
      this.compiled = '';
    }

    async loadSource() {
      const bsScript = document.getElementById(CONFIG.scriptId);
      
      if (!bsScript) {
        throw new Error(`No script tag found with id="${CONFIG.scriptId}"`);
      }

      if (bsScript.src) {
        try {
          const response = await fetch(bsScript.src);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          this.source = await response.text();
          console.log(`%c📄 Loaded: ${bsScript.src}`, 'color: #4ec9b0');
        } catch (err) {
          throw new Error(`Failed to load ${bsScript.src}: ${err.message}`);
        }
      } else {
        this.source = bsScript.textContent.trim();
        console.log('%c📄 Loaded: Inline ByteScript', 'color: #4ec9b0');
      }

      return this.source;
    }

    compile() {
      console.log('%c⚙️  Compiling ByteScript...', 'color: #f093fb');
      
      const startTime = performance.now();

      // Step 1: Lexical Analysis
      const lexer = new Lexer(this.source);
      const cleanedCode = lexer.tokenize();

      // Step 2: Parsing & Transformation
      const parser = new Parser(cleanedCode);
      this.compiled = parser.parse();

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);

      console.log(`%c✨ Compilation complete in ${duration}ms`, 'color: #43e97b');
      console.log(`%c📊 Execution mode: ${CONFIG.executionMode}`, 'color: #4facfe');
      
      if (CONFIG.debug) {
        console.groupCollapsed('%c📦 Compiled JavaScript', 'color: #667eea; font-weight: bold');
        console.log(this.compiled);
        console.groupEnd();
      }

      return this.compiled;
    }

    execute() {
      console.log('%c🎯 Executing compiled code...', 'color: #4facfe');
      
      const generator = new CodeGenerator(this.compiled);
      const result = generator.execute();

      if (result.success) {
        console.log('%c✅ ByteScript execution successful!', 'color: #43e97b; font-weight: bold');
      } else {
        console.error('%c❌ Runtime error:', 'color: #f5576c; font-weight: bold', result.error);
      }

      return result;
    }

    async run() {
      try {
        await this.loadSource();
        this.compile();
        const result = this.execute();
        
        console.log('%c' + '═'.repeat(60), 'color: #667eea');
        
        return result;
      } catch (err) {
        console.error('%c❌ Compilation failed:', 'color: #f5576c; font-weight: bold', err.message);
        return { success: false, error: err.message };
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Execute the compiler
  // ═══════════════════════════════════════════════════════════════════════════
  
  const compiler = new CompilerPipeline();
  await compiler.run();

})();
