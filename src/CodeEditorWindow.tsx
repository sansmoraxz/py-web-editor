import Editor from "@monaco-editor/react";
import { useState } from "react";
import { loadPyodide } from "pyodide";


const defaultCode = `
# Python code here
print("Hello, World!")
`;

const engine = await loadPyodide();



const CodeEditorWindow = () => {
  const codeTemplate = `
__name__ = "__main__"
def __main8978():
{code}

__main8978()
# clear buffer
print(flush=True)
`;
  const [srCode, setSrCode] = useState<string>(defaultCode);
  const [output, setOutput] = useState([<>Press run to execute the script.</>]);

  const [isRunning, setIsRunning] = useState<boolean>(false);

  engine.setStdout({ batched: (msg) => {
    console.log(msg);
    setOutput(
      prev => [...prev, <div key={prev.length}>{msg}</div>]
    );
  }, isatty: false });

  function handleEditorChange(value: string | undefined) {
    setSrCode(value || "");
    return;
  }

  async function process() {
    console.warn("Running script...");
    console.time("Execution Time");
    setOutput([<></>]);

    try {
      try {
        const indentedCode = srCode.split("\n").map((line) => "    " + line).join("\n");
        const code = codeTemplate.replace("{code}", indentedCode || "   pass") + "\n";
        console.log("Running code:", code);
        const output = await engine.runPythonAsync(code);
        if (output) {
          console.log("Script Output:", output);
          setOutput(output);
        }
      } catch (err) {
        console.error("Script Error:", err);
        setOutput([<code>{String(err)}</code>]);
      }
    } catch (err) {
      console.error("Engine Error:", err);
    } finally {
      // flush output
      await engine.runPythonAsync("print(flush=True)");
      console.timeEnd("Execution Time");
    }
  }

  function runScript() {
    setIsRunning(true);
    process().finally(() => {
      setIsRunning(false);
    });
  }

  return (
    <div className="flex flex-row">
      <div>
        <Editor
          height="80vh"
          width="50vw"
          language="python"
          theme="vs-dark"
          value={srCode}
          onChange={handleEditorChange}
          defaultValue={defaultCode}
        />
      </div>
      <div className="h-1/4 w-[50vw] min-w-[30vw] pl-10">
        <button
          onClick={() => runScript()}
          disabled={isRunning}
          className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 mb-10"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Run
          </span>
        </button>

        <div className="h-36 overflow-x-scroll border-2 border-cyan-900 rounded-t-lg">
          <div className="text-lg  text-gray-400 pb-4 md:font-semibold">
            Output
          </div>
          <code className="text-sm text-gray-300 md:font-light">
            {isRunning ? "Running..." : <code>{output}</code>}
          </code>
        </div>
        <br />

      </div>
    </div>
  );
};

export default CodeEditorWindow;
