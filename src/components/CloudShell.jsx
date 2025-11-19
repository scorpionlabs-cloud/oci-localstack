import React, { useEffect, useRef, useState } from "react";

const PROMPT = "cloudshell:~/localstack$";

const initialLines = [
  "Oracle Cloud Shell (mock)",
  "This is a frontend-only emulator. No real OCI resources are accessed.",
  "",
  'Type "help" to see available mock commands.',
  "",
];

export default function CloudShell({ open, region }) {
  const [lines, setLines] = useState(initialLines);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => {
        scrollToBottom();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newLines = [...lines, `${PROMPT} ${cmd}`, ...runCommand(cmd, region)];
    setLines(newLines);
    setInput("");
  };

  return (
    <div className={`oci-cloudshell ${open ? "open" : ""}`}>
      <div className="oci-cloudshell-header">
        <span>Cloud Shell (mock)</span>
        <span style={{ fontSize: 11, opacity: 0.8 }}>
          Region: {region} • Frontend emulator
        </span>
      </div>
      <div className="oci-cloudshell-body" ref={scrollRef}>
        {lines.map((line, idx) => (
          <div key={idx} className="oci-cloudshell-line">
            {line}
          </div>
        ))}
      </div>
      <form className="oci-cloudshell-input-row" onSubmit={handleSubmit}>
        <span className="oci-cloudshell-prompt">{PROMPT}</span>
        <input
          className="oci-cloudshell-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
      </form>
    </div>
  );
}

function runCommand(cmd, region) {
  if (cmd === "help") {
    return [
      "Available mock commands:",
      "  oci iam region list",
      "  oci ce cluster list",
      "  oci compute instance list",
      "  oci os ns get",
      "  clear",
      "",
    ];
  }

  if (cmd === "clear") {
    return ["[screen cleared] (history still stored above)"];
  }

  if (cmd === "oci iam region list") {
    return [
      "Fetching regions (mock)...",
      "",
      "  NAME              DESCRIPTION",
      "  ap-singapore-1    Singapore",
      "  us-ashburn-1      US East (Ashburn)",
      "  eu-frankfurt-1    Germany Central (Frankfurt)",
      "",
    ];
  }

  if (cmd === "oci os ns get") {
    return [
      "Getting Object Storage namespace (mock)...",
      "",
      '  "data": {',
      '    "namespace": "localstack-namespace"',
      "  }",
      "",
    ];
  }

  if (cmd === "oci ce cluster list") {
    return [
      "Listing OKE clusters (mock)...",
      "",
      "  Currently there are no real clusters. Use this shell in demos to explain OKE commands.",
      "",
    ];
  }

  if (cmd === "oci compute instance list") {
    return [
      "Listing compute instances (mock)...",
      "",
      `  Using region: ${region}`,
      "  This command is not wired to in-memory state yet, it just shows fake output.",
      "",
      '  { "data": [',
      '      { "displayName": "demo-web", "lifecycleState": "RUNNING" },',
      '      { "displayName": "demo-api", "lifecycleState": "STOPPED" }',
      "    ]",
      "  }",
      "",
    ];
  }

  return [
    `Command not recognized in mock shell: "${cmd}"`,
    'Type "help" to see supported mock commands.',
    "",
  ];
}
