import { withCuratedHangmanTopic, withCuratedMissingWordTopic } from "./topic-pool-utils.js";

export const IT_TOPIC = "IT";
const LEGACY_MISSING_WORD_TOPIC = "IT & Technology";

/**
 * Curated computing, software, networking, data and security terminology.
 * Generic consumer electronics remain outside IT.
 */
export const IT_WORDS = [
  // Everyday computing vocabulary.
  ["Computer", 1], ["Laptop", 1], ["Desktop", 1], ["Keyboard", 1], ["Mouse", 1],
  ["Monitor", 1], ["Printer", 1], ["Scanner", 1], ["Router", 1], ["Modem", 1],
  ["Server", 1], ["Network", 1], ["Internet", 1], ["Website", 1], ["Browser", 1],
  ["Email", 1], ["Password", 1], ["Username", 1], ["Database", 1], ["Software", 1],
  ["Hardware", 1], ["App", 1], ["Program", 1], ["Code", 1], ["File", 1],
  ["Folder", 1], ["Backup", 1], ["Download", 1], ["Upload", 1], ["Wi-Fi", 1],
  ["Bluetooth", 1], ["USB", 1], ["Processor", 1], ["CPU", 1], ["GPU", 1],
  ["Memory", 1], ["RAM", 1], ["Storage", 1], ["Hard Drive", 1], ["Motherboard", 1],
  ["Webcam", 1], ["Firewall", 1], ["Antivirus", 1], ["Malware", 1], ["Hyperlink", 1],
  ["Domain", 1], ["Account", 1], ["Login", 1], ["Update", 1], ["Linux", 1],
  ["Search Engine", 1], ["Web Page", 1], ["QR Code", 1], ["Flash Drive", 1], ["Task Manager", 1],
  ["File Manager", 1], ["User Interface", 1], ["Power Supply", 1], ["Text File", 1], ["Recycle Bin", 1],

  // Material familiar to regular computer users and IT learners.
  ["Windows", 2], ["Android", 2], ["iOS", 2], ["Ethernet", 2], ["Hotspot", 2],
  ["Version Control", 2], ["Open Source", 2], ["Computer Virus", 2], ["Web Server", 2], ["Data Center", 2],
  ["Operating System", 2], ["Virtual Machine", 2], ["Cloud Storage", 2], ["Wireless Network", 2], ["Graphics Card", 2],
  ["Solid State Drive", 2], ["NVMe Drive", 2], ["Password Manager", 2], ["Machine Learning", 2], ["Neural Network", 2],
  ["Network Adapter", 2], ["API", 2], ["Bit", 2], ["Boot", 2], ["Git Branch", 2],
  ["Build", 2], ["Byte", 2], ["Cloud Computing", 2], ["Cookie", 2], ["DNS", 2],
  ["Driver", 2], ["HTML", 2], ["HTTP", 2], ["HTTPS", 2], ["Java", 2],
  ["SQL", 2], ["URL", 2], ["Access Control", 2], ["Adware", 2], ["AES", 2],
  ["AJAX", 2], ["Data Analytics", 2], ["Apache", 2], ["Array", 2], ["Assembler", 2],
  ["Authentication", 2], ["Authorization", 2], ["Autoscaling", 2], ["Backend", 2], ["Binary", 2],
  ["BIOS", 2], ["Bitmask", 2], ["Blockchain", 2], ["Botnet", 2], ["Buffer", 2],
  ["Bug", 2], ["Cache", 2], ["Callback", 2], ["CAPTCHA", 2], ["Certificate", 2],
  ["Chipset", 2], ["Chrome", 2], ["Cipher", 2], ["CLI", 2], ["Network Client", 2],
  ["Clipboard", 2], ["Git Clone", 2], ["Codebase", 2], ["Codec", 2], ["Command Line", 2],
  ["Python", 2], ["JavaScript", 2], ["TypeScript", 2], ["JSON", 2], ["XML", 2],
  ["Git", 2], ["GitHub", 2], ["Docker", 2], ["Compiler", 2], ["Interpreter", 2],
  ["Framework", 2], ["Library", 2], ["Repository", 2], ["Runtime", 2], ["Script", 2],
  ["Variable", 2], ["Function", 2], ["Debugger", 2], ["Patch", 2], ["Plugin", 2],
  ["Kernel", 2], ["Firmware", 2], ["Proxy Server", 2], ["IP Address", 2], ["Subnet", 2],
  ["VPN", 2], ["SSH", 2], ["Encryption", 2], ["Hosting", 2], ["Bandwidth", 2],

  // Specialist concepts reserved for Hard in Missing Word.
  ["Git Commit", 3], ["Compression", 3], ["Concurrency", 3], ["Configuration", 3], ["Container", 3],
  ["Cryptography", 3], ["CSRF", 3], ["Decompiler", 3], ["Deduplication", 3], ["Dockerfile", 3],
  ["Elasticsearch", 3], ["Encapsulation", 3], ["Failover", 3], ["Fault Tolerance", 3], ["Filesystem", 3],
  ["GraphQL", 3], ["Hypervisor", 3], ["Idempotency", 3], ["SQL Injection", 3], ["Kubernetes", 3],
  ["Load Balancer", 3], ["Microservice", 3], ["Namespace", 3], ["OAuth", 3], ["Orchestration", 3],
  ["Packet Loss", 3], ["Port Forwarding", 3], ["Race Condition", 3], ["Ransomware", 3], ["Serialization", 3],
  ["Database Schema", 3], ["Memory Leak", 3], ["Public Key", 3], ["Private Key", 3], ["Digital Signature", 3],
  ["Reverse Proxy", 3], ["Message Queue", 3], ["Database Sharding", 3], ["Rate Limiting", 3], ["Zero-Day Exploit", 3]
];

export function withItMissingWordPool(entries) {
  const withoutLegacyTopic = entries.map((entry) => ({
    ...entry,
    topics: entry.topics.filter((topic) => topic !== LEGACY_MISSING_WORD_TOPIC)
  }));
  return withCuratedMissingWordTopic(withoutLegacyTopic, { topic: IT_TOPIC, words: IT_WORDS });
}

export function withItHangmanPool(entries) {
  return withCuratedHangmanTopic(entries, { topic: IT_TOPIC, words: IT_WORDS });
}
