import { questions } from "../data/questions";
import * as fs from "fs";
import * as path from "path";

const outputPath = path.join(process.cwd(), "questions.export.json");
const jsonContent = JSON.stringify(questions, null, 2);

fs.writeFileSync(outputPath, jsonContent, "utf8");

console.log(`Exported ${questions.length} questions to questions.export.json`);
