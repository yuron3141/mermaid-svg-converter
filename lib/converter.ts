const MERMAID_MD_REGEX = /```mermaid\n(.|\n)*?\n```/gm;
const MERMAID_SVG_REGEX =
  /\[!\[\]\(https:\/\/mermaid\.ink\/img\/(.*?)\)\]\(https:\/\/mermaid-js\.github\.io\/mermaid-live-editor\/#\/edit\/\1\)/gm;

export abstract class Converter {
  static toSVG(markdown: string) {
    return markdown.replace(MERMAID_MD_REGEX, (match) => {
      const code = match.slice(11, -3).trim();
      const jsonString = Buffer.from(
        JSON.stringify({ code, mermaid: { theme: 'default' } })
      ).toString('base64');

      return `[![](https://mermaid.ink/img/${jsonString})](https://mermaid-js.github.io/mermaid-live-editor/#/edit/${jsonString})`;
    });
  }

  static toMarkdown(markdown: string) {
    return markdown.replace(MERMAID_SVG_REGEX, (match, jsonString) => {
      const { code } = JSON.parse(Buffer.from(jsonString, 'base64').toString());
      return markdown.replace(match, `\`\`\`mermaid\n${code}\n\`\`\`\n`);
    });
  }
}
