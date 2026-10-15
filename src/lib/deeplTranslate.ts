import * as deepl from "deepl-node";
import { deeplLanguageMap, supportedLocales } from "./languages";

const authKey = process.env.DEEPL_API_KEY;
const deeplClient = new deepl.DeepLClient(authKey);

export async function deeplTranslate(
    text: string,
    language: (typeof supportedLocales)[number],
) {
    const result = await deeplClient.translateText(
        text,
        null,
        deeplLanguageMap[language],
    );

    return result.text;
}
