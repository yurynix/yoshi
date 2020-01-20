export default function({ packageName }: { packageName: string }) {
  // Lookbehind assertions are supported in node v9.x.x and above.
  // By putting the regex inside the preprocessor, this isn't going to throw
  // errors for those that use Node v8.x.x.
  const scriptRegex = /(?<=<script>)((.|\n|\r)*)(?=<\/script>)/;

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
