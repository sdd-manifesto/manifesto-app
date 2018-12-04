import * as showdown from "showdown";
import { downloadFile } from "./git";

const converter = new showdown.Converter();
const files = new Map<string, string>();

export async function getFile(name: string, process: (content: string) => Promise<string> = MarkdownConverter): Promise<string> {
    if (files.has(name)) {
        return files.get(name);
    } else {
        const content = await process(await downloadFile(name));
        files.set(name, content);
        return content;
    }
}

export const MarkdownConverter = async (content: string) => converter.makeHtml(content);
