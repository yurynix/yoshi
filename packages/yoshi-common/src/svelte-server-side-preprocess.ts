const scriptRegex = /(?<=<script>)((.|\n|\r)*)(?=<\/script>)/;

export default function({ packageName }: { packageName: string }) {
  const injectedCode = `

  const modulesContext = require('svelte').getContext('__modules__')

  if (modulesContext) {
    modulesContext(module, '${packageName}')
  }

`;

  return {
    markup: ({ content }: { content: string }) => {
      const scriptContent = scriptRegex.exec(content);

      // Source has a <script> tag
      if (scriptContent) {
        return {
          code: content.replace(scriptRegex, `${injectedCode} $1`),
        };
      }

      // Source doesn't have a <script> tag
      return {
        code: `<script>${injectedCode}</script>\n\n${content}`,
      };
    },
  };
}
